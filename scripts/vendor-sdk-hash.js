const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

/** @typedef {{ integration: string, pinnedUrl: string, integrity: string, floatingUrl: string }} VendorPin */
/** @typedef {{ bytes: Buffer, finalUrl: string, allowOrigin: string | undefined }} VendorDownload */
/** @typedef {{ request?: typeof https.request, timeoutMs?: number, maxBytes?: number, retryDelaysMs?: number[] }} DownloadOptions */
// These loaders already own their pinned URL/hash literals.
const existingArtifactSources = {
  Amplitude: {
    file: 'nativeSdkLoader.js',
    pattern: /a\.integrity\s*=\s*'([^']+)'[\s\S]*?a\.src\s*=\s*'([^']+)'/g,
  },
  Sentry: {
    file: 'browser.js',
    pattern: /SentryScriptLoader\(\s*'[^']+',\s*`([^`]+)`,\s*`([^`]+)`/g,
  },
};

const origin = 'https://www.test-host.com';
const integrityPattern = /^sha384-[A-Za-z0-9+/]{64}$/;

/** Discover registered artifacts and reject unsupported full declarations. @param {string} [integrationsDir] @returns {VendorPin[]} */
function readVendorPins(
  integrationsDir = path.resolve(
    __dirname,
    '../packages/analytics-js-integrations/src/integrations',
  ),
) {
  return fs
    .readdirSync(integrationsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const file = path.join(integrationsDir, entry.name, 'constants.js');
      if (!fs.existsSync(file)) return [];
      const source = fs.readFileSync(file, 'utf8');
      const exported = [];
      for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
        exported.push(...match[1].split(',').map(name => name.trim()));
      }
      const support = source.match(/\bconst\s+VENDOR_SDK_PIN_SUPPORT\s*=\s*(['"])full\1\s*;/);
      if (!exported.includes('VENDOR_SDK_PINNED_URL')) {
        if (!support) return [];
        const metadata = existingArtifactSources[entry.name];
        if (!metadata || !exported.includes('VENDOR_SDK_PIN_SUPPORT'))
          throw new Error(`${entry.name}: full pin support has no registered artifact`);
        const loader = fs.readFileSync(
          path.join(integrationsDir, entry.name, metadata.file),
          'utf8',
        );
        const pins = Array.from(loader.matchAll(metadata.pattern), match => {
          const [pinnedUrl, integrity] =
            entry.name === 'Amplitude' ? [match[2], match[1]] : [match[1], match[2]];
          const pin = { integration: entry.name, pinnedUrl, integrity, floatingUrl: pinnedUrl };
          validatePin(pin);
          return pin;
        });
        if (pins.length !== 2) throw new Error(`${entry.name}: expected two registered artifacts`);
        return pins;
      }
      /** Read a literal exported pin field. */
      const readConstant = name => {
        const match = source.match(
          new RegExp(`\\bconst\\s+${name}\\s*=\\s*(['"])([^'"\\r\\n]+)\\1\\s*;`),
        );
        if (!exported.includes(name) || !match)
          throw new Error(`${entry.name}: missing or nonliteral exported ${name}`);
        return match[2];
      };
      const pin = {
        integration: entry.name,
        pinnedUrl: readConstant('VENDOR_SDK_PINNED_URL'),
        integrity: readConstant('VENDOR_SDK_INTEGRITY'),
        floatingUrl: readConstant('VENDOR_SDK_FLOATING_URL'),
      };
      validatePin(pin);
      return [pin];
    });
}

/** Validate integrity syntax and the existing vendor hostname. @param {VendorPin} pin */
function validatePin(pin) {
  if (!integrityPattern.test(pin.integrity))
    throw new Error(`${pin.integration}: malformed SHA-384 integrity`);
  const pinned = new URL(pin.pinnedUrl);
  const floating = new URL(pin.floatingUrl);
  if (pinned.protocol !== 'https:' || floating.protocol !== 'https:')
    throw new Error(`${pin.integration}: vendor URLs must use HTTPS`);
  if (pinned.hostname !== floating.hostname)
    throw new Error(`${pin.integration}: pinned and floating hostname mismatch`);
}

/** Compute SHA-384 SRI for the downloaded bytes. @param {Buffer} bytes @returns {string} */
function sha384Integrity(bytes) {
  return `sha384-${crypto.createHash('sha384').update(bytes).digest('base64')}`;
}

/** @param {string} url @param {DownloadOptions} [options] @returns {Promise<VendorDownload>} */
async function downloadVendorScript(url, options = {}) {
  const delays = options.retryDelaysMs ?? [1000, 3000];
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await downloadVendorScriptOnce(url, options);
    } catch (error) {
      if (!error.retryable || attempt >= 2) throw error;
      await new Promise(resolve => setTimeout(resolve, delays[attempt] ?? 0));
    }
  }
}

/** Mark transport failures as retryable. @param {Error} error */
function networkError(error) {
  return Object.assign(error, { retryable: true });
}

/** Download once while enforcing host, CORS and size constraints. @param {string} url @param {DownloadOptions} options @returns {Promise<VendorDownload>} */
function downloadVendorScriptOnce(url, options) {
  return new Promise((resolve, reject) => {
    const request = options.request ?? https.request;
    const maxBytes = options.maxBytes ?? 10485760;
    let activeRequest;
    let activeResponse;
    let settled = false;
    const timer = setTimeout(
      () => fail(networkError(new Error('vendor download timeout'))),
      options.timeoutMs ?? 30000,
    );
    /** Stop the active transfer and reject once. */
    function fail(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      activeResponse?.destroy();
      activeRequest?.destroy();
      reject(error);
    }
    let originalHostname;
    /** Follow same-host redirects within the attempt deadline. */
    function download(currentUrl, redirects) {
      try {
        const parsed = new URL(currentUrl);
        if (parsed.protocol !== 'https:') throw new Error('vendor URL must use HTTPS');
        originalHostname ??= parsed.hostname;
        if (parsed.hostname !== originalHostname)
          throw new Error('vendor redirect hostname changed');
        if (redirects > 5) throw new Error('vendor redirect limit exceeded');
        activeRequest = request(
          parsed,
          { headers: { 'Accept-Encoding': 'identity', Origin: origin } },
          response => {
            activeResponse = response;
            response.on('error', error => fail(networkError(error)));
            response.on('aborted', () => fail(networkError(new Error('vendor response aborted'))));
            try {
              const isRedirect = [301, 302, 303, 307, 308].indexOf(response.statusCode) >= 0;
              if (!isRedirect && response.statusCode !== 200) {
                const error = new Error(`vendor HTTP ${response.statusCode}`);
                if (
                  response.statusCode === 429 ||
                  (response.statusCode >= 500 && response.statusCode <= 599)
                )
                  throw networkError(error);
                throw error;
              }
              const allowOrigin = response.headers['access-control-allow-origin'];
              if (allowOrigin !== '*' && allowOrigin !== origin)
                throw new Error('vendor CORS does not allow anonymous SRI');
              if (isRedirect) {
                if (!response.headers.location) throw new Error('vendor redirect missing Location');
                const nextUrl = new URL(response.headers.location, parsed).href;
                response.removeAllListeners('aborted');
                response.removeAllListeners('error');
                response.destroy();
                download(nextUrl, redirects + 1);
                return;
              }
              const encoding = response.headers['content-encoding'];
              const decoders = {
                gzip: zlib.createGunzip,
                br: zlib.createBrotliDecompress,
                deflate: zlib.createInflate,
              };
              let body = response;
              if (encoding && encoding.toLowerCase() !== 'identity') {
                const createDecoder = decoders[encoding.toLowerCase()];
                if (!createDecoder) throw new Error('unsupported vendor content encoding');
                body = response.pipe(createDecoder());
                body.on('error', fail);
              }
              const chunks = [];
              let size = 0;
              body.on('data', chunk => {
                size += chunk.length;
                if (size > maxBytes) {
                  fail(new Error('vendor download byte limit exceeded'));
                  return;
                }
                chunks.push(chunk);
              });
              body.on('end', () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve({ bytes: Buffer.concat(chunks), finalUrl: parsed.href, allowOrigin });
              });
            } catch (error) {
              fail(error);
            }
          },
        );
        activeRequest.on('error', error => fail(networkError(error)));
        activeRequest.end();
      } catch (error) {
        fail(error);
      }
    }
    download(url, 0);
  });
}

/** Hash two matching downloads of the pinned artifact. @param {VendorPin} pin @param {DownloadOptions} [options] @returns {Promise<string>} */
async function computeVendorPin(pin, options) {
  validatePin(pin);
  const first = await downloadVendorScript(pin.pinnedUrl, options);
  const second = await downloadVendorScript(pin.pinnedUrl, options);
  if (!first.bytes.equals(second.bytes))
    throw new Error(`${pin.integration}: pinned downloads differ`);
  return sha384Integrity(first.bytes);
}

/** Verify downloaded bytes against the stored integrity. @param {VendorPin} pin @param {DownloadOptions} [options] @returns {Promise<string>} */
async function verifyVendorPin(pin, options) {
  const computed = await computeVendorPin(pin, options);
  if (computed !== pin.integrity) throw new Error(`${pin.integration}: stored integrity mismatch`);
  return computed;
}

/**
 * Compute a named pin or verify all registered artifacts.
 * @param {string[]} args
 * @param {{ integrationsDir?: string, downloadOptions?: DownloadOptions, stdout?: (line: string) => void, stderr?: (line: string) => void }} [options]
 * @returns {Promise<number>}
 */
async function runCli(args, options = {}) {
  const stdout = options.stdout ?? console.log;
  const stderr = options.stderr ?? console.error;
  try {
    if (args.length !== 1)
      throw new Error('Usage: vendor-sdk-hash <IntegrationDirectoryName> | --verify');
    const pins = readVendorPins(options.integrationsDir);
    if (args[0] === '--verify') {
      if (pins.length === 0) throw new Error('No vendor SDK pins found.');
      for (const pin of pins) {
        await verifyVendorPin(pin, options.downloadOptions);
        stdout(`${pin.integration}: OK (${pin.pinnedUrl})`);
      }
      stdout(`Verified ${pins.length} vendor SDK pins.`);
    } else {
      const pin = pins.find(candidate => candidate.integration === args[0]);
      if (!pin) throw new Error(`Unknown integration: ${args[0]}`);
      stdout(await computeVendorPin(pin, options.downloadOptions));
    }
    return 0;
  } catch (error) {
    stderr(error.message);
    return 1;
  }
}

module.exports = { readVendorPins, sha384Integrity, downloadVendorScript, verifyVendorPin, runCli };
if (require.main === module)
  runCli(process.argv.slice(2)).then(code => {
    process.exitCode = code;
  });

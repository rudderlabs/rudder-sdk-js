const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const crypto = require('node:crypto');

/** @typedef {{ integration: string, pinnedUrl: string, integrity: string, floatingUrl: string }} VendorPin */
/** @typedef {{ bytes: Buffer, finalUrl: string, allowOrigin: string | undefined }} VendorDownload */
/** @typedef {{ request?: typeof https.request, timeoutMs?: number, maxBytes?: number }} DownloadOptions */
const origin = 'https://www.test-host.com';
const integrityPattern = /^sha384-[A-Za-z0-9+/]{64}$/;

/** @param {string} [integrationsDir] @returns {VendorPin[]} */
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
      if (!exported.includes('VENDOR_SDK_PINNED_URL')) return [];
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

/** @param {VendorPin} pin */
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

/** @param {Buffer} bytes @returns {string} */
function sha384Integrity(bytes) {
  return `sha384-${crypto.createHash('sha384').update(bytes).digest('base64')}`;
}

/** @param {string} url @param {DownloadOptions} [options] @returns {Promise<VendorDownload>} */
function downloadVendorScript(url, options = {}) {
  return new Promise((resolve, reject) => {
    const request = options.request ?? https.request;
    const maxBytes = options.maxBytes ?? 10485760;
    let activeRequest;
    let activeResponse;
    let settled = false;
    const timer = setTimeout(
      () => fail(new Error('vendor download timeout')),
      options.timeoutMs ?? 30000,
    );
    function fail(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      activeResponse?.destroy();
      activeRequest?.destroy();
      reject(error);
    }
    let originalHostname;
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
            response.on('error', fail);
            try {
              const isRedirect = [301, 302, 303, 307, 308].indexOf(response.statusCode) >= 0;
              if (!isRedirect && response.statusCode !== 200)
                throw new Error(`vendor HTTP ${response.statusCode}`);
              const allowOrigin = response.headers['access-control-allow-origin'];
              if (allowOrigin !== '*' && allowOrigin !== origin)
                throw new Error('vendor CORS does not allow anonymous SRI');
              if (isRedirect) {
                if (!response.headers.location) throw new Error('vendor redirect missing Location');
                const nextUrl = new URL(response.headers.location, parsed).href;
                response.destroy();
                download(nextUrl, redirects + 1);
                return;
              }
              const encoding = response.headers['content-encoding'];
              if (encoding && encoding.toLowerCase() !== 'identity')
                throw new Error('unsupported vendor content encoding');
              const chunks = [];
              let size = 0;
              response.on('data', chunk => {
                size += chunk.length;
                if (size > maxBytes) {
                  fail(new Error('vendor download byte limit exceeded'));
                  return;
                }
                chunks.push(chunk);
              });
              response.on('end', () => {
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
        activeRequest.on('error', fail);
        activeRequest.end();
      } catch (error) {
        fail(error);
      }
    }
    download(url, 0);
  });
}

/** @param {VendorPin} pin @param {DownloadOptions} [options] @returns {Promise<string>} */
async function computeVendorPin(pin, options) {
  validatePin(pin);
  const first = await downloadVendorScript(pin.pinnedUrl, options);
  const second = await downloadVendorScript(pin.pinnedUrl, options);
  if (!first.bytes.equals(second.bytes))
    throw new Error(`${pin.integration}: pinned downloads differ`);
  return sha384Integrity(first.bytes);
}

/** @param {VendorPin} pin @param {DownloadOptions} [options] @returns {Promise<string>} */
async function verifyVendorPin(pin, options) {
  const computed = await computeVendorPin(pin, options);
  if (computed !== pin.integrity) throw new Error(`${pin.integration}: stored integrity mismatch`);
  return computed;
}

/**
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
        stdout(`${pin.integration}: OK`);
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

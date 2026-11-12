const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const MANIFEST = 'manifest.json';
const REPO = path.resolve(__dirname, '../..');
const sha384 = body => `sha384-${createHash('sha384').update(body).digest('base64')}`;
const releaseError = message =>
  new Error(`${message}. Release a new version; released CDN bytes are immutable.`);

// Read the simple checked-in maps without importing build tooling or TypeScript.
async function resourceCatalog(repo = REPO) {
  const read = file => fs.readFile(path.join(repo, file), 'utf8');
  const config = await read(
    'packages/analytics-js-legacy-utilities/src/config_to_integration_names.js',
  );
  const destinations = await read(
    'packages/analytics-js-integrations/src/constants/Destinations.ts',
  );
  const plugins = await read('packages/analytics-js-plugins/rollup.config.mjs');
  const displayNames = new Map(
    [...destinations.matchAll(/export const (\w+)_DISPLAY_NAME = '([^']+)';/g)].map(
      ([, key, displayName]) => [key, displayName],
    ),
  );
  const integrations = new Map();
  const configMap = config.match(/const configToIntNames = \{([\s\S]*?)\n\};/);
  if (!configMap) throw new Error('Missing integration name map');
  for (const [, key, name] of configMap[1].matchAll(/(\w+): '([^']+)'/g)) {
    const displayName = displayNames.get(key);
    if (!displayName) throw new Error(`Missing integration display name: ${key}`);
    integrations.set(name, { name, displayName });
  }
  if (!integrations.size) throw new Error('Empty integration name map');
  const pluginsMap = plugins.match(/const pluginsMap = \{([\s\S]*?)\n\};/);
  if (!pluginsMap) throw new Error('Missing plugin build map');
  return {
    integrations,
    plugins: [...pluginsMap[1].matchAll(/'\.\/([^']+)':/g)].map(([, name]) => name),
  };
}

function classify(relative, sdk, catalog) {
  const file = path.posix.basename(relative);
  const variant = relative.startsWith('modern/')
    ? 'modern'
    : relative.startsWith('legacy/') || sdk.name === 'rudder-sdk-js'
      ? 'legacy'
      : null;
  let type = 'other';
  let identity = {};
  if (relative.split('/').includes('js-integrations') && file.endsWith('.js.map')) {
    const known = [...catalog.integrations.keys()].some(name =>
      [
        `${name}.js.map`,
        `${name}.min.js.map`,
        `${name}-map.js.map`,
        `${name}-map.min.js.map`,
      ].includes(file),
    );
    if (!known) throw new Error(`Unknown integration file: ${relative}`);
  }
  if (file.endsWith('.map')) type = 'sourcemap';
  else if (file.endsWith('.tar.gz')) type = 'archive';
  else if (file === 'list.html') type = 'listing';
  else if (relative.split('/').includes('js-integrations') && file.endsWith('.js')) {
    type = 'integration';
    // Match known build output paths, rather than inventing a name from a filename.
    for (const [name, details] of catalog.integrations) {
      if ([`${name}.js`, `${name}.min.js`, `${name}-map.js`, `${name}-map.min.js`].includes(file))
        identity = details;
    }
    if (!identity.name) throw new Error(`Unknown integration file: ${relative}`);
  } else if (relative.split('/').includes('plugins') && file.endsWith('.js')) {
    type = 'plugin';
    for (const name of catalog.plugins) {
      if (
        [
          `__federation_expose_${name}.js`,
          `__federation_expose_${name}.min.js`,
          `rsa-plugins-remote-${name}.js`,
          `rsa-plugins-remote-${name}.min.js`,
        ].includes(file)
      ) {
        type = 'plugin';
        identity = { name };
      }
    }
    // Shared chunks and the federation entry point belong to plugins but have no name.
  } else if (/^(?:rsa|rudder-analytics)(?:-map)?(?:\.min)?\.js$/.test(file)) type = 'core';
  else if (/^loader(?:-gtm)?(?:\.min)?\.js$/.test(file)) type = 'loader';
  return { type, variant, ...identity };
}

async function generateManifest(root, { sdk, repo = REPO } = {}) {
  if (!sdk) {
    const pkg = JSON.parse(
      await fs.readFile(path.join(repo, 'packages/analytics-js/package.json')),
    );
    sdk = { name: pkg.name, version: pkg.version };
  }
  if (typeof sdk.name !== 'string' || !sdk.name || typeof sdk.version !== 'string' || !sdk.version)
    throw new Error('SDK name and version are required');
  const catalog = await resourceCatalog(repo);
  const resources = [];
  async function walk(dir, prefix = '') {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) await walk(path.join(dir, entry.name), `${relative}/`);
      else if (entry.isFile() && relative !== MANIFEST) {
        const body = await fs.readFile(path.join(root, relative));
        const { type, variant, ...identity } = classify(relative, sdk, catalog);
        resources.push({
          type,
          variant,
          path: relative,
          integrity: sha384(body),
          size: body.length,
          ...identity,
        });
      } else if (!entry.isFile()) throw new Error(`Unsupported publication entry: ${relative}`);
    }
  }
  await walk(root);
  resources.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return { schemaVersion: 1, sdk: { name: sdk.name, version: sdk.version }, resources };
}

const objectHashes = (manifest, body) => ({
  ...Object.fromEntries(manifest.resources.map(resource => [resource.path, resource.integrity])),
  [MANIFEST]: sha384(body),
});

// Inventory alone cannot detect a build that silently omitted a destination.
// These are the outputs of deploy.yml's production browser targets, not a list
// inferred from whichever files happen to be present in the publication tree.
async function validateCompleteness(root, manifest, { repo = REPO, publishMaps = true } = {}) {
  const catalog = await resourceCatalog(repo);
  const files = new Set(manifest.resources.map(resource => resource.path));
  const missing = new Set();
  const requireFile = file => {
    if (!files.has(file)) missing.add(file);
  };
  const requireScript = file => {
    requireFile(file);
    if (publishMaps) requireFile(`${file}.map`);
  };
  const sdkName = manifest.sdk.name;
  if (sdkName === '@rudderstack/analytics-js-loading-scripts') {
    for (const file of ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'])
      requireFile(file);
  } else if (['@rudderstack/analytics-js', 'rudder-sdk-js'].includes(sdkName)) {
    const v3 = sdkName === '@rudderstack/analytics-js';
    for (const variant of ['legacy', 'modern']) {
      const prefix = variant === 'legacy' && !v3 ? '' : `${variant}/`;
      requireScript(`${prefix}${v3 ? 'rsa' : 'rudder-analytics'}.min.js`);
      for (const name of catalog.integrations.keys())
        requireScript(`${prefix}js-integrations/${name}.min.js`);
    }
    if (v3) {
      // The federation remoteEntry is named rsa-plugins.js by the build config.
      requireScript('modern/plugins/rsa-plugins.js');
      for (const name of catalog.plugins)
        requireScript(`modern/plugins/rsa-plugins-remote-${name}.min.js`);
      for (const file of files) {
        if (!file.startsWith('modern/plugins/') || !file.endsWith('.js')) continue;
        if (publishMaps) requireFile(`${file}.map`);
        const body = await fs.readFile(path.join(root, file), 'utf8');
        // Rollup emits relative strings for static/dynamic imports and the
        // federation module map (whose import() takes a variable). Check all
        // plugin chunks, so transitive dependencies are included as well.
        for (const [, , reference] of body.matchAll(
          /(['"`])(\.{1,2}\/[^'"`\s]+\.js(?:[?#][^'"`\s]*)?)\1/g,
        )) {
          const dependency = path.posix.normalize(
            path.posix.join(path.posix.dirname(file), reference.split(/[?#]/)[0]),
          );
          if (dependency.startsWith('../'))
            throw new Error(`Plugin reference escapes publication: ${file}: ${reference}`);
          requireScript(dependency);
        }
      }
    }
  } else throw new Error(`Unsupported publication SDK: ${sdkName}`);
  if (missing.size)
    throw new Error(`Incomplete publication; missing files:\n${[...missing].sort().join('\n')}`);
}

async function writeManifest(root, options) {
  const manifest = await generateManifest(root, options);
  if (!manifest.resources.length) throw new Error(`Empty publication tree: ${root}`);
  await validateCompleteness(root, manifest, options);
  const body = `${JSON.stringify(manifest, null, 2)}\n`;
  await fs.writeFile(path.join(root, MANIFEST), body);
  // A manifest cannot contain its own digest. It is still checked like every other object.
  return objectHashes(manifest, body);
}

async function loadPublication(root, prefix, { repo = REPO } = {}) {
  if (!/^(?:js-sdk-loader-scripts\/)?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\/$/.test(prefix)) {
    throw new Error(`Expected a versioned prefix with trailing slash: ${prefix}`);
  }
  const body = await fs.readFile(path.join(root, MANIFEST));
  const manifest = JSON.parse(body);
  if (manifest.schemaVersion !== 1)
    throw new Error(`Unsupported manifest schema: ${manifest.schemaVersion}`);
  const version = prefix.split('/').at(-2);
  const name = prefix.startsWith('js-sdk-loader-scripts/')
    ? '@rudderstack/analytics-js-loading-scripts'
    : manifest.sdk?.name === 'rudder-sdk-js'
      ? 'rudder-sdk-js'
      : '@rudderstack/analytics-js';
  const sdk = { name, version };
  const actual = await generateManifest(root, { sdk, repo });
  await validateCompleteness(root, actual, { repo });
  // Compare only schema-1 fields: readers deliberately ignore additive fields.
  const known = {
    schemaVersion: manifest.schemaVersion,
    sdk: { name: manifest.sdk?.name, version: manifest.sdk?.version },
    resources: manifest.resources?.map(
      ({ type, variant, path: file, integrity, size, name: resourceName, displayName }) => ({
        type,
        variant,
        path: file,
        integrity,
        size,
        ...((type === 'integration' || type === 'plugin') && resourceName !== undefined
          ? { name: resourceName }
          : {}),
        ...(type === 'integration' ? { displayName } : {}),
      }),
    ),
  };
  if (JSON.stringify(actual) !== JSON.stringify(known)) {
    throw new Error(`Local publication changed after manifest generation: ${root}`);
  }
  return { root, prefix, manifest, objects: objectHashes(manifest, body) };
}

async function listKeys(io, prefix) {
  const keys = [];
  const seen = new Set();
  let token;
  do {
    const page = await io.list(prefix, token);
    keys.push(...(page.Contents || []).map(object => object.Key));
    if (!page.IsTruncated) break;
    token = page.NextContinuationToken;
    if (!token || seen.has(token)) throw new Error(`Invalid S3 pagination for ${prefix}`);
    seen.add(token);
  } while (true);
  return keys;
}

async function preflight(publication, io) {
  const { prefix, objects: manifest } = publication;
  const matching = new Set();
  for (const key of await listKeys(io, prefix)) {
    const relative = key.slice(prefix.length);
    if (!key.startsWith(prefix) || !Object.hasOwn(manifest, relative)) {
      throw releaseError(`Unexpected existing key ${key}`);
    }
    if (sha384(await io.get(key)) !== manifest[relative]) {
      throw releaseError(`Existing object differs: ${key}`);
    }
    matching.add(relative);
  }
  return matching;
}

function contentType(file) {
  // Preserve the MIME types inferred by aws s3 cp for existing artifacts.
  if (file.endsWith('.tar.gz')) return 'application/x-tar';
  const types = {
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.map': 'application/octet-stream',
    '.html': 'text/html',
    '.gz': 'application/gzip',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
  };
  return types[path.extname(file)] || 'application/octet-stream';
}

async function upload(publication, io, matching, { manifestOnly = false } = {}) {
  for (const [relative, integrity] of Object.entries(publication.objects)) {
    if ((relative === MANIFEST) !== manifestOnly || matching.has(relative)) continue;
    const key = `${publication.prefix}${relative}`;
    try {
      await io.put(key, path.join(publication.root, relative), contentType(relative));
    } catch (error) {
      if (error.code !== 'PreconditionFailed') throw error;
      if (sha384(await io.get(key)) !== integrity) {
        throw releaseError(`Conditional upload collision differs: ${key}`);
      }
    }
  }
}

async function verify(
  publication,
  io,
  { concurrency = 8, attempts = 4, includeManifest = true } = {},
) {
  const { prefix, objects: manifest } = publication;
  const keys = await listKeys(io, prefix);
  const expected = Object.keys(manifest)
    .filter(relative => includeManifest || relative !== MANIFEST)
    .map(relative => `${prefix}${relative}`);
  const expectedSet = new Set(expected);
  const actualSet = new Set(keys);
  const extras = keys.filter(
    key => !expectedSet.has(key) && (includeManifest || key !== `${prefix}${MANIFEST}`),
  );
  const missing = expected.filter(key => !actualSet.has(key));
  if (extras.length || missing.length) {
    throw releaseError(
      `S3 key set differs for ${prefix}; missing: ${missing.join(', ') || 'none'}; extra: ${extras.join(', ') || 'none'}`,
    );
  }
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, expected.length) }, async () => {
      while (index < expected.length) {
        const key = expected[index++];
        for (let attempt = 0; attempt < attempts; attempt += 1) {
          try {
            const response = await io.http(key);
            if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
            if (sha384(response.body) !== manifest[key.slice(prefix.length)]) {
              throw new Error('SHA-384 mismatch');
            }
            break;
          } catch (error) {
            if (attempt === attempts - 1)
              throw releaseError(`CDN verification failed for ${key}: ${error.message}`);
            await io.sleep(1000 * 2 ** attempt);
          }
        }
      }
    }),
  );
}

async function publishAll(publications, io) {
  const matches = [];
  for (const publication of publications) matches.push(await preflight(publication, io));
  for (const [index, publication] of publications.entries()) {
    await upload(publication, io, matches[index]);
    await io.invalidate(publication.prefix);
    await verify(publication, io, { includeManifest: false });
    await upload(publication, io, matches[index], { manifestOnly: true });
    await io.invalidate(publication.prefix);
    await verify(publication, io);
    console.log(
      `Verified ${publication.prefix}: ${Object.keys(publication.objects).length} objects (skipped ${matches[index].size} matching objects)`,
    );
  }
}

function assertMovingDestinations(destinations) {
  const allowed =
    /^(?:(?:staging|dev)\/latest\/|beta\/PR-[1-9]\d*\/[0-9a-fA-F]{7,40}\/)?v(?:3|1\.1)$/;
  if (destinations.length !== 2) throw new Error('Both moving destination inputs are required');
  for (const [index, destination] of destinations.entries()) {
    if (
      typeof destination !== 'string' ||
      destination.split('/').some(segment => /^\d+\.\d+\.\d+/.test(segment)) ||
      destination.match(allowed)?.[0] !== destination ||
      !destination.endsWith(index === 0 ? 'v3' : 'v1.1')
    ) {
      throw new Error(
        `Unsafe moving destination: ${destination}. Use an allowed moving SDK prefix; versioned destinations are forbidden.`,
      );
    }
  }
}

function assertRollbackDestinations(destinations) {
  const allowed = new Set(['v3/', 'v1.1/', 'js-sdk-loader-scripts/latest/']);
  if (destinations.length !== 3 || destinations.some(destination => !allowed.delete(destination))) {
    throw new Error(
      'Rollback destinations must be v3/, v1.1/ and js-sdk-loader-scripts/latest/ only',
    );
  }
}

module.exports = {
  MANIFEST,
  resourceCatalog,
  sha384,
  generateManifest,
  validateCompleteness,
  writeManifest,
  loadPublication,
  listKeys,
  preflight,
  upload,
  verify,
  contentType,
  publishAll,
  assertMovingDestinations,
  assertRollbackDestinations,
};

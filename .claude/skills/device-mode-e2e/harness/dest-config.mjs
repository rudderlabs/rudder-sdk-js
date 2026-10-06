#!/usr/bin/env node
/**
 * dest-config.mjs — read a destination's control-plane contract from rudder-integrations-config and
 * validate a destination config against it.
 *
 * Why: a config override is only useful if it is a config the REAL control plane would send. The
 * authoritative shape lives in rudder-integrations-config:
 *   - `db-config.json` → which keys the control plane sends for a web device-mode connection
 *     (`config.destConfig.web` + `config.destConfig.defaultConfig`)
 *   - `schema.json`    → `configSchema`, a draft-07 JSON Schema for the destination config
 *
 * Generic: no destination is special-cased. Everything is read from those two files.
 *
 * Usage (standalone check of a config file):
 *   node dest-config.mjs --integration <Name> --config <config.json> [--destDir <dir>]
 *                        [--integrationsConfigPath <repo>] [--ref <branch>]
 *
 * Exit codes: 0 = valid, 1 = invalid / not found, 2 = usage.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DEST_SUBPATH = 'src/configurations/destinations';
const RAW_BASE = 'https://raw.githubusercontent.com/rudderlabs/rudder-integrations-config';
/** Default branch of rudder-integrations-config. */
const DEFAULT_REF = 'develop';

/**
 * Reduces a name to a comparable form so `SomeDest`, `somedest` and `Some Dest` all match.
 * @param {string} name Raw destination/integration name.
 * @returns {string} Lowercase, alphanumeric-only form.
 */
const normalizeName = name =>
  String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Picks the local rudder-integrations-config checkout to read from.
 * An explicitly requested path that is not a checkout is an error — silently reading a different
 * repo than the operator asked for would validate against the wrong contract.
 * @param {string|undefined} explicitPath Path passed by the caller or INTEGRATIONS_CONFIG_PATH.
 * @returns {string|null} Repo root to use, or null when there is no checkout (caller falls back to GitHub).
 */
const resolveLocalRoot = explicitPath => {
  const requested = explicitPath ?? process.env.INTEGRATIONS_CONFIG_PATH;
  if (requested) {
    if (!existsSync(join(requested, DEST_SUBPATH))) {
      throw new Error(
        `"${requested}" is not a rudder-integrations-config checkout (no ${DEST_SUBPATH}).`,
      );
    }
    return requested;
  }
  const fallback = join(homedir(), 'workspace/rudder-integrations-config');
  return existsSync(join(fallback, DEST_SUBPATH)) ? fallback : null;
};

/**
 * Finds the destination directory for an integration in a local checkout.
 * An ambiguous name (two directories that normalize alike, or a `<name>` vs `<name>_v2` pair) is
 * an error rather than a silent guess.
 * @param {string} root Repo root of rudder-integrations-config.
 * @param {string} integration Integration folder name as used by the harness.
 * @returns {Promise<string>} Directory name under `src/configurations/destinations`.
 */
const resolveDestDir = async (root, integration) => {
  const needle = normalizeName(integration);
  if (!needle) {
    throw new Error('integration name is required to resolve the integrations-config directory');
  }
  const entries = await readdir(join(root, DEST_SUBPATH), { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
  const exact = dirs.filter(d => normalizeName(d) === needle);
  if (exact.length === 1) {
    return exact[0];
  }
  if (exact.length > 1) {
    throw new Error(
      `"${integration}" matches multiple integrations-config directories (${exact.join(', ')}); pass destDir explicitly.`,
    );
  }
  const near = dirs.filter(d => normalizeName(d).startsWith(needle));
  const hint = near.length ? ` Did you mean: ${near.join(', ')}?` : '';
  throw new Error(`no integrations-config directory matches "${integration}".${hint}`);
};

/**
 * Reads db-config.json + schema.json for a destination directory from a local checkout.
 * @param {string} root Repo root of rudder-integrations-config.
 * @param {string} destDir Destination directory name.
 * @returns {Promise<{dbConfig: object, schema: object}>} Parsed contract files.
 */
const readLocalContract = async (root, destDir) => {
  const base = join(root, DEST_SUBPATH, destDir);
  const [dbConfig, schema] = await Promise.all([
    readFile(join(base, 'db-config.json'), 'utf8').then(JSON.parse),
    readFile(join(base, 'schema.json'), 'utf8').then(JSON.parse),
  ]);
  return { dbConfig, schema };
};

/**
 * Fetches db-config.json + schema.json for a destination directory from GitHub.
 * Raw GitHub cannot list directories, so the directory name must already be known/guessed.
 * @param {string} destDir Destination directory name.
 * @param {string} ref Branch or tag to read.
 * @returns {Promise<{dbConfig: object, schema: object}>} Parsed contract files.
 */
const readRemoteContract = async (destDir, ref) => {
  const fetchJson = async file => {
    const url = `${RAW_BASE}/${ref}/${DEST_SUBPATH}/${destDir}/${file}`;
    const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
    if (!res.ok) {
      throw new Error(
        `GitHub ${res.status} for ${url}` +
          (res.status === 404 ? ' — wrong directory name? pass destDir explicitly.' : ''),
      );
    }
    return res.json();
  };
  const [dbConfig, schema] = await Promise.all([
    fetchJson('db-config.json'),
    fetchJson('schema.json'),
  ]);
  return { dbConfig, schema };
};

/**
 * Loads a destination's contract, preferring a local checkout and falling back to GitHub.
 * @param {object} opts Options.
 * @param {string} opts.integration Integration folder name.
 * @param {string} [opts.destDir] Explicit integrations-config directory (skips name resolution).
 * @param {string} [opts.integrationsConfigPath] Local repo root to prefer.
 * @param {string} [opts.ref] Branch/tag for the GitHub fallback.
 * @param {boolean} [opts.remote] Skip any local checkout and read from GitHub.
 * @returns {Promise<{dbConfig: object, schema: object, source: string, destDir: string}>} Contract plus provenance.
 */
const loadDestinationContract = async ({
  integration,
  destDir,
  integrationsConfigPath,
  ref = DEFAULT_REF,
  remote = false,
}) => {
  const root = remote ? null : resolveLocalRoot(integrationsConfigPath);
  if (root) {
    const dir = destDir ?? (await resolveDestDir(root, integration));
    const contract = await readLocalContract(root, dir);
    return { ...contract, source: `local:${join(root, DEST_SUBPATH, dir)}`, destDir: dir };
  }
  // No checkout: we cannot list directories over raw GitHub, so fall back to the normalized name.
  const dir = destDir ?? normalizeName(integration);
  const contract = await readRemoteContract(dir, ref);
  return { ...contract, source: `github:${ref}/${dir}`, destDir: dir };
};

/**
 * Collects the config keys the control plane sends for a web device-mode connection.
 * @param {object} dbConfig Parsed db-config.json.
 * @returns {{allowed: Set<string>, web: string[], shared: string[]}} Key sets for web runs.
 */
const getWebConfigKeys = dbConfig => {
  const destConfig = dbConfig?.config?.destConfig ?? {};
  const web = Array.isArray(destConfig.web) ? destConfig.web : [];
  const shared = Array.isArray(destConfig.defaultConfig) ? destConfig.defaultConfig : [];
  return { allowed: new Set([...web, ...shared]), web, shared };
};

/**
 * JSON-Schema `type` of a property, normalized to an array (a schema may list several).
 * @param {object|undefined} propSchema Schema for one property.
 * @returns {string[]} Declared types, or [] when the schema declares none.
 */
const typesOf = propSchema => {
  const type = propSchema?.type;
  if (typeof type === 'string') return [type];
  if (Array.isArray(type)) return type.filter(t => typeof t === 'string');
  return [];
};

/**
 * Describes the shape each config key should have **as delivered to a web SDK**.
 *
 * The control plane stores a per-source-type key as an object (`{ web: … }`) but resolves it for the
 * requesting source type, so the SDK receives the inner value. So the expected delivered type is the
 * `web` sub-schema's type for a per-source-type key, and the property's own type otherwise.
 * @param {object} dbConfig Parsed db-config.json.
 * @param {object} schema Parsed schema.json (expects a `configSchema` property).
 * @returns {{keys: Record<string, {types: string[], perSourceType: boolean, scope: string}>, web: string[], shared: string[]}}
 *   Expectation map plus the raw key lists it was built from.
 */
const getExpectedWebShape = (dbConfig, schema) => {
  const properties = schema?.configSchema?.properties ?? {};
  const { web, shared } = getWebConfigKeys(dbConfig);
  const keys = {};
  const add = (key, scope) => {
    const propSchema = properties[key];
    const perSourceType = Boolean(
      propSchema && typesOf(propSchema).includes('object') && propSchema.properties?.web,
    );
    keys[key] = {
      types: perSourceType ? typesOf(propSchema.properties.web) : typesOf(propSchema),
      perSourceType,
      scope,
    };
  };
  web.forEach(key => add(key, 'web'));
  shared.forEach(key => {
    if (!keys[key]) add(key, 'shared');
  });
  return { keys, web, shared };
};

/**
 * The JSON-ish type of a delivered value, in JSON-Schema vocabulary.
 * @param {unknown} value Delivered value.
 * @returns {string} 'null' | 'array' | 'object' | 'string' | 'number' | 'boolean' | typeof value.
 */
const deliveredTypeOf = value => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

/**
 * Checks whether a delivered value matches an expected type list.
 * @param {string[]} expectedTypes Declared types ([] = schema says nothing, so anything passes).
 * @param {unknown} value Delivered value.
 * @returns {boolean} True when the value is acceptable.
 */
const matchesExpectedType = (expectedTypes, value) => {
  if (!expectedTypes || expectedTypes.length === 0) return true;
  const actual = deliveredTypeOf(value);
  if (expectedTypes.includes(actual)) return true;
  // JSON Schema distinguishes integer from number; JS does not.
  return actual === 'number' && expectedTypes.includes('integer');
};

/**
 * Compares a destination config AS DELIVERED to the SDK against the expected web shape.
 *
 * NOTE: template.html reimplements this comparison in browser JS (it runs on the delivered config
 * inside the page). Keep the two in step — same rules, same vocabulary.
 * @param {{keys: Record<string, {types: string[], perSourceType: boolean, scope: string}>}} expected From getExpectedWebShape.
 * @param {object} delivered The config the SDK received for this destination.
 * @returns {{rows: {key: string, expected: string, actual: string, ok: boolean}[], missing: string[], unexpected: string[]}}
 *   Per-key verdicts, keys expected for web but absent, and delivered keys db-config does not list for web.
 */
const compareDeliveredConfig = (expected, delivered) => {
  const config = delivered ?? {};
  const rows = [];
  const missing = [];
  Object.entries(expected.keys).forEach(([key, spec]) => {
    if (!(key in config)) {
      missing.push(key);
      return;
    }
    rows.push({
      key,
      expected: spec.types.length ? spec.types.join('|') : 'any',
      actual: deliveredTypeOf(config[key]),
      ok: matchesExpectedType(spec.types, config[key]),
    });
  });
  const unexpected = Object.keys(config).filter(key => !(key in expected.keys));
  return { rows, missing, unexpected };
};

/**
 * Lists override keys the control plane would not send for a web device-mode connection.
 * @param {object} dbConfig Parsed db-config.json.
 * @param {object} override The config override object.
 * @returns {string[]} Keys outside the web + shared key sets.
 */
const findNonWebKeys = (dbConfig, override) => {
  const { allowed } = getWebConfigKeys(dbConfig);
  if (allowed.size === 0) {
    return [];
  }
  return Object.keys(override ?? {}).filter(key => !allowed.has(key));
};

/**
 * Parses CLI arguments for the standalone check.
 * @param {string[]} argv Arguments after the script name.
 * @returns {object} Parsed options.
 */
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--integration') out.integration = argv[++i];
    else if (a === '--config') out.config = argv[++i];
    else if (a === '--destDir') out.destDir = argv[++i];
    else if (a === '--integrationsConfigPath') out.integrationsConfigPath = argv[++i];
    else if (a === '--ref') out.ref = argv[++i];
    else if (a === '--remote') out.remote = true;
    else if (a === '--strict') out.strict = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

/**
 * Standalone entry point: validate a destination config file against integrations-config.
 * @returns {Promise<void>} Resolves after printing the outcome; sets the exit code.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.integration) {
    console.log(
      'usage: node dest-config.mjs --integration <Name> [--config <delivered-config.json>]\n' +
        '                           [--strict] [--destDir <dir>] [--integrationsConfigPath <repo>]\n' +
        '                           [--remote] [--ref <branch>]\n' +
        '  no --config: print the expected web device-mode config shape.\n' +
        '  --config:    compare a DELIVERED config against it (--strict exits 1 on a TYPE mismatch;\n' +
        '               missing/unlisted keys are reported but never fail - most keys are optional).',
    );
    process.exit(args.help ? 0 : 2);
  }

  const contract = await loadDestinationContract(args);
  const expected = getExpectedWebShape(contract.dbConfig, contract.schema);
  console.log(`contract: ${contract.source}`);

  if (!args.config) {
    console.log(`expected web device-mode config shape (${Object.keys(expected.keys).length} key(s)):`);
    Object.entries(expected.keys).forEach(([key, spec]) => {
      const types = spec.types.length ? spec.types.join('|') : 'any';
      console.log(
        `  ${key.padEnd(32)} ${types.padEnd(18)} ${spec.scope}${spec.perSourceType ? ' (stored per source type, delivered resolved)' : ''}`,
      );
    });
    process.exit(0);
  }

  // A config file is usually the destination's config AS DELIVERED to the SDK (from
  // preflight.mjs --json, or window.__E2E_RESULT__.deliveredConfig).
  const config = JSON.parse(await readFile(args.config, 'utf8'));
  const report = compareDeliveredConfig(expected, config);
  report.rows.forEach(row => {
    const status = row.ok ? 'ok  ' : 'MISMATCH';
    console.log(
      `  ${status} ${row.key.padEnd(32)} expected=${row.expected.padEnd(18)} actual=${row.actual}`,
    );
  });
  if (report.missing.length) {
    console.log(`  missing (expected for web, not delivered): ${report.missing.join(', ')}`);
  }
  if (report.unexpected.length) {
    console.log(`  not listed for web in db-config: ${report.unexpected.join(', ')}`);
  }
  const mismatches = report.rows.filter(r => !r.ok).length;
  console.log(
    `[dest-config] ${mismatches} shape mismatch(es), ${report.missing.length} missing, ${report.unexpected.length} unlisted.`,
  );
  // --strict fails on a TYPE mismatch only. `missing` is informational on purpose: most keys are
  // optional in the schema, so an unset setting is legitimately not delivered. Same rule as the
  // page's configContract: 'strict'.
  process.exit(args.strict && mismatches > 0 ? 1 : 0);
}

export {
  compareDeliveredConfig,
  DEFAULT_REF,
  deliveredTypeOf,
  findNonWebKeys,
  getExpectedWebShape,
  getWebConfigKeys,
  loadDestinationContract,
  matchesExpectedType,
  normalizeName,
};

// Only run the CLI when invoked directly, not when imported by generate.mjs.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch(err => {
    console.error(`[dest-config] ${err.message}`);
    process.exit(1);
  });
}

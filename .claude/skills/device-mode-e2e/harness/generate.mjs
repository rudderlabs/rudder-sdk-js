#!/usr/bin/env node
/**
 * generate.mjs — fill template.html with a run config to produce a self-asserting harness page.
 *
 * Pure templating: NO verification logic and NO destination knowledge lives here. It only
 * substitutes placeholders. The verdict is computed by the page (window.__E2E_RESULT__).
 *
 * Usage:
 *   node generate.mjs --config <config.json> --out <harness.html>
 *
 * Config shape (full schema in README.md):
 *   {
 *     "writeKey": "…",                                              // required
 *     "cdn": "local",                                              // local|production|staging|dev|<https base>
 *     "variant": "modern",                                         // modern|legacy (CDN build)
 *     "sdkUrl": "http://localhost:3001/cdn/modern/iife/rsa.min.js", // required for cdn:local; derived for a CDN
 *     "destSDKBaseURL": "http://localhost:3005/cdn/modern/js-integrations", // required for cdn:local; derived for a CDN
 *     "pluginsSDKBaseURL": "http://localhost:3002/cdn/modern/plugins",      // v3: REQUIRED for cdn:local (derived for a CDN)
 *     "integration": "<Name>",         // optional (enables the bundle name-match check)
 *     "sdkVersion": "v3",              // v3 | v1.1
 *     "dataPlaneUrl": "https://…",     // optional (placeholder default; device mode ignores it)
 *     "configUrl": "https://…",        // optional control-plane override
 *     "settleMs": 6000,                // optional wait before verdict
 *     "events": [ … ],                 // targeted calls derived from the implementation
 *     "expectations": [ … ],           // optional generic assertions on the outgoing requests
 *     "configOverride": { … },         // optional v3 destination-config override (see below)
 *     "preflightJson": "…",            // required with configOverride: preflight.mjs --json output
 *     "destinationId": "…",            // optional: pick the destination explicitly
 *     "destDir": "<dir>",              // optional integrations-config dir (ambiguous names)
 *     "integrationsConfigPath": "…",   // optional local rudder-integrations-config checkout
 *     "integrationsConfigRef": "develop", // optional branch for the GitHub fallback
 *     "integrationsConfigRemote": false   // optional: skip the local checkout, read GitHub
 *   }
 *
 * `configOverride` lets a run vary the destination config WITHOUT editing the dashboard: it becomes
 * the SDK's v3 `sourceConfigurationOverride` load option, which shallow-merges over the config the
 * real sourceConfig call returned (so that call still happens and is still verified). The merged
 * config is validated against the destination's `schema.json` in rudder-integrations-config, so a
 * shape the control plane would never send fails here instead of silently testing fiction.
 *
 * NOTE: pluginsSDKBaseURL is effectively REQUIRED for a v3 local run — omitting it makes the CDN
 * snippet derive the plugins URL from the core script's origin (which serves no plugins), so all
 * plugins incl. device-mode-destinations silently fail. (Not "default public CDN".)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertSafeControlPlaneUrl } from './url-safety.mjs';
import {
  findNonWebKeys,
  getExpectedWebShape,
  loadDestinationContract,
  normalizeName,
} from './dest-config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--config') out.config = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

function usage() {
  return 'usage: node generate.mjs --config <config.json> --out <harness.html>';
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/** A URL that will sit inside an HTML src="" attribute — reject anything that could break out, and
 *  require HTTPS for non-loopback hosts (the page loads SDK code from this URL and embeds the write
 *  key, so an http:// remote URL would let a network attacker swap the SDK / read the key). */
function safeUrlForAttr(url, label) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error(`${label} is required`);
  }
  if (/["'<>]/.test(url)) {
    throw new Error(`${label} contains unsafe characters: ${url}`);
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} must be an absolute http(s) URL: ${url}`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`${label} must be an absolute http(s) URL: ${url}`);
  }
  if (parsed.protocol === 'http:' && !LOOPBACK_HOSTS.has(parsed.hostname)) {
    throw new Error(`${label} must be https:// unless it is a loopback dev URL (localhost/127.0.0.1/::1): ${url}`);
  }
  return url;
}

/**
 * Picks the destination the override applies to out of a preflight snapshot.
 * @param {object[]} destinations Destinations from the preflight snapshot.
 * @param {object} cfg Run config (uses `destinationId` then `integration`).
 * @returns {object} The matched destination entry.
 */
function pickOverrideTarget(destinations, cfg) {
  if (cfg.destinationId) {
    const byId = destinations.find((d) => d.id === cfg.destinationId);
    if (!byId) {
      throw new Error(
        `config.destinationId "${cfg.destinationId}" is not in the preflight snapshot (ids: ${destinations.map((d) => d.id).join(', ') || 'none'}).`,
      );
    }
    return byId;
  }
  if (!cfg.integration) {
    throw new Error('config.configOverride needs config.destinationId or config.integration to know which destination to override.');
  }
  const needle = normalizeName(cfg.integration);
  const matches = destinations.filter((d) =>
    [d.displayName, d.definitionName, d.name].filter(Boolean).some((n) => normalizeName(n) === needle),
  );
  if (matches.length === 0) {
    throw new Error(`"${cfg.integration}" is not in the preflight snapshot — re-run preflight.mjs --json for the right source.`);
  }
  if (matches.length > 1) {
    throw new Error(
      `"${cfg.integration}" matches ${matches.length} destinations in the preflight snapshot; set config.destinationId (ids: ${matches.map((d) => d.id).join(', ')}).`,
    );
  }
  return matches[0];
}

/**
 * Loads the destination's control-plane contract from rudder-integrations-config, or null when it
 * cannot be read (no checkout and no network). A missing contract is NOT fatal: it only means the
 * page skips the delivered-config check.
 * @param {object} cfg Parsed run config.
 * @returns {Promise<{dbConfig: object, schema: object, source: string, destDir: string}|null>} Contract or null.
 */
async function loadContractOrNull(cfg) {
  if (!cfg.integration && !cfg.destDir) {
    return null;
  }
  try {
    const contract = await loadDestinationContract({
      integration: cfg.integration,
      destDir: cfg.destDir,
      integrationsConfigPath: cfg.integrationsConfigPath,
      ref: cfg.integrationsConfigRef,
      remote: cfg.integrationsConfigRemote === true,
    });
    console.log(`[generate] config contract: ${contract.source}`);
    return contract;
  } catch (err) {
    console.warn(
      `[generate] warning: could not read the integrations-config contract (${err.message}).\n` +
        '           The run will skip the delivered-config check.',
    );
    return null;
  }
}

/**
 * Builds the SDK's v3 `sourceConfigurationOverride` from `config.configOverride`.
 *
 * The override is merged into the config the SDK RECEIVED, i.e. values are already resolved for the
 * web source type (`"sdkVersion": "v2"`, not `{ "web": "v2" }`). Schema conformance is not checked
 * here — that is rudder-integrations-config's own job; this harness verifies what the SDK is
 * actually delivered (see `configContract`).
 * @param {object} cfg Parsed run config.
 * @param {string} sdkVersion Resolved SDK version ('v3' | 'v1.1').
 * @param {object|null} contract Destination contract, when available.
 * @returns {Promise<{destinations: {id: string, config: object}[]}|null>} Override for load options.
 */
async function buildConfigOverride(cfg, sdkVersion, contract) {
  const override = cfg.configOverride;
  if (override === undefined || override === null) {
    return null;
  }
  if (typeof override !== 'object' || Array.isArray(override)) {
    throw new Error('config.configOverride must be an object of destination config keys.');
  }
  if (Object.keys(override).length === 0) {
    throw new Error('config.configOverride is empty — remove it or set the keys you want to vary.');
  }
  // sourceConfigurationOverride is a v3 load option; v1.1 has no equivalent.
  if (sdkVersion !== 'v3') {
    throw new Error(
      `config.configOverride needs sdkVersion v3 (got: ${sdkVersion}) — the SDK's sourceConfigurationOverride load option is v3-only.`,
    );
  }

  // The SDK keys overrides by destination id: take it as given, else resolve it from a preflight
  // snapshot. (The snapshot is only needed for the id — nothing is validated against it.)
  let destinationId = cfg.destinationId;
  let label = destinationId;
  if (!destinationId) {
    if (!cfg.preflightJson) {
      throw new Error(
        'config.configOverride needs config.destinationId, or config.preflightJson ' +
          '(preflight.mjs --json <path>) to resolve the id from the connected destinations.',
      );
    }
    const snapshot = JSON.parse(await readFile(cfg.preflightJson, 'utf8'));
    const destinations = Array.isArray(snapshot.destinations) ? snapshot.destinations : [];
    const target = pickOverrideTarget(destinations, cfg);
    if (!target.id) {
      throw new Error('the matched destination in the preflight snapshot has no id — the SDK keys overrides by id.');
    }
    destinationId = target.id;
    label = target.name;
  }

  if (contract) {
    const nonWeb = findNonWebKeys(contract.dbConfig, override);
    if (nonWeb.length) {
      console.warn(
        '[generate] warning: the control plane does not send these keys for a web device-mode ' +
          `connection, so overriding them does not mirror production: ${nonWeb.join(', ')}`,
      );
    }
  }
  console.log(
    `[generate] config override for "${label}" (id=${destinationId}): ${Object.keys(override).join(', ')}`,
  );
  return { destinations: [{ id: destinationId, config: override }] };
}

/**
 * Builds the delivered-config expectations the page checks the real sourceConfig against.
 * @param {object} cfg Parsed run config.
 * @param {object|null} contract Destination contract, when available.
 * @returns {{keys: object, strict: boolean, destinationId: string|null, integration: string|null}|null} Contract payload or null.
 */
function buildConfigContract(cfg, contract) {
  if (!contract) {
    return null;
  }
  if (cfg.configContract !== undefined && !['warn', 'strict'].includes(cfg.configContract)) {
    throw new Error(`config.configContract must be 'warn' (default) or 'strict' (got: ${cfg.configContract}).`);
  }
  const expected = getExpectedWebShape(contract.dbConfig, contract.schema);
  return {
    keys: expected.keys,
    strict: cfg.configContract === 'strict',
    destinationId: cfg.destinationId ?? null,
    integration: cfg.integration ?? null,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.config || !args.out) {
    console.log(usage());
    process.exit(args.help ? 0 : 2);
  }

  const cfg = JSON.parse(await readFile(args.config, 'utf8'));

  if (!cfg.writeKey || typeof cfg.writeKey !== 'string') {
    throw new Error('config.writeKey is required');
  }

  // CDN selection: which build of the SDK to load. `local` = the localhost dev servers (your
  // uncommitted code); the others load the RELEASED SDK for that write key. Explicitly-set
  // sdkUrl/destSDKBaseURL/pluginsSDKBaseURL always win over the derived ones.
  const CDN_BASES = {
    production: 'https://cdn.rudderlabs.com',
    staging: 'https://cdn.staging.rudderlabs.com',
    dev: 'https://cdn.dev.rudderlabs.com',
  };
  const cdn = cfg.cdn || 'local';
  // Validate the documented enums so an unsupported value doesn't get silently coerced (variant) or
  // silently injected (sdkVersion) into the wrong URL/template paths.
  if (cfg.variant !== undefined && cfg.variant !== 'modern' && cfg.variant !== 'legacy') {
    throw new Error(`config.variant must be 'modern' or 'legacy' (got: ${cfg.variant}).`);
  }
  if (cfg.sdkVersion !== undefined && cfg.sdkVersion !== 'v3' && cfg.sdkVersion !== 'v1.1') {
    throw new Error(`config.sdkVersion must be 'v3' or 'v1.1' (got: ${cfg.sdkVersion}).`);
  }
  const variant = cfg.variant === 'legacy' ? 'legacy' : 'modern';
  if (cdn !== 'local') {
    if ((cfg.sdkVersion || 'v3') === 'v1.1' && !cfg.sdkUrl) {
      throw new Error(
        "config.cdn auto-URLs are derived for v3 only; for v1.1 on a CDN set sdkUrl/destSDKBaseURL explicitly.",
      );
    }
    let base = CDN_BASES[cdn];
    if (!base) {
      // A custom CDN base must be HTTPS — the page loads the SDK from it AND embeds the write key,
      // so an http:// base would let a network attacker swap the SDK and read the key.
      if (!/^https:\/\//i.test(cdn)) {
        throw new Error(
          `config.cdn must be 'local', one of [${Object.keys(CDN_BASES).join(', ')}], or an https:// base URL (got: ${cdn}).`,
        );
      }
      base = cdn.replace(/\/+$/, '');
    }
    cfg.sdkUrl = cfg.sdkUrl || `${base}/v3/${variant}/rsa.min.js`;
    cfg.destSDKBaseURL = cfg.destSDKBaseURL || `${base}/v3/${variant}/js-integrations`;
    cfg.pluginsSDKBaseURL = cfg.pluginsSDKBaseURL || `${base}/v3/${variant}/plugins`;
  }

  const sdkUrl = safeUrlForAttr(cfg.sdkUrl, 'config.sdkUrl');
  const destSDKBaseURL = safeUrlForAttr(cfg.destSDKBaseURL, 'config.destSDKBaseURL');

  const events = Array.isArray(cfg.events) ? cfg.events : [];
  // Empty events would fire nothing, yet a stray post-`firstEventAt` request could still satisfy
  // dataSent and the rest, giving a false PASS. Require at least one event (no startup-only mode).
  if (events.length === 0) {
    throw new Error('config.events must contain at least one event — an empty list would test nothing.');
  }

  // For a v3 LOCAL run, an omitted pluginsSDKBaseURL is not "public CDN" — the CDN snippet derives
  // the plugins URL from the core script's origin (the core dev server), which does NOT serve
  // plugins, so ALL plugins (incl. device-mode destinations) silently fail. So it is REQUIRED: fail
  // here rather than write a harness that is guaranteed to load no device-mode destination.
  const sdkVersion = cfg.sdkVersion ?? 'v3';
  if (cdn === 'local' && sdkVersion !== 'v1.1' && !cfg.pluginsSDKBaseURL) {
    throw new Error(
      'config.pluginsSDKBaseURL is required for a v3 local run — without it the CDN snippet derives ' +
        "the plugins URL from the core script's origin (which serves no plugins), so device-mode " +
        'destinations never load. Serve the plugins package and set it, e.g. ' +
        'http://localhost:3002/cdn/modern/plugins.',
    );
  }
  // Same integrity rule as sdkUrl/destSDKBaseURL: a remote plugins base must be HTTPS.
  if (cfg.pluginsSDKBaseURL) safeUrlForAttr(cfg.pluginsSDKBaseURL, 'config.pluginsSDKBaseURL');

  // Same rule as preflight.mjs: the page hands this to the SDK, which puts the write key in the
  // sourceConfig URL and the Authorization header — a remote http:// control plane would leak it.
  if (cfg.configUrl) {
    assertSafeControlPlaneUrl(cfg.configUrl, 'config.configUrl');
  }

  const settleMs = Number.isFinite(cfg.settleMs) ? cfg.settleMs : 6000;

  const contract = await loadContractOrNull(cfg);
  const configOverride = await buildConfigOverride(cfg, sdkVersion, contract);
  const configContract = buildConfigContract(cfg, contract);

  // JSON.stringify does NOT escape `</script>` / a lone `<`, nor U+2028/U+2029 (which it leaves raw
  // but are JS line terminators that break an inline <script> in some parsers). Escape all three to
  // their unicode forms so the injected value stays valid, inert JS.
  const safeJson = (value) =>
    JSON.stringify(value).replace(/[<\u2028\u2029]/g, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));

  // token -> replacement STRING. JS-context tokens use safeJson; the attribute-context SDK URL is the
  // raw (already-validated, quote-free) URL.
  const replacements = {
    __INTEGRATION__: safeJson(cfg.integration ?? null),
    __SDK_VERSION__: safeJson(sdkVersion),
    __WRITE_KEY__: safeJson(cfg.writeKey),
    __DATA_PLANE_URL__: safeJson(cfg.dataPlaneUrl ?? 'https://e2e.dataplane.rudderstack.com'),
    __CONFIG_URL__: safeJson(cfg.configUrl ?? null),
    __DEST_SDK_BASE_URL__: safeJson(destSDKBaseURL),
    __PLUGINS_SDK_BASE_URL__: safeJson(cfg.pluginsSDKBaseURL ?? null),
    __EVENTS_JSON__: safeJson(events),
    __EXPECTATIONS_JSON__: safeJson(Array.isArray(cfg.expectations) ? cfg.expectations : []),
    __SETTLE_MS__: safeJson(settleMs),
    __CONFIG_OVERRIDE_JSON__: safeJson(configOverride),
    __CONFIG_CONTRACT_JSON__: safeJson(configContract),
    __SDK_URL__: sdkUrl,
  };

  // SINGLE pass: replace each template token exactly once. Because substitution happens in one
  // sweep, an injected value that happens to contain another token name (or user-supplied `__FOO__`)
  // is NOT re-scanned, and the leftover check below can't be tripped by user data. An unmapped
  // template token is a template-authoring bug → fail loudly.
  const template = await readFile(join(HERE, 'template.html'), 'utf8');
  const html = template.replace(/__[A-Z_]+__/g, (token) => {
    if (!(token in replacements)) throw new Error(`unmapped placeholder in template: ${token}`);
    return replacements[token];
  });

  await writeFile(args.out, html);
  console.log(
    `[generate] wrote ${args.out} (${events.length} event(s), sdk=${sdkVersion}, cdn=${cdn}, sdkUrl=${cfg.sdkUrl})`,
  );
}

main().catch((err) => {
  console.error(`[generate] ${err.message}`);
  process.exit(1);
});

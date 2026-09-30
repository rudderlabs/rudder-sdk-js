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
 *     "expectations": [ … ]            // optional generic assertions on the outgoing requests
 *   }
 *
 * NOTE: pluginsSDKBaseURL is effectively REQUIRED for a v3 local run — omitting it makes the CDN
 * snippet derive the plugins URL from the core script's origin (which serves no plugins), so all
 * plugins incl. device-mode-destinations silently fail. (Not "default public CDN".)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

  const settleMs = Number.isFinite(cfg.settleMs) ? cfg.settleMs : 6000;

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

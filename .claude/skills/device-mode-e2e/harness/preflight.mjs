#!/usr/bin/env node
/**
 * preflight.mjs — confirm a write key's source actually has the integration connected, BEFORE
 * spending minutes building/serving. Fetches the real sourceConfig (cache-busted) and lists the
 * connected destinations.
 *
 * Generic: it does not special-case any destination. Device-mode vs cloud-mode is surfaced from
 * `connectionMode` when present, but the authoritative device-mode check is the harness run itself.
 *
 * Usage:
 *   node preflight.mjs --writeKey <KEY> [--integration <Name>] [--configUrl <url>]
 *
 * Exit codes: 0 = OK, 1 = integration not found / no enabled destinations, 2 = usage, 3 = fetch error.
 *
 * Control-plane cache lag: a freshly connected destination can take a few minutes to appear. This
 * script cache-busts (unique query param + no-store) so it sees the latest config, not a stale copy.
 */
const DEFAULT_CONFIG_BE_URL = 'https://api.rudderstack.com';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--writeKey') out.writeKey = argv[++i];
    else if (a === '--integration') out.integration = argv[++i];
    else if (a === '--configUrl') out.configUrl = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

// The SDK sends `writeKey` in the query AND authenticates via HTTP Basic auth (base64("<key>:")).
// We mirror both so the request shape matches the real SDK. Note: the query param alone gets a 401 —
// the Basic auth header is what actually authenticates.
function sourceConfigUrl(base, writeKey) {
  // Build with the URL API so a --configUrl with a path/query/hash is handled robustly (existing
  // query params are preserved; the pathname is normalized to end with /sourceConfig/).
  const u = new URL(base || DEFAULT_CONFIG_BE_URL);
  let path = u.pathname.replace(/\/+$/, '');
  if (!/\/sourceConfig$/.test(path)) path += '/sourceConfig';
  u.pathname = `${path}/`;
  u.searchParams.set('p', 'npm');
  u.searchParams.set('v', '3');
  u.searchParams.set('writeKey', writeKey);
  u.searchParams.set('cacheBust', `${process.pid}-${process.hrtime.bigint()}`);
  return u.href;
}

function basicAuthHeader(writeKey) {
  return `Basic ${Buffer.from(`${writeKey}:`).toString('base64')}`;
}

function connectionModeOf(dest) {
  // Best-effort, generic: newer configs carry connectionMode; older ones imply device via useNativeSDK.
  if (dest.config && typeof dest.config.connectionMode === 'string') return dest.config.connectionMode;
  if (dest.config && dest.config.useNativeSDK) return 'device';
  return 'unknown';
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

// Normalize an integration identity for comparison: lowercase, strip non-alphanumerics. So
// `GoogleAds` / `GOOGLEADS` / `Google Ads` / `GOOGLE_ADS` all collapse to `googleads`.
const normId = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.writeKey) {
    console.log('usage: node preflight.mjs --writeKey <KEY> [--integration <Name>] [--configUrl <url>]');
    process.exit(args.help ? 0 : 2);
  }

  // The write key travels in the query AND the Authorization header, so a remote control-plane
  // override MUST be HTTPS (loopback dev endpoints excepted) — otherwise it's sent in cleartext.
  if (args.configUrl) {
    let cp;
    try {
      cp = new URL(args.configUrl);
    } catch {
      console.error(`[preflight] --configUrl is not a valid URL: ${args.configUrl}`);
      process.exit(2);
    }
    if (cp.protocol !== 'https:' && !LOOPBACK_HOSTS.has(cp.hostname)) {
      console.error('[preflight] --configUrl must be https:// (loopback dev endpoints excepted) — it carries the write key.');
      process.exit(2);
    }
  }

  const url = sourceConfigUrl(args.configUrl, args.writeKey);
  let data;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache', Authorization: basicAuthHeader(args.writeKey) },
    });
    if (!res.ok) {
      const hint = res.status === 401 ? ' (401 = write key not recognized)' : '';
      console.error(`[preflight] sourceConfig HTTP ${res.status}${hint} — check the write key / configUrl.`);
      process.exit(3);
    }
    data = await res.json();
  } catch (err) {
    console.error(`[preflight] failed to fetch sourceConfig: ${err.message}`);
    process.exit(3);
  }

  const source = data.source || data;
  const dests = Array.isArray(source.destinations) ? source.destinations : [];

  console.log(`source: ${source.name || '(unknown)'}  enabled=${source.enabled !== false}`);

  // A disabled source aborts sourceConfig processing before any device-mode destination loads, so
  // the run can't deliver — fail here regardless of whether the destination itself is enabled.
  if (source.enabled === false) {
    console.error(`[preflight] source "${source.name || '(unknown)'}" is DISABLED — enable it first; the SDK won't process its config.`);
    process.exit(1);
  }
  if (dests.length === 0) {
    console.error(
      '[preflight] this source has ZERO destinations connected.\n' +
        '            Connect the integration in the dashboard, then retry. Note: a freshly\n' +
        '            connected destination can take a few minutes to appear (this call is\n' +
        '            cache-busted, so it already reflects the latest — just wait and re-run).',
    );
    process.exit(1);
  }

  console.log(`destinations (${dests.length}):`);
  for (const d of dests) {
    const name = (d.destinationDefinition && (d.destinationDefinition.displayName || d.destinationDefinition.name)) || d.name || '(unnamed)';
    console.log(`  - ${name}  enabled=${d.enabled !== false}  connectionMode=${connectionModeOf(d)}`);
  }

  // Without a specific --integration, "connected" must mean at least one ENABLED destination —
  // otherwise the harness can't load any device-mode destination even though destinations exist.
  if (!args.integration && !dests.some((d) => d.enabled !== false)) {
    console.error('[preflight] this source has destinations but NONE are enabled — enable one first.');
    process.exit(1);
  }

  if (args.integration) {
    // Normalized EXACT match (not substring) so `GA` doesn't match `GA360`/`GA4`, while still
    // accepting alias spellings (GoogleAds / GOOGLEADS / Google Ads).
    const needle = normId(args.integration);
    const match = dests.find((d) => {
      const def = d.destinationDefinition || {};
      return [def.name, def.displayName, d.name].filter(Boolean).some((n) => normId(n) === needle);
    });
    if (!match) {
      console.error(`[preflight] "${args.integration}" is NOT connected to this source.`);
      process.exit(1);
    }
    if (match.enabled === false) {
      console.error(`[preflight] "${args.integration}" is connected but DISABLED.`);
      process.exit(1);
    }
    const mode = connectionModeOf(match);
    console.log(`[preflight] OK: "${args.integration}" is connected and enabled (connectionMode=${mode}).`);
    if (mode === 'cloud') {
      console.warn('[preflight] note: connectionMode=cloud — device mode may be off; the run will not see device-mode calls.');
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(`[preflight] ${err.message}`);
  process.exit(3);
});

---
name: device-mode-e2e
description: End-to-end test a device-mode integration change locally. Builds and serves the SDK, derives targeted events from the integration's implementation, generates a self-asserting HTML harness that loads the REAL connection from a write key alone, runs it headlessly, and reports a generic delivery PASS/FAIL (SDK loaded config, initialized the device-mode integration, forwarded events, and fired outbound third-party calls). Use when asked to "e2e test", "run e2e", "verify device mode", or "test my <destination> changes" for any browser device-mode integration. Confirming events inside the destination dashboard stays manual.
argument-hint: <Integration> <writeKey> [v3|v1.1]
---

# Device-mode e2e harness

**Objective:** remove the manual effort of hand-writing an HTML page, opening it, and reading the
Network tab to check whether a device-mode integration change actually forwards events. Given a
**write key alone**, this harness builds and serves the SDK, fires targeted events at the real
connection, and reports a generic PASS/FAIL. It is **destination-agnostic**: no integration-specific
verification is baked in.

## What it verifies (and what it does not)

**Generic, automated (any device-mode integration):**

- the SDK fetched the real `sourceConfig` from the write key **and got a 2xx**,
- it loaded the device-mode integration bundle (`/js-integrations/`),
- `ready()` fired and every event was forwarded without throwing,
- **DATA was actually sent** to a third-party (non-localhost, non-RudderStack) host — a fetch/XHR/
  beacon/pixel, _not_ merely a native-SDK `<script>` load. "native SDK asset loaded" is reported
  separately as info; only "data sent" counts as delivery.

- the destination config **arrived in the SDK with the shape the control-plane contract says** — for
  each key `rudder-integrations-config` lists for a web device-mode connection **and that was
  delivered**, the value has the expected type. A key stored per source type (`{ web: … }`) must
  arrive **resolved** to its inner value, not as an object; this catches delivery bugs the SDK would
  otherwise swallow. Reported as warnings by default; `configContract: "strict"` fails the run on a
  **type mismatch**.
  Keys that are listed but absent are reported as `missing` and are **informational only** — most
  destination settings are optional, so an unset one legitimately never reaches the SDK. Keys
  delivered but not listed appear as `unexpected`, also informational.
  Schema _conformance_ is not checked here — that is rudder-integrations-config's own CI job.

Captured console/page errors (`console.error`, `onerror`, `unhandledrejection`) are shown as
**warnings** — they do not fail the run (third-party SDKs log noise).

**It also SHOWS you the actual outgoing requests** — method, URL, query params, and body — so you can
confirm your fix put the right value in the payload (say, the SDK's `messageId` arriving as the
destination's own event id), not just that _a_ request fired. You can optionally add generic `expectations` to turn a specific
value check into an automated PASS/FAIL (see step 5 and step 7).

**Manual (out of scope — inherently per-destination):** confirming the events _arrived inside_ the
destination's dashboard. The harness ends by reminding you to check it. Do not try to automate this
in the generic skill.

## FIRST: ask the user two things (do not skip, do not choose for them)

Before building or running anything, **ask the user** and wait for their answers:

### 1. Which CDN to load the SDK from?

- **local** (default) — the localhost dev servers, i.e. **your uncommitted code**. Requires the
  build + serve steps.
- **staging** (`https://cdn.staging.rudderlabs.com`) / **production** (`https://cdn.rudderlabs.com`) /
  **dev** (`https://cdn.dev.rudderlabs.com`) — the **released** SDK for that write key. **No build or
  serve needed** — skip steps 2 & 3 (the step-1 preflight still applies). Use this to reproduce a customer issue or verify a config-only
  change against live code.
- **a specific/custom CDN** — any `https://…` base; ask if they want one.

Present those defaults and let them pick (or name a custom base). Set `cdn` (and optional `variant`:
`modern`/`legacy`) in the config accordingly; `local` keeps the explicit localhost URLs.

### 2. Which verification mode?

- **Interactive** — you build/serve (or use the CDN), **open the harness page in their browser**, and
  they click **▶ Run tests** and inspect the report. Best for **onboarding / large changes**.
- **Report** — you run it automatically and hand back the report (test cases used, actual outgoing
  requests, and an **"expected on the `<destination>` dashboard"** summary). Best for **minimal /
  targeted changes** (e.g. eventId-from-messageId).

You may recommend based on the change ("minimal → Report", "config-only → production CDN"), but the
user decides. Only skip a question if they already answered it (or said "just pick"). Do **not**
silently default to Report, do **not** run headless without being asked, and do **not** assume `local`
if they might want to test the released SDK — surface the choice.

## Inputs

- **Integration** — the folder name under
  `packages/analytics-js-integrations/src/integrations/`. Used to locate the source for test-case
  derivation and to match the loaded bundle name. Never used for verification logic.
- **writeKey** (required) — a workspace source that has this integration connected as a device-mode
  destination. The SDK resolves the real connection from this alone.
- **SDK version** — `v3` (default) or `v1.1`.

## Prerequisites

- **The repo's Node version** — pinned in `.nvmrc` at the repo root. The headless runner needs the
  global `WebSocket` (Node ≥ 22), and your shell may default to an older Node; switch first and
  verify:

  ```bash
  nvm use && node -v      # picks up .nvmrc; or point the scripts at an explicit Node >= 22 binary
  ```

- **Chrome/Chromium installed.** The runner probes standard locations; if it can't find yours, set
  `CHROME_PATH`. On macOS the default is:

  ```bash
  export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ```

If Node ≥ 22 or Chrome is unavailable, use the **zero-dep fallback**: serve the generated page over
http (any static server) and open it in your own browser, click **▶ Run tests**, and read the on-page
PASS/FAIL table — no runner needed. (`run-cdp.mjs` is only for the automated report flow.)

## Steps

### 1. Preflight — confirm the write key actually has the integration connected

Do this **first** — it catches "zero destinations" in seconds and is cache-busted (so it reflects a
just-connected destination, not a stale control-plane copy):

```bash
node .claude/skills/device-mode-e2e/harness/preflight.mjs \
  --writeKey <WRITE_KEY> --integration <Integration> --json <temp>/preflight.json
```

Exit `0` = connected & enabled. Exit `1` = not connected / disabled / zero destinations — fix the
connection first. (Add `--configUrl` for a non-default control plane.)

`--json` writes the resolved destinations — **id**, enabled, connectionMode and their **live config**.
It is required only for a config override (step 5), but always worth passing: the printed `id` is
what an override is keyed by. Write it to the same temp dir as the page — it contains the
destination's config.

### 2. Build + serve the SDK, integrations, AND plugins — **only for `cdn: local`**

> **Skip this entire step (and step 3) when the user chose a CDN** (staging/production/dev/custom) — the
> SDK, integrations, and plugins all load from that CDN, so there's nothing to build or serve. Go
> straight to derive test cases (step 4) → config with `cdn` (step 5) → run.

A v3 **local** run needs **three** servers. Run each in its own terminal (they keep watching/serving).
Use the core/v1.1 `:no-open` scripts so their dev servers serve without opening a demo tab on top of
the harness window (plain `start`/`start:modern` still open one):

```bash
# 1) core SDK   → http://localhost:3001  (rsa.min.js under /cdn/<variant>/iife/)
cd packages/analytics-js && npm run start:modern:no-open

# 2) integrations → http://localhost:3005  (bundles under /cdn/<variant>/js-integrations/)
cd packages/analytics-js-integrations && npm run start:modern

# 3) plugins    → http://localhost:3002  (rsa-plugins.js under /cdn/<variant>/plugins/)
cd packages/analytics-js-plugins && npm run start:modern
```

> **Why the plugins server is required (this is the #1 gotcha).** With the CDN snippet, when
> `pluginsSDKBaseURL` is omitted the SDK does **not** fall back to the public CDN — it derives the
> plugins URL from where the **core** script was loaded (`localhost:3001`), which does **not** serve
> plugins. Every plugin then silently fails to load — **including the device-mode-destinations
> plugin**, so no integration bundle is ever requested. You **must** serve the plugins package and set
> `pluginsSDKBaseURL`. (Same mechanism applies to `destSDKBaseURL` for integrations.)

**Faster iteration:** the integrations `start` rebuilds _every_ bundle (minutes). To rebuild just one,
use the targeted CLI build, then serve `dist`:

```bash
cd packages/analytics-js-integrations
BROWSERSLIST_ENV=modern npm run build:integration:cli --intg=<Integration>
npx serve ./dist -p 3005 --cors
```

**Base URLs for a v3 modern build** (use `legacy` instead of `modern` for a legacy build):

- `sdkUrl` = `http://localhost:3001/cdn/modern/iife/rsa.min.js`
- `destSDKBaseURL` = `http://localhost:3005/cdn/modern/js-integrations`
- `pluginsSDKBaseURL` = `http://localhost:3002/cdn/modern/plugins`

For **v1.1**, serve the legacy core (`cd packages/analytics-v1.1 && npm run start:no-open`;
bundle `rudder-analytics.min.js`) and keep the integrations server; v1.1 does not use the remote plugins.
Confirm ports/filenames from each dev-server log — they can differ from your setup.

### 3. Wait for the servers to be ready (local only)

The dev servers are **not** ready immediately (the integrations `start` builds everything first).
Poll until all three bundles return 200 before running:

```bash
for url in \
  http://localhost:3001/cdn/modern/iife/rsa.min.js \
  http://localhost:3005/cdn/modern/js-integrations/<Integration>.min.js \
  http://localhost:3002/cdn/modern/plugins/rsa-plugins.js ; do
  until curl -sf -o /dev/null "$url"; do echo "waiting: $url"; sleep 3; done
done
echo "all servers ready"
```

### 4. Derive targeted test cases from the implementation (the LLM step)

Read the integration source and the change under test, then synthesize a **small, targeted** set of
events — do **not** blast every event type:

```bash
# the implementation
packages/analytics-js-integrations/src/integrations/<Integration>/browser.js   # + utils.js, constants.js, nativeSdkLoader.js
# what changed
git -C <repo> diff -- packages/analytics-js-integrations/src/integrations/<Integration>/
```

Decide which SDK methods the integration implements (`identify`, `track`, `page`, `group`, `alias`)
and which the change touches, and craft events exercising exactly those paths and payload shapes.
Examples: trait handling changed → an `identify` with those traits; a new `track` property mapping →
a `track` carrying that property; page-name handling → a `page` call.

### 5. Write the run config

Create a JSON config (full schema in `harness/README.md`). **Write it to a temp dir outside the repo**
— it contains the write key in plaintext (see Security below):

**`cdn: local`** (build + serve) — give the three localhost URLs:

```json
{
  "writeKey": "<WRITE_KEY>",
  "integration": "<Integration>",
  "sdkVersion": "v3",
  "cdn": "local",
  "sdkUrl": "http://localhost:3001/cdn/modern/iife/rsa.min.js",
  "destSDKBaseURL": "http://localhost:3005/cdn/modern/js-integrations",
  "pluginsSDKBaseURL": "http://localhost:3002/cdn/modern/plugins",
  "settleMs": 6000,
  "events": [
    /* the targeted events derived in step 4 */
  ],
  "expectations": [
    /* optional — see below */
  ]
}
```

**`cdn: staging | production | dev | <https base>`** — omit the three URLs; `generate.mjs` derives
them as `<base>/v3/<variant>/{rsa.min.js, js-integrations, plugins}` (`variant` defaults to `modern`):

```json
{
  "writeKey": "<WRITE_KEY>",
  "integration": "<Integration>",
  "cdn": "production",
  "settleMs": 6000,
  "events": [
    /* … */
  ]
}
```

Explicit `sdkUrl`/`destSDKBaseURL`/`pluginsSDKBaseURL` always override the derived ones. CDN auto-URLs
are v3-only; for v1.1 on a CDN, set them explicitly. Leave `dataPlaneUrl` unset unless you also want
cloud-mode. Set `configUrl` only for a non-default control plane (EU / self-hosted / staging CP).

**Optional `expectations`** turn a specific value check on the outgoing request into an automated
PASS/FAIL (generic — no per-destination logic). Use them when the change is about _what_ the request
carries:

```jsonc
// e.g. a fix that must forward a value into a specific request field
{ "description": "<what this proves>", "requestIncludes": "<expected value>" }
{ "description": "<what this proves>", "requestBodyPath": "<field>", "equals": "<value>" }
```

Both are evaluated **only against DATA requests made after the events fired** (a pre-event startup
request can't satisfy them). `requestIncludes` matches a substring in any such request's URL or body;
`requestBodyPath`+`equals` checks a JSON body field with **strict `===`** (so `1` ≠ `"1"` — match the
type). For a **user-controlled** field, set a recognizable sentinel value in the event and assert it.
For an **SDK-generated** id (`messageId`), you can't predict it — rely on the printed request body
(step 7) instead of a static expectation.

**Optional `configOverride`** varies the **destination config** for one run — without editing the
dashboard. Use it to exercise a config-dependent code path (a version switch, a new setting, a
mapping toggle) across several runs against one connection:

```jsonc
{
  // …the fields above, plus:
  "configOverride": { "<configKey>": "<value>" },
  "destinationId": "<id>", // from step 1; or…
  "preflightJson": "<temp>/preflight.json", // …let the id be resolved from the snapshot
}
```

- **Write it in the shape the SDK receives**, i.e. values already resolved for the web source type:
  `"<configKey>": "<value>"`, **not** `{ "<configKey>": { "web": "<value>" } }`. The override merges
  into the config the integration reads, not into the control plane's stored form. Keys and values
  are whatever the destination under test defines — run `dest-config.mjs` (below) to list them.
- It becomes the SDK's v3 `sourceConfigurationOverride` load option, so the **real `sourceConfig`
  call still happens** and is still verified — only the matched destination's `config` is adjusted
  afterwards.
- The SDK **shallow-merges** it (`{...real, ...override}`), so a nested object is replaced wholesale
  — pass the whole object.
- **v3 only.** `sourceConfigurationOverride` does not exist in v1.1; the combination is rejected.
- It needs the destination **id**: give `destinationId`, or `preflightJson` to resolve it by name.
- `generate.mjs` warns when an overridden key is not one the control plane sends for a **web**
  device-mode connection (`db-config.json`'s `destConfig.web` + `destConfig.defaultConfig`) — such an
  override does not mirror production.
- The delivered-config check reports what the **control plane delivered**, before your override is
  applied — so a mismatch there is about the real connection, not about what you overrode.

To see a destination's expected web shape, or to check a delivered config offline:

```bash
# expected shape (which keys, which delivered type)
node .claude/skills/device-mode-e2e/harness/dest-config.mjs --integration <Integration>
# compare a delivered config (preflight --json, or result.deliveredConfig) against it
node .claude/skills/device-mode-e2e/harness/dest-config.mjs \
  --integration <Integration> --config <delivered-config.json> [--strict]   # --remote reads GitHub
```

The contract is read from a local checkout (`integrationsConfigPath`, env `INTEGRATIONS_CONFIG_PATH`,
else `~/workspace/rudder-integrations-config`), falling back to GitHub (`integrationsConfigRef`,
default `develop`; `integrationsConfigRemote: true` forces it). With no contract available the run
simply skips the check and says so.

### 6. Generate the page, then pick a mode

```bash
# generate (write the page to a temp dir too — it embeds the write key)
node .claude/skills/device-mode-e2e/harness/generate.mjs --config <config.json> --out <harness.html>
```

The page shows the **test cases** it will send and a **▶ Run tests** button; it does nothing until run.
Now run it in **the mode the user chose in the first step** (don't re-decide here):

**Mode A — Interactive.** The runner serves the page (from its **temp dir**) and opens a **headed
window** where they click **▶ Run** and read the on-page report. `--no-autorun` means it waits for the
click instead of auto-running; it stays open until you Ctrl-C. Works the same for **local and any
CDN** (the page loads the SDK from `sdkUrl`, independent of where the page itself is served):

```bash
node .claude/skills/device-mode-e2e/harness/run-cdp.mjs --page <harness.html> --no-autorun
```

> Do **not** copy the page into the repo (`dist/`) — it embeds the write key. The runner serves it
> from a temp dir, so nothing write-key-bearing lands in the working tree.

**Mode B — Report (minimal changes, e.g. eventId-from-messageId).** No clicking: the runner opens the
page, auto-runs it, and prints the full report; reading the result is enough.

```bash
# headed by default (a window opens and auto-runs); add --headless for CI / no display
node .claude/skills/device-mode-e2e/harness/run-cdp.mjs --page <harness.html> \
  --timeout 60000 --json /tmp/e2e-result.json
# --keep-open leaves the window up to inspect; --json dumps the full machine-readable result
```

Exits `0` (PASS) / `1` (FAIL). Both modes render the same three sections: **Test cases used**,
**Outgoing device-mode data requests** (method/URL/query/**body**), and **Expectations**. Headed vs
`--headless` changes nothing in the report — the same detail is printed either way.

### 7. Interpret + confirm — REPRODUCE THE FULL REPORT IN YOUR REPLY

`run-cdp.mjs` prints the report to the **terminal, which the user does not see** — so in Report mode
you must **reproduce the whole report in your reply**, not a one-line "PASS". Paste back, verbatim or
lightly formatted:

- **Test cases used** — every event fired,
- **Outgoing device-mode data requests** — each request with its **body** (this is the proof of the fix),
- **Expectations** — each PASS/FAIL,
- the overall **PASS/FAIL**,
- and the **"expected on the `<destination>` dashboard"** summary (below).

Reducing it to "it passed" defeats the whole point — the detail _is_ the deliverable. (Tip: pass
`--json <path>` and read that file if you need the structured data to build the summary.)

The **Outgoing device-mode data requests** bodies are where the fix is confirmed — the payload shows
the value your change was supposed to put there.

**To reduce the user to a reader (report-first flow):** after a Mode-B run, produce an **"Expected on
the `<destination>` dashboard"** summary so they only have to glance at the dashboard. Build it by
reading the integration's mapping (`browser.js`: identify→attributes, track→custom event,
ecommerce→purchase, alias→id) together with the captured request bodies, and write, per test case,
what should appear. Shape it like this, using the mapping the integration actually implements:

> - `identify <userId>` → a profile with the traits you sent
> - `track "<event name>"` → an event of that name with those properties
> - `track "<ecommerce event>"` → whatever the integration maps it to (e.g. a purchase)
> - `page` → however that integration represents a page view

This narrative is **LLM-authored at report time** — it needs no destination code in the harness (the
request bodies already contain the attributes/events/purchases). On PASS the RudderStack side is
verified; **the only remaining manual step is glancing at the dashboard to confirm arrival.** Fully
automating even that would need a destination **API token** (opt-in per-destination verifier) — out of
scope for the generic skill.

## Version swap

Only the core bundle differs between `v3` and `v1.1`: point `sdkUrl` at the respective served core
(`rsa.min.js` vs `rudder-analytics.min.js`) and set `sdkVersion`. Integration bundles are shared;
`pluginsSDKBaseURL` applies to v3 only.

## Security

The report, the `--json` result and the `preflight --json` snapshot contain the destination's
**delivered config** (which can include destination API keys), and the generated page and run config
**embed the write key in plaintext**. Keep them **out of the repo
and off shared/hosted pages**: write both to a temp dir **outside the working tree** (the runner serves
the page from there — never copy it into the repo), and delete them when done. Never commit them or
paste the page URL into a shared location.

## Troubleshooting

- **`integration bundle loaded: FAIL` / no bundle requested at all** — usually the **plugins** server
  is missing or `pluginsSDKBaseURL` is unset (see step 2's "Why"): the device-mode-destinations plugin
  never loads, so no integration is requested. Confirm `<pluginsSDKBaseURL>/rsa-plugins.js` and
  `<destSDKBaseURL>/<Integration>.min.js` both return 200. Check `modern` vs `legacy` matches your build.
- **`sourceConfig fetched: FAIL`** — wrong write key, or a non-default control plane (set `configUrl`).
- **`DATA sent: FAIL`** — the integration initialized but no data was sent after the events; often the
  source has no such device-mode destination connected (run the step-1 preflight), or the change
  suppressed delivery. (A native-SDK `<script>` load alone does not count as data.)
- **Preflight shows a destination you just connected as missing** — control-plane **cache lag**: a
  freshly connected destination can take a few minutes to propagate. The preflight/SDK calls are
  cache-busted, so re-run after a short wait. To check by hand with a cache-buster:
  ```bash
  curl -s "https://api.rudderstack.com/sourceConfig/?writeKey=<KEY>&p=npm&v=3&t=$(date +%s)" | jq '.source.destinations[].destinationDefinition.name'
  ```
- **`Timed out with no verdict`** — the SDK never became ready; open the page in a browser to see
  console errors. Increase `--timeout` / `settleMs` for slow native SDKs.
- **`needs Node >= 22`** — run `nvm use` to pick up the repo's `.nvmrc` version (see Prerequisites),
  or use the zero-dep fallback.
- **`No Chrome found`** — set `CHROME_PATH` (see Prerequisites) or use the zero-dep fallback.

## Files

- `harness/template.html` — self-asserting page; owns all verification (`window.__E2E_RESULT__`).
- `harness/generate.mjs` — fills the template from a config (pure templating; no verification logic).
- `harness/preflight.mjs` — cache-busted sourceConfig check (is the integration connected?); `--json`
  snapshots destination ids + live configs for a config override.
- `harness/dest-config.mjs` — reads a destination's contract (`db-config.json` + `schema.json`) from
  rudder-integrations-config, derives the expected **web delivered** shape, and compares a delivered
  config against it; also a standalone CLI.
- `harness/run-cdp.mjs` — headless system-Chrome-over-CDP runner (no Puppeteer); reads the verdict.
- `harness/README.md` — config schema, event shapes, extension notes.

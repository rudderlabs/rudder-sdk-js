# device-mode-e2e harness internals

Separate parts, each understandable and testable on its own:

| File              | Responsibility                                                                                                                                                                                | Knows about a destination? |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `template.html`   | Self-asserting page. Shows the test-case plan + a **Run** button, captures network + SDK lifecycle, computes the verdict, exposes `window.__E2E_RESULT__` / `window.__E2E_RUN__`, renders it. | No                         |
| `generate.mjs`    | Pure templating — fills the template from a config.                                                                                                                                           | No                         |
| `preflight.mjs`   | Cache-busted `sourceConfig` check (HTTP Basic auth, like the SDK) — is the integration connected & enabled to the write key's source? `--json` snapshots ids + live configs.                  | No                         |
| `dest-config.mjs` | Reads a destination's control-plane contract (`db-config.json` + `schema.json`) from rudder-integrations-config and validates a config against it. Reads data, holds no destination logic.    | No                         |
| `run-cdp.mjs`     | System-Chrome-over-CDP runner (headed by default); serves the page, auto-runs it, reads `window.__E2E_RESULT__`, prints a report, sets the exit code.                                         | No                         |

The only place destination knowledge enters is **at run time**, when the operator (with LLM help)
derives the `events` list from the integration's implementation. The machinery stays generic.

## Modes

The page is **button-driven**: on load it renders the plan (test cases + expectations) and waits.

- **Interactive** — `run-cdp.mjs --page <html> --no-autorun` serves the page from a temp dir, opens a
  headed window, and waits: the user clicks **▶ Run tests** and reads the on-page report. Works for
  local and any CDN; the write-key page never touches the repo. For onboarding / large changes.
- **Report** — `run-cdp.mjs` opens the page with `?autorun=1` (which calls `window.__E2E_RUN__()`),
  waits for the verdict, and prints the report. For minimal changes where reading the result is enough.

`run-cdp.mjs` flags: **headed by default** (a window opens); `--headless` (CI / no display),
`--no-autorun` (interactive — wait for the click; implies keep-open), `--keep-open` (leave the window
up after the report), `--json <path>` (dump the full result), `--timeout <ms>`. `window.__E2E_RUN__()`
is the single run entry point the button, `?autorun=1`, and CDP all call.

## Config schema (`generate.mjs --config`)

| Field                      | Required                 | Default         | Notes                                                                                                                                                                                      |
| -------------------------- | ------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `writeKey`                 | ✅                       | —               | Source write key; the SDK resolves the real connection from it.                                                                                                                            |
| `cdn`                      | —                        | `local`         | Which SDK build to load: `local`, `production`, `staging`, `dev`, or a custom `https://…` base. Non-`local` derives the three URLs (see below) and needs no build/serve.                   |
| `variant`                  | —                        | `modern`        | `modern` or `legacy` — the CDN build variant used when deriving URLs.                                                                                                                      |
| `sdkUrl`                   | ✅ for `local`           | derived for CDN | Absolute http(s) URL to the core SDK bundle. For a CDN, derived as `<base>/v3/<variant>/rsa.min.js` unless set.                                                                            |
| `destSDKBaseURL`           | ✅ for `local`           | derived for CDN | Base URL of the integration bundles (path contains `/js-integrations/`). For a CDN, `<base>/v3/<variant>/js-integrations`.                                                                 |
| `integration`              | —                        | `null`          | Integration folder name under `src/integrations/`. Enables the "bundle name matched" check.                                                                                                |
| `sdkVersion`               | —                        | `v3`            | `v3` or `v1.1`. CDN URL derivation is v3-only; for v1.1 on a CDN, set the URLs explicitly.                                                                                                 |
| `dataPlaneUrl`             | —                        | a placeholder   | Only needed for cloud-mode; device-mode + `sourceConfig` ignore it.                                                                                                                        |
| `configUrl`                | —                        | unset           | Control-plane override (EU / self-hosted).                                                                                                                                                 |
| `pluginsSDKBaseURL`        | ✅ for v3 local          | derived for CDN | v3 plugins base URL (e.g. `http://localhost:3002/cdn/modern/plugins`); for a CDN, `<base>/v3/<variant>/plugins`. See the caveat below — omitting it on a **local** run breaks device mode. |
| `settleMs`                 | —                        | `6000`          | Wait after firing events before computing the verdict.                                                                                                                                     |
| `events`                   | ✅                       | —               | The targeted calls (≥1 — an empty list is rejected; see below).                                                                                                                            |
| `expectations`             | —                        | `[]`            | Optional generic assertions against the outgoing requests (see below).                                                                                                                     |
| `configOverride`           | —                        | unset           | Destination config keys to vary for this run (v3 only — see below). Non-empty object.                                                                                                      |
| `preflightJson`            | ✅ with `configOverride` | —               | Path to `preflight.mjs --json` output: supplies the destination id and the live config the override is merged onto and validated against.                                                  |
| `destinationId`            | —                        | derived         | Which destination the override applies to. Required when `integration` matches more than one destination in the snapshot.                                                                  |
| `destDir`                  | —                        | derived         | rudder-integrations-config directory for the destination; needed when two directories normalize alike (e.g. a `<name>` / `<name>_v2` pair).                                                |
| `integrationsConfigPath`   | —                        | see below       | Local rudder-integrations-config checkout. Falls back to `INTEGRATIONS_CONFIG_PATH`, then `~/workspace/rudder-integrations-config`. A path that is not a checkout is an error.             |
| `integrationsConfigRef`    | —                        | `develop`       | Branch/tag for the GitHub fallback (used when no local checkout is found).                                                                                                                 |
| `integrationsConfigRemote` | —                        | `false`         | Skip any local checkout and read the contract from GitHub.                                                                                                                                 |

> **`pluginsSDKBaseURL` is effectively required for a v3 local run.** With the CDN snippet the SDK
> only falls back to the public CDN for **npm** installs. For a CDN install (this harness) it derives
> the plugins URL from the **core script's origin** — your local core server, which does not serve
> plugins — so every plugin, **including the device-mode-destinations plugin**, fails to load and no
> integration bundle is ever requested. Serve the plugins package and set this. (`generate.mjs` warns
> when it is missing for a v3 run.) `destSDKBaseURL` works the same way for integration bundles.

## Event shapes (`events[]`)

```jsonc
{ "type": "identify", "userId": "u1", "traits": { "email": "a@b.com" } }
{ "type": "track",    "event": "Order Completed", "properties": { "revenue": 42.5 } }
{ "type": "page",     "category": "Docs", "name": "Home", "properties": { "path": "/" } }
{ "type": "group",    "groupId": "g1", "traits": { "name": "Acme" } }
{ "type": "alias",    "to": "newId", "from": "oldId" }
```

Fire only what the change under test exercises — keep the list small and targeted.

## Seeing the actual requests (visibility)

Proving a request _fired_ is not enough to know a fix worked — you need to see **what was in it**
(did the SDK's `messageId` land in the field the destination expects?). So the harness captures each outgoing device-mode
request's **method, URL, query params, and body** via the `fetch`/`XHR`/`sendBeacon` patches, and prints
them under **"Outgoing device-mode data requests"** (and renders them on the page). Bodies are
pretty-printed (JSON parsed) and truncated. (Image/pixel requests are seen by `PerformanceObserver`
only — it gives the URL/query but **no body**, since we don't override `window.Image`.)

To verify a specific value:

- **User-controlled field** (a trait/property you set): put a recognizable sentinel value in the event
  and assert it appears — see `requestIncludes` below.
- **SDK-generated id** (`messageId`, `anonymousId`): the SDK generates these and ignores caller-supplied
  ones, so read the shown request body/query and confirm the value looks right. Optional: set a real
  `dataPlaneUrl` so the SDK's own event POST (which carries `messageId`) is also captured, letting you
  compare it against the destination request side by side.

## Optional expectations (`expectations[]`)

Opt-in, generic assertions over the **post-event** data requests (`dataRequestsAfterEvents` — not
script loads, not the SDK's pre-event startup requests). When present, each becomes a PASS/FAIL row and
a failure fails the run. No per-destination logic.

```jsonc
// substring appears in any post-event data request (URL or body)
{ "description": "eventId is forwarded", "requestIncludes": "<value>" }
// a post-event JSON body has this dotted path, compared with strict === (so 1 !== "1")
{ "description": "eventId equals messageId value", "requestBodyPath": "eventId", "equals": "<value>" }
```

## Delivered destination config (`configContract`)

Schema conformance is rudder-integrations-config's own CI concern. What this harness can check is
**delivery**: the page keeps the `sourceConfig` response the SDK actually parsed (the v3 SDK fetches
it over XHR, which the capture layer already patches), pulls out the matched destination's config,
and compares it against the contract.

Expectations come from `dest-config.mjs`:

- which keys should be present → `db-config.json`'s `destConfig.web` + `destConfig.defaultConfig`;
- which type each should arrive as → `schema.json`'s `configSchema.properties[key]`, **unwrapping**
  per-source-type properties: a key stored as `{ web: … }` is delivered resolved, so its expected
  type is the `web` sub-schema's type. That is what catches "we sent an object, the SDK got an
  object" when it should have arrived as a string.

The result carries `deliveredDestination` (id/name/enabled), `deliveredConfig` (that destination's
config only — the full payload is dropped, since it holds every destination's settings) and
`configContract`:

```jsonc
{
  "checked": true,
  "strict": false,
  "rows": [
    {
      "key": "<perSourceTypeKey>",
      "expected": "string",
      "actual": "object",
      "scope": "web",
      "ok": false,
    },
  ],
  "missing": ["sendPageNameInSDK"], // expected for web, not delivered
  "unexpected": ["someUnlistedKey"], // delivered, not listed for web in db-config
  "mismatches": 1,
}
```

Type mismatches are **warnings** by default (destination contracts vary; false failures would be
worse than a visible warning). `configContract: "strict"` promotes **mismatches** to run failures.

`missing` and `unexpected` are **informational and never fail the run**, in either mode: most keys in
`destConfig.web` / `destConfig.defaultConfig` are optional in the schema, so a setting nobody
configured simply is not delivered — failing on that would fire on healthy connections. They are
reported separately from `mismatches` so a genuinely absent key is still visible. `dest-config.mjs
--strict` follows the same rule, so the CLI and the page agree.

With no contract available (no checkout, no network) the check is skipped and `checked: false` says
why.

## Optional destination config override (`configOverride`)

Varies the destination's config for one run so a config-dependent path can be exercised without
editing the dashboard between runs. It is **not** a mocked `sourceConfig`: the SDK still fetches the
real one (that call stays part of the verdict) and the override is applied to the matched destination
afterwards, via the v3 `sourceConfigurationOverride` load option.

```jsonc
{
  "destinationId": "2mX9kQ…",
  "configOverride": { "<configKey>": "<value>" },
}
```

- Write it in the **delivered** shape (`"<configKey>": "<value>"`), not the stored `{ web: … }` form
  — it merges into the config the integration reads. `dest-config.mjs` lists a destination's keys.
- The merge is **shallow** (`{...real, ...override}`), as in `applySourceConfigurationOverrides`: a
  nested object is replaced wholesale.
- Needs the destination **id**: `destinationId`, or `preflightJson` to resolve it from the snapshot.
- Keys outside `destConfig.web` + `destConfig.defaultConfig` produce a warning — the control plane
  would not send them for a web connection.
- **v3 only**; combining it with v1.1 is rejected rather than silently ignored.
- The applied override is echoed into `window.__E2E_RESULT__.configOverride`, the on-page report and
  the runner's report, so no run can look like it used the dashboard config when it did not.

## Verdict (`window.__E2E_RESULT__`)

`pass` is `true` only when all hold: `ready`, `loadError == null`, `sourceConfigOk` (fetched **and**
2xx), `integrationBundleLoaded`, every event fired without throwing, **`dataSent`**, and **every
supplied expectation passed**. `failures[]` lists any that did not.

> **`dataSent` is a WEAK signal.** It's true when ≥1 third-party fetch/XHR/beacon/pixel is seen **after
> the events fired** (`firstEventAt`) — a native-SDK `<script>` load or its own startup/config fetch
> does not count. But it only proves _something_ went out, not that _your_ value did — and warnings no
> longer fail the run, so a broken init could still reach `dataSent`. **For the values that matter, use
> `expectations`** (which check the `dataRequests` bodies).

Other fields: `warnings[]` (captured `console.error`/`onerror`/`unhandledrejection` — shown, **never
fatal**), `nativeSdkLoaded` (info), `dataRequests[]` / `dataRequestsAfterEvents[]` (the delivery
requests, each with `method`/`url`/`query`/`body`/`status`), `expectations[]`
(`{ description, pass, detail }`), `testCases[]` (input events). The check fields
default to `null` = "not evaluated"; `finish()` sets them, so a runner that times out before the
verdict prints "not evaluated" rather than a misleading FAIL. Runner exits `0` on pass, `1` otherwise
(and `--json` writes the whole object to disk).

**Third-party classification is generic:** everything on `localhost`/`127.0.0.1` is our own infra
(core SDK, integration bundles, plugins, this page), and RudderStack hosts are excluded, so any _other_
host is a device-mode call-out. A call is "data" unless it's a `<script>`/`.js`/`.css` asset load. No
per-destination host list.

**Capture is via `PerformanceObserver('resource')`** (sees every resource, incl. `<script>` tags and
img pixels the API patches can't) plus `fetch`/`XHR`/`sendBeacon` patches for the method, **request
body**, and status. A patch-captured call is always kept (distinct); a PO entry is a backstop, added
only for a URL no patch already recorded. We deliberately do **not** override `window.Image` (it would
change the page under test) — pixels come from the observer.

## Security

The config and the generated page **embed the write key in plaintext**, and the `--json` result and
`preflight --json` snapshot carry the destination's delivered config (possibly its API keys). Write
them to a temp dir outside the working tree and delete them when done.

Layout matters: keep the page in a directory of its **own** (`<temp>/page/harness.html`) with the run
config and `preflight.json` one level up. Every script running in the page's origin — the
destination's own SDK included — can fetch anything served beside the page. `run-cdp.mjs` serves only
the requested HTML file and sets no `Access-Control-Allow-Origin`, so neither a sibling file nor
another web origin can read it; a static server used for the zero-dep fallback only has that
property if you point it at the isolated directory.

## Extending

- Other browser device-mode integrations: nothing to change — pass a different `integration` and
  `events`.
- If you ever want a real "arrived in the destination" assertion, add it as an **optional**
  per-destination verifier invoked after this harness; keep it out of these generic files.

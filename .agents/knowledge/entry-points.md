# Entry points

> Key entry-point files: read these first to orient in this repo.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## First-Read Map (RUD-2781)
<!-- linear:RUD-2781 -->

- `README.md` — product-level SDK usage, migration context, and v3 behavior notes (explicit `page` call, install paths) (`README.md:1`).
- `CLAUDE.md` — repo-specific development commands, package map, and architecture hints used by automation agents (`CLAUDE.md:1`).
- `package.json` (root) — authoritative task runner surface (`setup`, `build:*`, `test:*`, lint/size/security checks) and top-level dependency versions (`package.json:1`).
- `packages/analytics-js/src/browser.ts` — modern v3 browser bundle export surface wiring global singleton methods (`packages/analytics-js/src/browser.ts:1`).
- `packages/analytics-js/src/app/RudderAnalytics.ts` — v3 public facade and preload/global bootstrap behavior (`packages/analytics-js/src/app/RudderAnalytics.ts::RudderAnalytics`).
- `packages/analytics-js/src/components/core/Analytics.ts` — v3 lifecycle engine, service composition, and initialization sequence (`packages/analytics-js/src/components/core/Analytics.ts::Analytics`).
- `packages/analytics-v1.1/src/core/analytics.js` — legacy line core implementation (class-centric runtime still shipped as `rudder-sdk-js`) (`packages/analytics-v1.1/src/core/analytics.js::Analytics`).
- `packages/loading-scripts/src/index.ts` — snippet loader that buffers calls and chooses modern vs legacy runtime script dynamically (`packages/loading-scripts/src/index.ts:1`).

## SDK-5014 — Amplitude V2 Autocapture Entry Points

- Amplitude device-mode integration work lives under `packages/analytics-js-integrations/src/integrations/Amplitude/`; for v2 autocapture changes, start with `browser.js` for initialization, `utils.js` for helper getters, and `constants.js` for integration constants.
- Existing Jest coverage for Amplitude Browser SDK v2 initialization payload shape is in `packages/analytics-js-integrations/__tests__/integrations/Amplitude/browser.test.js`; helper behavior is covered in `packages/analytics-js-integrations/__tests__/integrations/Amplitude/util.test.js`.

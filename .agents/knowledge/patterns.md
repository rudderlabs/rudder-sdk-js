# Patterns

> Recurring idioms specific to this repo (error handling, state management,
> retries, logging, DI, request lifecycle).
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.
> Every observed idiom includes a `file:line` reference.

## Core Runtime Patterns (RUD-2781)
<!-- linear:RUD-2781 -->

- Public API guards use `try/catch` with centralized dispatch (`dispatchErrorEvent`) so facade methods fail soft instead of throwing to callers (`packages/analytics-js/src/app/RudderAnalytics.ts::RudderAnalytics.load`).
- Lifecycle orchestration uses `@preact/signals-core` effects rather than imperative state machines; side effects subscribe to lifecycle and destination readiness transitions (`packages/analytics-js/src/components/core/Analytics.ts::Analytics.startLifecycle`, `packages/analytics-js/src/components/eventRepository/EventRepository.ts::EventRepository.init`).
- Internal services are composed in one place (`prepareInternalServices`) and injected into managers, giving lightweight DI without a framework container (`packages/analytics-js/src/components/core/Analytics.ts::Analytics.prepareInternalServices`).
- Event flow separates creation and transport: factory-built events are queued first, then queue plugins handle delivery/transform/retry (`packages/analytics-js/src/components/eventManager/EventManager.ts::EventManager.addEvent`, `packages/analytics-js/src/components/eventRepository/EventRepository.ts::EventRepository.enqueue`).
- Plugin calls prefer extension-point invocation (`invokeSingle`/`invokeMultiple`) to keep queue and destination behaviors swappable (`packages/analytics-js/src/services/PluginEngine/PluginEngine.ts::PluginEngine.invokeSingle`).
- Load-time buffering is a consistent behavior: preload snippet arrays and in-memory queues are drained after initialization to preserve call order (`packages/loading-scripts/src/index.ts:12`, `packages/analytics-js/src/components/core/Analytics.ts::Analytics.processDataInPreloadBuffer`).
- Legacy v1.1 still follows class-centric mutable state and explicit polling for integration readiness (`allModulesInitialized` Promise loop), unlike v3 reactive effects (`packages/analytics-v1.1/src/core/analytics.js::Analytics.allModulesInitialized`).

## SDK-5014 — Amplitude V2 Autocapture Config Boundaries

- Amplitude Browser SDK v2 autocapture config is assembled in `packages/analytics-js-integrations/src/integrations/Amplitude/browser.js:init()` using helper getters from `packages/analytics-js-integrations/src/integrations/Amplitude/utils.js`.
- The dedicated `pageViews` config key maps only to the Amplitude SDK `autocapture.pageViews` option; it intentionally does not affect Rudder `page()` translation gates such as `trackAllPages`, `trackCategorizedPages`, or `trackNamedPages`.

## AI-1258 — Bing Ads Event ID Deduplication Tests

- For Bing Ads event deduplication, pair browser-level payload tests with direct utility tests for `getEventId` precedence/exclusion so the FacebookPixel-compatible resolution order (`traits.event_id` → `context.traits.event_id` → `properties.event_id` → `messageId`) remains explicit and easier to diagnose if regressions occur (`packages/analytics-js-integrations/__tests__/integrations/BingAds/browser.test.js`, `packages/analytics-js-integrations/__tests__/integrations/BingAds/utils.test.js`).
## ANA-123 — Sanity Suite SourceConfig Fixture Parity

- Sanity-suite sourceConfig fixtures must mirror live sourceConfig destination configs exactly except explicitly ignored fields; Amplitude web device-mode fixture configs include flattened `config.sdkVersion: 1` after `config.residencyServer` in `packages/sanity-suite/__fixtures__/sourceConfig1.json` and `packages/sanity-suite/__fixtures__/sourceConfigDMT1.json`.

## INT-6620 — DCM Floodlight Per-Event Fallbacks

- DCM Floodlight device-mode per-event `floodlightActivityTag`, `floodlightGroupTag`, and `floodlightCountingMethod` should be treated as absent when blank or whitespace-only, then resolved independently with `?.trim() ||` the destination-level default (`packages/analytics-js-integrations/src/integrations/DCMFloodlight/browser.js`).
- Per-track DCM Floodlight overrides should remain local values passed through the track flow rather than being written to `this.*`, so a persistent SPA integration instance does not carry one event's tags or counting method into later events (`packages/analytics-js-integrations/src/integrations/DCMFloodlight/browser.js`).
- Resolve and trim DCM Floodlight activity/group tags inside `track()`, validate the resolved local tags there, and keep `trackWithGtag()`/`trackWithIframe()` as consumers of already-resolved values instead of duplicating tag validation in those transport helpers (`packages/analytics-js-integrations/src/integrations/DCMFloodlight/browser.js`).
## INT-6982 — Google Ads Enhanced Conversions Identify Match Keys

- Google Ads device-mode Enhanced Conversions identify validation in `packages/analytics-js-integrations/src/integrations/GoogleAds/browser.js` accepts non-empty traits when either `traits.email` is truthy or the complete address match-key group (`firstName`, `lastName`, `postalCode`, `country`) is truthy; `phone` is optional and is passed through by `generateUserDataPayload` when available.
- Empty or missing traits continue to use the existing `Traits are mandatory for identify call` rejection path; non-empty traits without email/full-address log `Either email or full address (firstName, lastName, postalCode, country) is required for identify call`.

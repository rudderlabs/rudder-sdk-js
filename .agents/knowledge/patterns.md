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

## INT-6511 — Bing Ads dedup identifier precedence

- In `packages/analytics-js-integrations/src/integrations/BingAds/utils.js`, `buildEcommPayload` treats `properties.event_id` as the highest-precedence source for `payload.transaction_id` (ahead of existing `transaction_id`, `order_id`, and `checkout_id` aliases) so conversion identity is stable for Bing deduplication.
- The same file adds `event_id` to `EXCLUSION_KEYS`, which prevents the identifier from being duplicated as an extra custom property when building Bing event payloads.

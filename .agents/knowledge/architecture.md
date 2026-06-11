# Architecture

> Component layout, internal relationships, data flow.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Baseline Architecture (RUD-2781)
<!-- linear:RUD-2781 -->

- The modern SDK (v3) is a facade-plus-core split: `RudderAnalytics` normalizes overloaded public APIs and delegates to one or more `Analytics` core instances (`packages/analytics-js/src/app/RudderAnalytics.ts::RudderAnalytics`, `packages/analytics-js/src/components/core/Analytics.ts::Analytics`).
- v3 startup is lifecycle-driven via reactive state transitions (`mounted -> ... -> ready`) in `Analytics.startLifecycle`, with each phase initializing a subsystem (`packages/analytics-js/src/components/core/Analytics.ts::Analytics.startLifecycle`).
- Global state is centralized and slice-based (`state.lifecycle`, `state.plugins`, `state.nativeDestinations`, etc.), enabling cross-service coordination without direct hard coupling (`packages/analytics-js/src/state/index.ts::state`).
- Config resolution feeds architecture decisions: `ConfigManager.init/processConfig` computes CDN paths, source config URL, and destination/plugin selection before moving to `configured` state (`packages/analytics-js/src/components/configManager/ConfigManager.ts::ConfigManager.init`, `packages/analytics-js/src/components/configManager/ConfigManager.ts::ConfigManager.processConfig`).
- Event ingestion and delivery are layered as `EventManager -> EventRepository -> plugin extension points`, where queues are plugin-provided and controlled by consent/destination readiness (`packages/analytics-js/src/components/eventManager/EventManager.ts::EventManager.addEvent`, `packages/analytics-js/src/components/eventRepository/EventRepository.ts::EventRepository.init`).
- Plugin orchestration is first-class in v3: `PluginsManager` derives active plugins from source/load options, registers local+remote plugins, and gates lifecycle on plugin readiness (`packages/analytics-js/src/components/pluginsManager/PluginsManager.ts::PluginsManager.init`).
- Legacy v1.1 remains as a separate line with a monolithic `Analytics` class handling config fetch, integrations loading, and queues in one class graph (`packages/analytics-v1.1/src/core/analytics.js::Analytics`, `packages/analytics-v1.1/project.json:1`).
- Monorepo tags explicitly encode the split (`scope:analytics-v3` vs `scope:analytics-v1.1`) so build/test/release flows can target modern and legacy independently (`packages/analytics-js/project.json:8`, `packages/analytics-v1.1/project.json:6`).

## Cross-cutting
<!-- linear:RUD-2781 -->

- Lifecycle state is the central coordination contract across architecture, patterns, and concerns: facade/core initialization, plugin readiness, and queue start conditions all hinge on shared signal slices (`packages/analytics-js/src/components/core/Analytics.ts::Analytics.startLifecycle`, `packages/analytics-js/src/state/index.ts::state`, `packages/analytics-js/src/components/eventRepository/EventRepository.ts::EventRepository.init`).
- Plugin extensibility is both an architecture strength and an operational risk: the same extension-point model that enables transport/consent/destination modularity also concentrates TODOs around retry/failure behavior (`packages/analytics-js/src/components/pluginsManager/PluginsManager.ts::PluginsManager.init`, `packages/analytics-js/src/services/PluginEngine/PluginEngine.ts::PluginEngine.invoke`, `packages/analytics-js/src/components/pluginsManager/PluginsManager.ts:37`).
- The snippet/preload buffering model couples entry points to core event processing guarantees; preserving buffered-call semantics is critical whenever boot or loader logic changes (`packages/loading-scripts/src/index.ts:31`, `packages/analytics-js/src/components/core/Analytics.ts::Analytics.processDataInPreloadBuffer`, `packages/analytics-js/src/app/RudderAnalytics.ts::RudderAnalytics.triggerBufferedLoadEvent`).
- Modern-vs-legacy split appears in stack, conventions, and concerns simultaneously: versioned project scopes and separate entry files are intentional boundaries that should be preserved in future changes (`packages/analytics-js/project.json:8`, `packages/analytics-v1.1/project.json:6`, `packages/analytics-v1.1/src/core/analytics.js::Analytics`).
- Security posture is tied to architectural choices around remote loading and dynamic execution; CSP handling in error/state flows partially mitigates but does not remove this dependency (`packages/loading-scripts/src/index.ts::window.rudderAnalyticsAddScript`, `packages/analytics-js/src/services/ErrorHandler/ErrorHandler.ts::ErrorHandler.attachErrorListeners`, `packages/analytics-js-integrations/src/integrations/Braze/nativeSdkLoader.js:11`).

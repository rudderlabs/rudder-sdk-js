# Concerns

> Technical debt, TODOs, FIXMEs, security concerns, architectural issues.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.
> Top-5–8 highest-signal items per category, not exhaustive.

## TODO/FIXME Density Clusters (RUD-2781)
<!-- linear:RUD-2781 -->

- Plugin lifecycle resilience is explicitly incomplete (retry/timeout/failure handling TODO cluster), increasing risk of partial initialization states (`packages/analytics-js/src/components/pluginsManager/PluginsManager.ts:37`, `packages/analytics-js/src/components/pluginsManager/PluginsManager.ts:83`, `packages/analytics-js/src/components/pluginsManager/PluginsManager.ts:282`).
- Config fetch robustness has known gap: no retry/backoff in `processConfig` on transient failures (`packages/analytics-js/src/components/configManager/ConfigManager.ts:156`).
- Facade/session lifecycle debt is documented in core API (`restart/reset` and multi-instance follow-ups), suggesting state-reset edge cases remain (`packages/analytics-js/src/app/RudderAnalytics.ts:53`, `packages/analytics-js/src/app/RudderAnalytics.ts:159`).
- StoreManager has unresolved design TODOs around validation and cross-version behavior, which can affect persistence compatibility (`packages/analytics-js/src/services/StoreManager/StoreManager.ts:93`).
- Legacy v1.1 still carries TODOs in URL validation and queue timing validation, indicating weaker guardrails in older runtime path (`packages/analytics-v1.1/src/utils/cdnPaths.js:16`, `packages/analytics-v1.1/src/utils/xhrModule.js:33`).

## Security-Adjacent Concerns (RUD-2781)
<!-- linear:RUD-2781 -->

- Dynamic script loading from runtime-computed CDN paths is foundational; misconfiguration or policy drift can affect integrity if hosting controls weaken (`packages/loading-scripts/src/index.ts::window.rudderAnalyticsAddScript`, `packages/analytics-js/src/components/configManager/ConfigManager.ts::ConfigManager.init`).
- Dynamic code execution via `new Function(...)` is present for feature detection and in some integration loaders; this is CSP-sensitive and should stay tightly scoped (`packages/loading-scripts/src/index.ts:59`, `packages/analytics-js-integrations/src/integrations/Braze/nativeSdkLoader.js:11`).
- Session/auth token persistence is part of state and storage flows; local persistence options require careful downstream hardening to avoid token exposure in hostile browser contexts (`packages/analytics-js/src/state/slices/session.ts:14`, `packages/analytics-js/src/components/userSessionManager/UserSessionManager.ts:1014`).
- Hashing choices in integration utilities include `md5`; while used for compatibility with partner SDK expectations, this should remain constrained to non-security-critical hashing use cases (`packages/analytics-js-integrations/src/integrations/Criteo/utils.js:16`, `packages/analytics-js-integrations/package.json:80`).

## Architectural Smells (RUD-2781)
<!-- linear:RUD-2781 -->

- Dual runtime lines (v3 modern + v1.1 legacy) increase cognitive and release complexity; architectural guidance must keep explicit boundaries to avoid accidental parity assumptions (`packages/analytics-js/project.json:8`, `packages/analytics-v1.1/project.json:6`).
- Legacy `Analytics` class is large and multi-responsibility (config, loading, queueing, integrations), which raises change-risk and test-surface breadth (`packages/analytics-v1.1/src/core/analytics.js::Analytics`).
- Plugin engine defaults to `throws: true`; if plugin failure paths are not consistently isolated by callers, boot failures can propagate abruptly (`packages/analytics-js/src/services/PluginEngine/PluginEngine.ts::defaultPluginEngine`).
- The modern state object spans many cross-domain slices in one mutable graph, which helps coordination but can blur ownership boundaries over time (`packages/analytics-js/src/state/index.ts::state`).

## Stale/Commented-Out/Compatibility Burden (RUD-2781)
<!-- linear:RUD-2781 -->

- Legacy package still targets IE11-era browser matrix and compatibility constraints, which can limit simplification/refactor options for shared utilities (`packages/analytics-v1.1/package.json:101`).
- Browser support configs differ between root and package scopes, increasing risk of accidental regressions across build targets (`package.json:232`, `packages/analytics-js-integrations/package.json:100`, `packages/analytics-v1.1/package.json:101`).
- Service-worker distribution was split to another package (documented deprecation), so contributor assumptions based on older docs can be stale without explicit checks (`README.md:36`).

## RUD-2781 — Nx Command Preconditions
<!-- linear:RUD-2781 -->

- Root quality commands that delegate to Nx (for example lint/check scripts) depend on the workspace toolchain being installed so `nx` resolves at runtime; without provisioned dependencies these checks fail before actual lint/test evaluation.

## AI-1258 — Dependency Lockfile Drift Blocks CI Installs

- In this checkout, `npm ci --prefer-offline --no-audit --include=optional` fails before installing dependencies because `package.json` and `package-lock.json` are out of sync (`typescript@5.9.3` and `conventional-commits-filter@5.0.0` are missing from the lock file); root Jest/Nx validation therefore requires a synchronized lock file or a non-`ci` install path in similar environments.

# Conventions

> Coding conventions and naming schemes — things a linter can't catch.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Repository Conventions (RUD-2781)
<!-- linear:RUD-2781 -->

- Package-level boundaries are encoded via Nx tags (`type:*`, `scope:*`) and enforced centrally; new modules should preserve this tag taxonomy to keep dependency constraints meaningful (`nx.json:58`, `packages/analytics-js/project.json:7`).
- Modern SDK naming prefers explicit manager/service suffixes (`ConfigManager`, `PluginsManager`, `UserSessionManager`) and `default*` singleton exports for shared instances (`packages/analytics-js/src/components/configManager/ConfigManager.ts::ConfigManager`, `packages/analytics-js/src/services/PluginEngine/PluginEngine.ts::defaultPluginEngine`).
- Public API surfaces preserve Segment-style overloads at facade level, while core methods consume normalized payload objects (`packages/analytics-js/src/app/RudderAnalytics.ts::RudderAnalytics.track`, `packages/analytics-js/src/components/core/Analytics.ts::Analytics.track`).
- The repo intentionally keeps both modern TypeScript-heavy code (`analytics-js`) and legacy JavaScript (`analytics-v1.1`); avoid “normalizing” one line to the other unless a task explicitly spans both (`packages/analytics-js/src/index.ts:1`, `packages/analytics-v1.1/src/core/analytics.js:1`).
- Commit scopes are treated as repository API: scopes should be Nx project names or approved custom scopes (`release`, `monorepo`, `examples`, `deps`) (`commitlint.config.js:1`).
- File layout convention is package-local (`src`, `__tests__`, `__fixtures__`, `rollup.config.mjs`), and top-level scripts prefer `nx run-many` / `nx affected` wrappers instead of ad hoc per-package loops (`package.json:8`).

## RUD-2781 — Automation Guidance Location
<!-- linear:RUD-2781 -->

- Repository automation guidance is anchored in `CLAUDE.md`; no `AGENTS.md` file exists in this repo, so agent workflows should default to `CLAUDE.md` as the canonical instructions source.

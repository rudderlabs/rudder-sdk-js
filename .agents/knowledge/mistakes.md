# Mistakes

> Post-mortem entries from observed failures: CI failures, reverts on prior PRs,
> prod incidents. Accrues over time — bootstrap leaves this empty.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## SDK-537 — Signal Effect Declaration Type Leak

- When returning an `@preact/signals-core` effect disposer from an exported or declaration-emitting method, annotate the method as `() => void` and cast the disposer to that type; otherwise Rollup/rpt2 declaration generation can fail with TS4118 because the inferred type exposes a non-serializable `[Symbol.dispose]` property (`packages/analytics-js/src/components/configManager/ConfigManager.ts::ConfigManager.attachEffects`).

# Feedback

> Durable human direction, review corrections, and implementation preferences.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> identifying the writer/PR/run; human-authored sections are conventionally left
> untouched by automated runs.

## RUD-3124 — Preserve Legacy MoEngage India Region Alias

- When correcting MoEngage's canonical India region from `IN` to control-plane value `IND`, retain `IN` as a backward-compatible `dc_3` alias and cover both inputs in parameterized browser tests; canonicalization must not regress older device-mode configurations (`packages/analytics-js-integrations/src/integrations/MoEngage/utils.js`, `packages/analytics-js-integrations/__tests__/integrations/MoEngage/browser.test.ts`).

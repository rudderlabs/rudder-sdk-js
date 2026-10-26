# Feedback

> Durable human direction, review guidance, and corrections.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> identifying the writer/PR/run; human-authored sections are conventionally left
> untouched by automated runs.

## RUD-3124 — Canonical MoEngage India Region

- Use only the canonical control-plane value `IND` for MoEngage India's `dc_3` web data-center mapping; do not retain the legacy `IN` spelling as an alias or include it in parameterized browser coverage. This requester direction supersedes an earlier review suggestion to preserve `IN` compatibility (`packages/analytics-js-integrations/src/integrations/MoEngage/utils.js`, `packages/analytics-js-integrations/__tests__/integrations/MoEngage/browser.test.ts`).

## INT-7215 — Facebook Pixel Multi-Destination Regression Coverage

- Facebook Pixel `page()` regression coverage should instantiate two destinations with distinct pixel IDs and prove that each emits exactly one `trackSingle` call scoped to its own pixel. Also cover `getEventId` falling back to `message.messageId` when no `event_id` exists in traits, context traits, or properties, preserving Meta device/cloud deduplication behavior (`packages/analytics-js-integrations/__tests__/integrations/FacebookPixel/browser.test.js`).

## INT-7311 — Sentry Uses One Current SDK Version

- The Sentry device-mode integration must load only the selected current Sentry SDK version in every integrations build target. Do not preserve an older vendor SDK for the legacy/default build; `packages/analytics-js-integrations/src/integrations/Sentry/constants.js` must expose one version, URL set, and SRI set shared by legacy and modern Rudder bundles.

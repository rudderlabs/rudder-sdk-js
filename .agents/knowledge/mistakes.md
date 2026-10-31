# Mistakes

> Post-mortem entries from observed failures: CI failures, reverts on prior PRs,
> prod incidents. Accrues over time — bootstrap leaves this empty.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## SDK-5277 — JSCutlery SkipCommit Tag Ordering

- For release versioning with `@jscutlery/semver` and `--skipCommit=true`, remember that `skipCommit` skips the release commit but still creates local tags at the current commit. Dependency-first execution can make an upstream dependent miss a transitive bump because its dependency has already tagged the same commit.
- The current release flow in `package.json` runs `scripts/run-release-version-targets.js`, which reads the Nx project graph and executes all `version` targets serially from dependents to dependencies.
- The critical SDK chain must run `@rudderstack/analytics-js` before `@rudderstack/analytics-js-plugins` before `@rudderstack/analytics-js-integrations` so transitive `trackDeps: true` bumps propagate under `--skipCommit=true`.
- The regression for this behavior is `npm run test:release-versioning`; it builds a temporary three-level dependency chain with `trackDeps: true`, runs real JSCutlery versioning with `--skipCommit=true` and no `--dryRun`, and asserts all three versions increase.

## INT-7067 — OpenAI Ads Destination Constants Required for CI

- Adding `packages/analytics-js-integrations/src/integrations/OpenAIAds` without matching `OPENAI_ADS_NAME` and `OPENAI_ADS_DISPLAY_NAME` exports in `packages/analytics-js-integrations/src/constants/Destinations.ts` breaks `packages/analytics-js-integrations/__tests__/constants.test.ts`, because that test imports every integration's `constants.js` and compares `NAME`/`DISPLAY_NAME` to `Destinations.ts` exports.
- When adding a new `analytics-js-integrations` device-mode integration, include its `*_NAME` and `*_DISPLAY_NAME` exports in `Destinations.ts` in the same PR unless the generated constants have already been refreshed.
- Do not implement OpenAI Ads Measurement Pixel logout/user clearing by adding core SDK device-mode reset hook plumbing from stale or local spec text; the durable behavior from the spec PR is MoEngage-style integration-local user ID change detection that clears the pixel user via `window.oaiq("init", { pixelId, user: {} })`.
- Adding OpenAI Ads as a mapped destination can fail the bundle-size gate for `All Integrations - Legacy - CDN`, which sums every standalone CDN integration artifact; if the destination remains in `config_to_integration_names.js`, keep the implementation bundle-friendly and update the aggregate `.size-limit.mjs` budget explicitly when needed.

## INT-7126 — OpenAI Ads Browser Jest Config

- Run the OpenAI Ads browser integration Jest file from the monorepo root with the package config: `npx --no-install jest --config packages/analytics-js-integrations/jest.config.mjs __tests__/integrations/OpenAIAds/browser.test.js --runInBand`; plain root `npx jest packages/.../browser.test.js` can hit sample-app haste collisions and fail workspace alias resolution such as `@rudderstack/analytics-js-legacy-utilities/ObjectUtils`.

## INT-7435 — Follow-Redirects Lockfile Security Resolution

- After Axios dependency-range changes, verify the production dependency tree rather than relying on the manifest version alone: resolving Axios's `follow-redirects` dependency to `1.16.0` caused `npm audit --audit-level=high --omit=dev` to fail on credential-header exposure advisories GHSA-q3jh-wrc6-jgq8 and GHSA-8r9p-f939-6h3c. Refresh the compatible lockfile resolution to `follow-redirects` `1.16.1` or newer.

## SDK-6044 — Vendor SDK pinning

- Integrations own pin support through the instance method `getVendorSdkPinSupport()`: `'full'` for registered exact-version URL/SRI artifacts, `'no-script'` for no vendor script, and `'customer'` for a customer URL selected by the loader. Missing methods and `'none'`/undefined fail closed; the plugin has no build-time support map.
- Reuse the loader's decision for customer URLs. GA4/GA4_V2 and Google Ads compare the effective `sdkBaseUrl` hostname to `www.googletagmanager.com` (stored default URLs do not count); Appcues uses a nonempty string `nativeSdkUrl`, Rockerbox a truthy `customDomain`, and Mixpanel a defined `MIXPANEL_CUSTOM_LIB_URL`, including empty/null values.
- Strict enforcement runs after consent and integration bundle download, immediately before `init()`. Unsupported destinations log one error and enter failed-destination state immediately, without vendor script insertion, ready timeout, or telemetry. Custom integrations and `'customer'` support are allowed. A destination-level `'pinned'` policy overrides `All` strict and permits the existing vendor URL.
- Pinned URL/integrity exports require a method returning `'full'`; the constants guardrail checks exact-version HTTPS URLs, same vendor hostname, and SHA-384 integrity. The hash verifier rejects literal `'full'` methods without registered artifacts. See `CONTRIBUTING.md` for the loading contract.

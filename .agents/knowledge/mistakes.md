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

# Stack

> Dependencies, frameworks, tooling.
> Append-only. Agent-authored sections may optionally carry an HTML-comment tag
> (e.g., `<!-- pr:<id> -->`) identifying the writer/PR/run; human-authored
> sections are conventionally left untouched by automated runs.

## Stack Baseline (RUD-2781)
<!-- linear:RUD-2781 -->

- Language/runtime: Node workspace monorepo with TypeScript + JavaScript packages; root package is `@rudderstack/analytics-js-monorepo@3.110.0` (`package.json:2`).
- Monorepo/build orchestration: Nx `22.7.1` with `run-many` and `affected` workflows for build/test/lint/release (`package.json:13`, `package.json:24`, `nx.json:1`).
- Bundling/transpilation: Rollup `4.60.3`, Babel `7.29.0`, TypeScript `6.0.3`, SWC tooling for TS/Jest paths (`package.json:170`, `package.json:112`, `package.json:196`, `package.json:138`).
- Reactive/state core: `@preact/signals-core@1.14.1` powers modern SDK lifecycle/state reactions (`package.json:81`, `packages/analytics-js/src/components/core/Analytics.ts:2`).
- HTTP + retry layer: `axios@1.16.0` + `axios-retry@4.5.0` are baseline network dependencies (`package.json:86`, `package.json:87`).
- Browser persistence and crypto-related dependencies include `storejs@2.1.1`, `crypto-es@2.1.0`, `crypto-js@4.2.0`, `md5@2.3.0` (`package.json:104`, `package.json:89`, `package.json:90`, `package.json:99`).
- Testing/quality toolchain: Jest `30.4.1`, ESLint `9.39.4`, size-limit `12.1.0`, madge `8.0.0`, jscpd `4.0.9` (`package.json:159`, `package.json:128`, `package.json:137`, `package.json:166`, `package.json:165`).
- Release topology: packages are independently versioned with Nx release tag pattern `{projectName}@{version}` (`nx.json:7`).
- Product lines: modern npm package `@rudderstack/analytics-js`, legacy package `rudder-sdk-js` (`v1.1`), plus dedicated plugins/integrations/loading-script packages (`packages/analytics-js/project.json:2`, `packages/analytics-v1.1/package.json:2`, `packages/analytics-js-plugins/package.json:2`, `packages/analytics-js-integrations/package.json:2`, `packages/loading-scripts/package.json:2`).

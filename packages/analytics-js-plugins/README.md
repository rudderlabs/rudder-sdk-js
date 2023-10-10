## [![Release](https://img.shields.io/npm/v/%40rudderstack/analytics-js-plugins)](https://www.npmjs.com/package/@rudderstack/analytics-js-plugins) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40rudderstack/analytics-js-plugins) ![npm](https://img.shields.io/npm/dw/%40rudderstack/analytics-js-plugins)

<p align="center">
  <a href="https://rudderstack.com/">
    <img alt="RudderStack" width="512" src="https://raw.githubusercontent.com/rudderlabs/rudder-sdk-js/develop/assets/rs-logo-full-light.jpg">
  </a>
  <br />
  <caption>The Customer Data Platform for Developers</caption>
</p>
<p align="center">
  <b>
    <a href="https://rudderstack.com">Website</a>
    ·
    <a href="https://rudderstack.com/docs/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk/">Documentation</a>
    ·
    <a href="https://rudderstack.com/join-rudderstack-slack-community">Community Slack</a>
  </b>
</p>

---

# @rudderstack/analytics-js-plugins

RudderStack Javascript SDK plugins code that is used within the related analytics package, bundles for the legacy
packaging or as separate bundle chunks for dynamic imports.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the package**](#installing-the-package)
- [**List of plugins**](#list-of-plugins)
- [**How to build the plugins**](#How-to-build-the-plugins)

## Installing the package

To install the package via npm, run the following command:

```bash
npm install @rudderstack/analytics-js-plugins --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack
with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node).

## List of plugins

Plugins are JavaScript SDK v3 features that you can optionally load on demand. Full list of available plugins can be
explored [here](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/v3/#plugins).

## How to build the plugins

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds
- are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser:modern`: This outputs **dist/cdn** folder that contains the cdn package contents.
  - `npm run build:npm`: This outputs **dist/npm** folder that contains the npm package contents.

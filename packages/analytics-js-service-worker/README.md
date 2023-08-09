## [![Release](https://img.shields.io/npm/v/%40rudderstack/analytics-js-service-worker)](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40rudderstack/analytics-js-service-worker) ![npm](https://img.shields.io/npm/dw/%40rudderstack/analytics-js-service-worker)

<p align="center">
  <a href="https://rudderstack.com/">
    <img src="https://user-images.githubusercontent.com/59817155/121357083-1c571300-c94f-11eb-8cc7-ce6df13855c9.png">
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

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-service-worker/README.md#@rudderstack-analytics-js-service-worker)@rudderstack/analytics-js-service-worker

RudderStack Javascript SDK service worker that can be used in browser extensions.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the package**](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-service-worker/README.md#installing-the-package)

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-service-worker/README.md#installing-the-package)Installing the package

To install the package via npm, run the following command:

```bash
npm install @rudderstack/analytics-js-service-worker --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node).

## Usage in Chrome Extensions

RudderStack JS SDK service worker can be used in Chrome Extensions with manifest v3, both as a content script or as a background script service worker.

For examples and specific details look into [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md)

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/packages/analytics-js-service-worker/README.md#how-to-build-the-sdk)How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:npm`: This outputs **dist/npm** folder that contains the npm package contents.

## [![Release](https://img.shields.io/npm/v/%40rudderstack/analytics-js)](https://www.npmjs.com/package/@rudderstack/analytics-js) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/%40rudderstack/analytics-js) ![npm](https://img.shields.io/npm/dw/%40rudderstack/analytics-js)

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

# @rudderstack/analytics-js

RudderStack JavaScript SDK for browsers.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the package**](#installing-the-package)
- [**How to build the SDK**](#How-to-build-the-SDK)
- [**Usage in Chrome Extensions**](#usage-in-chrome-extensions)
- [**Usage in Serverless Runtimes**](#usage-in-serverless-runtimes)

## Installing the package

To install the package via NPM, run the following command:

```bash
npm install @rudderstack/analytics-js --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node).

### Available exports

Default export will fetch the plugins during runtime as federated modules in separate requests.

```javascript
import { RudderAnalytics } from '@rudderstack/analytics-js';

const analytics = new RudderAnalytics();
analytics.load(<WRITE_KEY>, <DATA_PLANE_URL>);
```

Bundled export will contain the plugins code as part of the bundle in build time.

```javascript
import { RudderAnalytics } from '@rudderstack/analytics-js/bundled';

const analytics = new RudderAnalytics();
analytics.load(<WRITE_KEY>, <DATA_PLANE_URL>);
```

Legacy export will contain the plugins code as part of the bundle in build time and supports legacy browsers like IE11.

```javascript
import { RudderAnalytics } from '@rudderstack/analytics-js/legacy';

const analytics = new RudderAnalytics();
analytics.load(<WRITE_KEY>, <DATA_PLANE_URL>);
```

## How to build the SDK

Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

- `npm run build:browser:modern`: This outputs **dist/cdn/modern** folder that contains the CDN package contents.
- `npm run build:npm`: This outputs **dist/npm** folder that contains the NPM package contents.

## Usage in Chrome Extensions

RudderStack JS SDK can be used in Chrome Extensions with manifest v3, both as a content script (via the JavaScript SDK package) or as a background script service worker (via the [service worker package](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker)).

For more details, see [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md).

## Usage in Serverless Runtimes

RudderStack JS SDK [service worker](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) can be used in serverless runtimes like Cloudflare Workers or Vercel Edge functions.

For more details, see:

- [Vercel Edge Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)
- [Cloudflare Worker Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)

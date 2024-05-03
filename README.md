## [![Releases](https://img.shields.io/github/release/rudderlabs/rudder-sdk-js.svg)](https://github.com/rudderlabs/rudder-sdk-js/releases) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rudderlabs_rudder-sdk-js&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rudderlabs_rudder-sdk-js) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=rudderlabs_rudder-sdk-js&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=rudderlabs_rudder-sdk-js) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=rudderlabs_rudder-sdk-js&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=rudderlabs_rudder-sdk-js) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=rudderlabs_rudder-sdk-js&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=rudderlabs_rudder-sdk-js) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rudderlabs_rudder-sdk-js&metric=coverage)](https://sonarcloud.io/summary/new_code?id=rudderlabs_rudder-sdk-js)

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

# RudderStack JavaScript SDK

The JavaScript SDK lets you track customer event data from your website and send it to your specified destinations via RudderStack.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/).

## Table of Contents

- [**Installing the JavaScript SDK**](#installing-the-javascript-sdk)
- [**Migrating SDK from an older version**](#migrating-sdk-from-an-older-version)
- [**Loading the SDK**](#loading-the-sdk)
- [**Identifying your users**](#identifying-users)
- [**Tracking user actions**](#tracking-user-actions)
- [**The `ready` API**](#the-ready-api)
- [**Self-hosted control plane**](#self-hosted-control-plane)
- [**Adding your own integrations**](#adding-your-own-integrations)
- [**How to build the SDK**](#how-to-build-the-sdk)
- [**Usage in Chrome Extensions**](#usage-in-chrome-extensions)
- [**Usage in Serverless Runtimes**](#usage-in-serverless-runtimes)

| **IMPORTANT**: We have deprecated the service worker export from RudderStack JavaScript SDK npm package and decoupled it to a new package. <br/>If you still wish to use it for your project, see [**@rudderstack/analytics-js-service-worker package**](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker). |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Installing the JavaScript SDK

| For detailed installation steps, see the [JavaScript SDK documentation](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/installation/). |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

To integrate the JavaScript SDK with your website, place the following code snippet in the `<head>` section of your website.

```javascript
<script type="text/javascript">
  !function(){"use strict";window.RudderSnippetVersion="3.0.3";var sdkBaseUrl="https://cdn.rudderlabs.com/v3"
  ;var sdkName="rsa.min.js";var asyncScript=true;window.rudderAnalyticsBuildType="legacy",window.rudderanalytics=[]
  ;var e=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession","consent"]
  ;for(var n=0;n<e.length;n++){var t=e[n];window.rudderanalytics[t]=function(e){return function(){
  window.rudderanalytics.push([e].concat(Array.prototype.slice.call(arguments)))}}(t)}try{
  new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(a){}
  if(window.rudderAnalyticsMount=function(){
  "undefined"==typeof globalThis&&(Object.defineProperty(Object.prototype,"__globalThis_magic__",{get:function get(){
  return this},configurable:true}),__globalThis_magic__.globalThis=__globalThis_magic__,
  delete Object.prototype.__globalThis_magic__);var e=document.createElement("script")
  ;e.src="".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),e.async=asyncScript,
  document.head?document.head.appendChild(e):document.body.appendChild(e)
  },"undefined"==typeof Promise||"undefined"==typeof globalThis){var d=document.createElement("script")
  ;d.src="https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount",
  d.async=asyncScript,document.head?document.head.appendChild(d):document.body.appendChild(d)}else{
  window.rudderAnalyticsMount()}window.rudderanalytics.load(<WRITE_KEY>,<DATA_PLANE_URL>,{})}();
</script>
```

<br>

> The above snippet lets you integrate the SDK with your website and load it asynchronously to keep your page load time unaffected.

To load SDK script on to your page synchronously, see the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/installation/#synchronous-loading).

> **IMPORTANT**: The implicit `page` call at the end of the snippet (present in the previous JavaScript SDK versions) is removed in the latest SDK v3. You need to make a `page` call explicitly, if required, as shown below:

```javascript
rudderanalytics.page();
```

### NPM installation

Although we recommend using the CDN installation method to use the JavaScript SDK with your website, you can also use this [**NPM module**](https://www.npmjs.com/package/@rudderstack/analytics-js) to package RudderStack directly into your project.

To install the SDK via npm, run the following command:

```bash
npm install @rudderstack/analytics-js --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, see the [**RudderStack Node.js documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/).
<br><br>

**IMPORTANT**: Since the module exports the [**related APIs**](#exported-apis) on an already-defined object combined with the Node.js module caching, you should run the following code snippet only once and use the exported object throughout your project:

- **For ECMAScript modules (ESM)**:

```javascript
import { RudderAnalytics } from '@rudderstack/analytics-js';

const rudderAnalytics = new RudderAnalytics();
rudderAnalytics.load(WRITE_KEY, DATA_PLANE_URL, {});

export { rudderAnalytics };
```

- **For CJS using the `require` method**:

```javascript
var RudderAnalytics = require('@rudderstack/analytics-js');

const rudderAnalytics = new RudderAnalytics();
rudderAnalytics.load(WRITE_KEY, DATA_PLANE_URL, {});

exports.rudderanalytics = rudderAnalytics;
```

### Sample implementations

See the following projects for a detailed walkthrough of the above steps:

- [**Sample Angular project**](https://github.com/rudderlabs/rudder-analytics-angular)
- [**Sample React project**](https://github.com/rudderlabs/rudder-analytics-react)

### Exported APIs

The APIs exported by the module are:

- `load`
- `ready`
- `identify`
- `page`
- `track`
- `group`
- `alias`
- `reset`
- `setAnonymousId`
- `startSession`
- `endSession`

See [JavaScript SDK installation workflow](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/installation/#installation-workflow) for more information on these methods.

### Supported browser versions

| **Browser**     | **Supported Versions** |
| :-------------- | :--------------------- |
| **Browser**     | **Supported Versions** |
| :-------------- | :--------------------- |
| Safari          | v7 and above           |
| IE              | v11 and above          |
| Edge            | v80 and above          |
| Mozilla Firefox | v47 and above          |
| Chrome          | v54 and above          |
| Opera           | v43 and above          |

> You can try adding the browser [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) to your application if the SDK does not work on your browser.

## Migrating SDK from an older version

If you are migrating the JavaScript SDK from an older version (<=v1.1), see the [Migration Guide](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/migration-guide/) for details.

## Loading the SDK

| For detailed information on the `load()` method, see the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

You can load the JavaScript SDK using the `load` API method to track and send events from your website to RudderStack. Make sure to replace the "write key" and data plane URL with their actual values.

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, [loadOptions]);
```

You can use the [`loadOptions`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#loading-options) object in the above `load` call to define various options while loading the SDK.

For destinations where you don't want the SDK to load the third-party scripts separately, modify the `load` call as shown:

```javascript
rudderanalytics.load( <WRITE_KEY> , <DATA_PLANE_URL> , {
  loadIntegration: false
})
```

A few important things to note:

- The SDK expects the destination global queue or function for pushing the events is already present for the particular destinations.
- Currently, `loadIntegration` is supported only for Amplitude and Google Analytics.
- The JavaScript SDK expects `window.amplitude` and `window.ga` to be already defined by the user separately for the sending the events to these destinations.

## Identifying users

The [`identify`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#identify) call lets you identify a visiting user and associate them to their actions. It also lets you record the traits about them like their name, email address, etc.

A sample `identify` call is shown below:

```javascript
rudderanalytics.identify(
  '1hKOmRA4el9Zt1WSfVJIVo4GRlm',
  {
    firstName: 'Alex',
    lastName: 'Keener',
    email: 'alex@example.com',
    phone: '+1-202-555-0146',
  },
  {
    page: {
      path: '/best-seller/1',
      referrer: 'https://www.google.com/search?q=estore+bestseller',
      search: 'estore bestseller',
      title: 'The best sellers offered by EStore',
      url: 'https://www.estore.com/best-seller/1',
    },
  },
  () => {
    console.log('identify call');
  },
);
```

In the above example, the JavaScript SDK captures the user information like `userId`, `firstName`, `lastName`, `email`, and `phone`, along with the [**contextual information**](https://www.rudderstack.com/docs/event-spec/standard-events/common-fields/#contextual-fields).

> There is no need to call `identify()` for anonymous visitors to your website. Such visitors are automatically assigned an `anonymousId`.

See the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#identify) for more information on how to use the `identify` call.

## Tracking user actions

The [`track`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#track) call lets you capture the user events along with any associated properties.

A sample `track` call is shown below:

```javascript
rudderanalytics.track(
  'Order Completed',
  {
    revenue: 30,
    currency: 'USD',
    user_actual_id: 12345,
  },
  () => {
    console.log('track call');
  },
);
```

In the above example, the `track` method tracks the user event ‘**Order Completed**’ and information like the `revenue`, `currency`, etc.

> You can use the `track` method to track various success metrics for your website like user signups, item purchases, article bookmarks, and more.

## The `ready` API

There are cases when you may want to tap into the features provided by the end-destination SDKs to enhance tracking and other functionalities. The JavaScript SDK exposes a `ready` API with a `callback` parameter that fires when the SDK is done initializing itself and the other third-party native SDK destinations.

An example is shown in the following snippet:

```javascript
rudderanalytics.ready(() => {
  console.log('we are all set!!!');
});
```

> For more information on the other supported methods, see the [**JavaScript SDK APIs**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/).

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/README.md#self-hosted-control-plane)Self-hosted control plane

| **[Control Plane Lite](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/) is now deprecated. It will not work with the latest rudder-server versions (after v1.2). Using [RudderStack Open Source](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-setup/#rudderstack-open-source) to set up your control plane is strongly recommended.** |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

If you are self-hosting the control plane using the [**Control Plane Lite**](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/) utility, your `load` call will look like the following:

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {
  configUrl: <CONTROL_PLANE_URL>,
});
```

More information on obtaining the `CONTROL_PLANE_URL` can be found [**here**](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/#using-sdk-sources-set-up-in-self-hosted-control-plane).

## Adding your own integrations

You can start adding integrations of your choice for sending the data through their respective web (JavaScript) SDKs.

## How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser`: This outputs **dist/cdn/legacy/rudder-analytics.min.js**.
  - `npm run build:npm`: This outputs **dist/npm** folder that contains the npm package contents.
  - `npm run build:integration:all`: This outputs **dist/cdn/legacy** folder that contains the integrations.

> We use **rollup** to build our SDKs. The configuration for it is present in `rollup-configs` folder.

- For adding or removing integrations, modify the imports in `index.js` under the `src/integrations` folder.

## Usage in Chrome extensions

You can use the JavaScript SDK in Chrome Extensions with manifest v3, both as a content script (via the JavaScript SDK package)
or as a background script service worker (via the [service worker package](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker)).

For examples and specific details, see [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md).

## Usage in Serverless runtimes

RudderStack JS SDK [service worker](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) can be used
in serverless runtimes like Cloudflare Workers or Vercel Edge functions.

For examples and specific details look into:

- [Vercel Edge Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)
- [Cloudflare Worker Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)

## Contribute

We would love to see you contribute to this project. Get more information on how to contribute [**here**](./CONTRIBUTING.md).

## Contact us

For more information on any of the sections covered in this readme, you can [**contact us**](mailto:%20docs@rudderstack.com) or start a conversation on our [**Slack**](https://resources.rudderstack.com/join-rudderstack-slack) channel.

## Follow Us

- [RudderStack Blog][rudderstack-blog]
- [Slack][slack]
- [Twitter][twitter]
- [LinkedIn][linkedin]
- [dev.to][devto]
- [Medium][medium]
- [YouTube][youtube]
- [HackerNews][hackernews]
- [Product Hunt][producthunt]

## :clap: Our Supporters

[![Stargazers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/stars/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/stargazers)

[![Forkers repo roster for @rudderlabs/rudder-sdk-js](https://reporoster.com/forks/rudderlabs/rudder-sdk-js)](https://github.com/rudderlabs/rudder-sdk-js/network/members)

<!----variables---->

[rudderstack-blog]: https://rudderstack.com/blog/
[slack]: https://resources.rudderstack.com/join-rudderstack-slack
[twitter]: https://twitter.com/rudderstack
[linkedin]: https://www.linkedin.com/company/rudderlabs/
[devto]: https://dev.to/rudderstack
[medium]: https://rudderstack.medium.com/
[youtube]: https://www.youtube.com/channel/UCgV-B77bV_-LOmKYHw8jvBw
[hackernews]: https://news.ycombinator.com/item?id=21081756
[producthunt]: https://www.producthunt.com/posts/rudderstack

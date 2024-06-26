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

| **IMPORTANT**: The service worker export has been deprecated from the RudderStack JavaScript SDK NPM package and moved to a new package. <br/>If you still wish to use it for your project, see [**@rudderstack/analytics-js-service-worker package**](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## Installing the JavaScript SDK

| For detailed installation steps, see the [JavaScript SDK documentation](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/installation/). |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### Using CDN

To integrate the JavaScript SDK with your website, place the following code snippet in the `<head>` section of your website.

```javascript
<script type="text/javascript">
  !function(){"use strict";window.RudderSnippetVersion="3.0.10";var e="rudderanalytics";window[e]||(window[e]=[])
  ;var t=window[e];if(Array.isArray(t)){if(true===t.snippetExecuted&&window.console&&console.error){
  console.error("RudderStack JavaScript SDK snippet included more than once.")}else{t.snippetExecuted=true,
  window.rudderAnalyticsBuildType="legacy";var sdkBaseUrl="https://cdn.rudderlabs.com/v3";var sdkName="rsa.min.js"
  ;var r="async"
  ;var n=["setDefaultInstanceKey","load","ready","page","track","identify","alias","group","reset","setAnonymousId","startSession","endSession","consent"]
  ;for(var i=0;i<n.length;i++){var d=n[i];t[d]=function(r){return function(){var n
  ;Array.isArray(window[e])?t.push([r].concat(Array.prototype.slice.call(arguments))):null===(n=window[e][r])||void 0===n||n.apply(window[e],arguments)
  }}(d)}try{new Function('return import("")'),window.rudderAnalyticsBuildType="modern"}catch(c){}
  var o=document.head||document.getElementsByTagName("head")[0]
  ;var a=document.body||document.getElementsByTagName("body")[0];window.rudderAnalyticsAddScript=function(e,t,n){
  var i=document.createElement("script");i.src=e,i.setAttribute("data-loader","RS_JS_SDK"),t&&n&&i.setAttribute(t,n),
  "async"===r?i.async=true:"defer"===r&&(i.defer=true),o?o.insertBefore(i,o.firstChild):a.insertBefore(i,a.firstChild)},
  window.rudderAnalyticsMount=function(){
  "undefined"==typeof globalThis&&(Object.defineProperty(Object.prototype,"__globalThis_magic__",{get:function get(){
  return this},configurable:true}),__globalThis_magic__.globalThis=__globalThis_magic__,
  delete Object.prototype.__globalThis_magic__),
  window.rudderAnalyticsAddScript("".concat(sdkBaseUrl,"/").concat(window.rudderAnalyticsBuildType,"/").concat(sdkName),"data-rsa-write-key",<WRITE_KEY>)
  },
  "undefined"==typeof Promise||"undefined"==typeof globalThis?window.rudderAnalyticsAddScript("https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount"):window.rudderAnalyticsMount()
  ;t.load(<WRITE_KEY>,<DATA_PLANE_URL>,{})}}}();
</script>
```

<br>

> The above snippet lets you integrate the SDK with your website and load it asynchronously to avoid impacting the performance of your webpages.

To load SDK script on to your page synchronously, see the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/installation/#synchronous-loading).

> **IMPORTANT**: The implicit `page` call at the end of the snippet (present in the previous JavaScript SDK versions) is removed in the latest SDK (v3). You need to make a `page` call explicitly, if required, as shown below:

```javascript
rudderanalytics.page();
```

### Using NPM

Although we recommend using the CDN installation method to use the JavaScript SDK with your website, you can also use this [**NPM module**](https://www.npmjs.com/package/@rudderstack/analytics-js) to package RudderStack directly into your project.

To install the SDK via NPM, run the following command:

```bash
npm install @rudderstack/analytics-js --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, see the [**RudderStack Node.js documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/).

**IMPORTANT**: Since the module exports the [**related APIs**](#exported-apis) on an already-defined object combined with the Node.js module caching, you should run the following code snippet only once and use the exported object throughout your project:

- **For ECMAScript modules (ESM)**:

```javascript
import { RudderAnalytics } from '@rudderstack/analytics-js';

const rudderanalytics = new RudderAnalytics();
rudderAnalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {});

export { rudderanalytics };
```

- **For CJS using the `require` method**:

```javascript
var RudderAnalytics = require('@rudderstack/analytics-js');

const rudderAnalytics = new RudderAnalytics();
rudderAnalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {});

exports.rudderanalytics = rudderAnalytics;
```

### Sample implementations

See the following applications for a detailed walkthrough of the above steps:

- [**Sample Angular application**](https://github.com/rudderlabs/rudder-sdk-js/tree/main/examples/angular/)
- [**Sample React application**](https://github.com/rudderlabs/rudder-sdk-js/tree/main/examples/reactjs/)

See the `examples` directory in this repository for more sample applications for different frameworks.

## Migrating SDK from an older version

If you are migrating the JavaScript SDK from an older version (<= v1.1), see the [Migration Guide](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/migration-guide/) for details.

## Loading the SDK

| For detailed information on the `load` API, see the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

You can load the JavaScript SDK using the `load` API to track and send events from your website to RudderStack. Make sure to replace the write key and data plane URL with their actual values.

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, [loadOptions]);
```

You can use the [`loadOptions`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#loading-options) object in the above `load` call to define various [options](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#loading-options) while loading the SDK.

## Identifying users

The [`identify`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#identify) API lets you identify a visiting user and associate them to their actions. It also lets you record the traits about them like their name, email address, etc.

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
    console.log('Identify call is successful.');
  },
);
```

In the above example, the JavaScript SDK captures the user information like `userId`, `firstName`, `lastName`, `email`, and `phone`, along with the default [**contextual information**](https://www.rudderstack.com/docs/event-spec/standard-events/common-fields/#contextual-fields).

> There is no need to call `identify` API for anonymous visitors to your website. Such visitors are automatically assigned an `anonymousId`.

See the [**JavaScript SDK documentation**](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#identify) for more information on how to use the `identify` API.

## Tracking user actions

The [`track`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#track) API lets you capture the user events along with any associated properties.

A sample `track` API is shown below:

```javascript
rudderanalytics.track(
  'Order Completed',
  {
    revenue: 30,
    currency: 'USD',
    user_actual_id: 12345,
  },
  () => {
    console.log('Track call is successful.');
  },
);
```

In the above example, the `track` API tracks the user event `Order Completed` and information like the `revenue`, `currency`, etc.

> You can use the `track` API to track various success metrics for your website like user signups, item purchases, article bookmarks, and more.

## Ready state

There are cases when you may want to tap into the features provided by the end-destination SDKs to enhance tracking and other functionalities. The JavaScript SDK exposes a [`ready`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#ready-api) API with a `callback` parameter that fires when the SDK is done initializing itself and the device-mode destinations.

An example is shown in the following snippet:

```javascript
rudderanalytics.ready(() => {
  console.log('We are all set!!!');
});
```

### Loaded state

Alternatively, if you just want to wait for the SDK to load, you can use the [`onLoaded`](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#onloaded) load API option to configure a callback function.

The configured callback function is executed when the SDK has loaded successfully but before all the device-mode destinations are initialized.

This is especially helpful to query information from the SDK after it has loaded to use it elsewhere. For example, you can retrieve the anonymous ID generated by the SDK after it has loaded.

An example is shown in the following snippet:

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {
  onLoaded: () => {
    console.log('SDK has loaded.');
    console.log('Anonymous ID:', rudderanalytics.getAnonymousId());
  },
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

## How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser`: This outputs the **dist/cdn/legacy/rsa.min.js**.
  - `npm run build:npm`: This outputs the **dist/npm** folder that contains the NPM package contents.
  - `npm run build:integration:all`: This outputs the **dist/cdn/legacy** folder that contains the integrations.

> We use **rollup** to build our SDKs. The configuration for it is present in the `rollup-configs` directory.

- For adding or removing integrations, modify the imports in `index.js` under the `src/integrations` folder.

## Usage in Chrome extensions

You can use the JavaScript SDK in Chrome Extensions with manifest v3, both as a content script (via the JavaScript SDK package) or as a background script service worker (via the [service worker package](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker)).

For more details, see [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md).

## Usage in Serverless runtimes

RudderStack JS SDK [service worker](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker) can be used in serverless runtimes like Cloudflare Workers or Vercel Edge functions.

For more details, see:

- [Vercel Edge Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)
- [Cloudflare Worker Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/serverless/USAGE.md)

## License

This project is licensed under the Elastic License 2.0. See the [LICENSE.md](LICENSE.md) file for details. Review the license terms to understand your permissions and restrictions.

If you have any questions about licensing, please [contact us](#contact-us) or refer to the [official Elastic licensing](https://www.elastic.co/licensing/elastic-license) page.

## Contribute

We encourage contributions to this project. For detailed guidelines on how to contribute, please refer to [**here**](./CONTRIBUTING.md).

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

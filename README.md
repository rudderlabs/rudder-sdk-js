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

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk).

## Table of Contents

- [**Installing the JavaScript SDK**](#installing-the-javascript-sdk)
- [**Identifying your users**](#identifying-users)
- [**Tracking user actions**](#tracking-user-actions)
- [**The `ready` API**](#the-ready-api)
- [**Self-hosted control plane**](#self-hosted-control-plane)
- [**Adding your own integrations**](#adding-your-own-integrations)
- [**How to build the SDK**](#how-to-build-the-sdk)
- [**Usage in Chrome Extensions**](#usage-in-chrome-extensions)
- [**Usage in Serverless Runtimes**](#usage-in-serverless-runtimes)

| **IMPORTANT**: We have deprecated the service worker export from RudderStack JavaScript SDK npm package and decoupled it to a new package. <br/>If you still wish to use it for your project, refer to [**@rudderstack/analytics-js-service-worker package**](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Installing the JavaScript SDK

To integrate the JavaScript SDK with your website, place the following code snippet in the `<head>` section of your website.

```javascript
<script type="text/javascript">
!function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],e.factory=function(t){return function(){e.push([t].concat(Array.prototype.slice.call(arguments)))}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
e.load(<WRITE_KEY>,<DATA_PLANE_URL>),
e.page()}();
</script>
```

<br>

> The above snippet lets you integrate the SDK with your website and load it asynchronously to keep your page load time unaffected.

To load `rudder-analytics.js` on to your page synchronously, you can refer to the minified or non-minified versions of the code in the following sections:

### Minified code

```html
<script>
  rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load(<WRITE_KEY>,<DATA_PLANE_URL>),rudderanalytics.page();
</script>

<script src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js"></script>
```

### Non-minified code

```html
<script>
  rudderanalytics = window.rudderanalytics = [];

  var methods = [
    'load',
    'page',
    'track',
    'identify',
    'alias',
    'group',
    'ready',
    'reset',
    'getAnonymousId',
    'setAnonymousId',
  ];

  for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    rudderanalytics[method] = (function (methodName) {
      return function () {
        rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
      };
    })(method);
  }
  rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL);
  //For example,
  //rudderanalytics.load("1Qb1F3jSWv0eKFBPZcrM7ypgjVo", "http://localhost:8080");
  rudderanalytics.page();
</script>

<script src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js"></script>
```

In all the above versions, there is an explicit `page` call at the end. This is added to ensure that whenever the SDK loads in a page, a `page` call is sent. You can remove this call completely or modify it with the extra page properties to suit your requirement. You can also add `page` calls in your application in places not tied directly to page load, e.g., virtual page views, page renders on route change such as in SPAs, etc.

### Write key and data plane URL

To integrate and initialize the JavaScript SDK, you will need the source write key and the data plane URL.

- To get the source write key, follow [**this guide**](https://www.rudderstack.com/docs/get-started/glossary/#write-key).
- To get the data plane URL, follow [**this guide**](https://www.rudderstack.com/docs/rudderstack-cloud/dashboard-overview/#data-plane-url).

### Alternative installation using NPM

Although we recommend using the snippets mentioned above to use the JavaScript SDK with your website, you can also use this [**NPM module**](https://www.npmjs.com/package/rudder-sdk-js) to package RudderStack directly into your project.

To install the SDK via npm, run the following command:

```bash
npm install rudder-sdk-js --save
```

**Note that this NPM module is only meant to be used for a browser installation**. If you want to integrate RudderStack with your Node.js application, refer to the [**RudderStack Node.js repository**](https://github.com/rudderlabs/rudder-sdk-node).
<br><br>

**IMPORTANT**: Since the module exports the [**related APIs**](#exported-apis) on an already-defined object combined with the Node.js module caching, you should run the following code snippet only once and use the exported object throughout your project:

```javascript
import * as rudderanalytics from "rudder-sdk-js";
rudderanalytics.ready(() => {
  console.log("we are all set!!!");
});
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>);
export { rudderanalytics };
```

You can also do this with **ES5** using the `require` method, as shown:

```javascript
var rudderanalytics = require("rudder-sdk-js");
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>);
exports.rudderanalytics = rudderanalytics;
```

For destinations where you don't want the SDK to load the third-party scripts separately, modify the `load` call as shown:

```javascript
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>, {loadIntegration:  false})
```

> For more information on the `load()` method, refer to the detailed [**JavaScript SDK documentation**](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk).

A few important things to note:

- The SDK expects the destination global queue or function for pushing the events is already present for the particular destination/s.
- Currently, `loadIntegration` is supported only for Amplitude and Google Analytics.
- The JavaScript SDK expects `window.amplitude` and `window.ga` to be already defined by the user separately for the sending the events to these destinations.

### Exported APIs

The APIs exported by the module are:

- `load`
- `ready`
- `identify`
- `alias`
- `page`
- `track`
- `group`
- `reset`
- `getAnonymousId`
- `setAnonymousId`

### Sample implementations

Refer to the following projects for a detailed walk-through of the above steps:

- [**Sample Angular project**](https://github.com/rudderlabs/rudder-analytics-angular)
- [**Sample React project**](https://github.com/rudderlabs/rudder-analytics-react)

### Supported browser versions

| **Browser**     | **Supported Versions** |
| :-------------- | :--------------------- |
| Safari          | v7 or later            |
| IE              | v11 or later           |
| Edge            | v80 or later           |
| Mozilla Firefox | v47 or later           |
| Chrome          | v54 or later           |
| Opera           | v43 or later           |
| Yandex          | v19.10 or later        |

> If the SDK does not work on the browser versions that you are targeting, verify if adding the browser polyfills to your application solves the issue.

## Identifying users

The `identify` call lets you identify a visiting user and associate them to their actions. It also lets you record the traits about them like their name, email address, etc.

A sample `identify()` call is shown below:

```javascript
rudderanalytics.identify(
  '12345',
  {
    email: 'name@domain.com',
  },
  {
    page: {
      path: '',
      referrer: '',
      search: '',
      title: '',
      url: '',
    },
  },
  () => {
    console.log('in identify call');
  },
);
```

In the above example, the user-related information like the `userId` and `email` along with the [**contextual information**](https://docs.rudderstack.com/rudderstack-api/api-specification/rudderstack-spec/common-fields#javascript-sdk) is captured.

> There is no need to call `identify()` for anonymous visitors to your website. Such visitors are automatically assigned an `anonymousId`.

For more information on how to use the `identify` call, refer to the [**JavaScript SDK documentation**](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk).

## Tracking user actions

The `track` call lets you record the customer events, i.e. the actions that they perform, along with any associated properties.

A sample `track` call is shown below:

```javascript
rudderanalytics.track(
  'test track event GA3',
  {
    revenue: 30,
    currency: 'USD',
    user_actual_id: 12345,
  },
  () => {
    console.log('in track call');
  },
);
```

In the above example, the `track` method tracks the user event ‘**test track event GA3**’ and information such as the `revenue`, `currency`, `anonymousId`.

> You can use the `track` method to track various success metrics for your website like user signups, item purchases, article bookmarks, and more.

## The `ready` API

There are cases when you may want to tap into the features provided by the end-destination SDKs to enhance tracking and other functionalities. The JavaScript SDK exposes a `ready` API with a `callback` parameter that fires when the SDK is done initializing itself and the other third-party native SDK destinations.

An example is shown in the following snippet:

```javascript
rudderanalytics.ready(() => {
  console.log('we are all set!!!');
});
```

> For more information on the other supported methods, refer to the [**JavaScript SDK APIs**](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk#supported-apis).

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/main/README.md#self-hosted-control-plane)Self-hosted control plane

| **[Control Plane Lite](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/) is now deprecated. It will not work with the latest rudder-server versions (after v1.2). Using [RudderStack Open Source](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-setup/#rudderstack-open-source) to set up your control plane is strongly recommended.** |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

If you are self-hosting the control plane using the [**Control Plane Lite**](https://www.rudderstack.com/docs/get-started/rudderstack-open-source/control-plane-lite/) utility, your `load` call will look like the following:

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {
  configUrl: <CONTROL_PLANE_URL>,
});
```

More information on obtaining the `CONTROL_PLANE_URL` can be found [**here**](https://www.rudderstack.com/docs/resources/faq/#for-a-self-hosted-environment-how-do-i-obtain-the-control-plane-url).

## Adding your own integrations

You can start adding integrations of your choice for sending the data through their respective web (JavaScript) SDKs.

## How to build the SDK

- Look for run scripts in the `package.json` file for getting the browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, some of the important ones are:

  - `npm run build:browser`: This outputs **dist/cdn/legacy/rudder-analytics.min.js**.
  - `npm run build:npm`: This outputs **dist/npm** folder that contains the npm package contents.
  - `npm run build:integration:all`: This outputs **dist/cdn/legacy** folder that contains the integrations.

> We use **rollup** to build our SDKs. The configuration for it is present in `rollup-configs` folder.

- For adding or removing integrations, modify the imports in `index.js` under the `src/integrations` folder.

## Usage in Chrome Extensions

RudderStack JS SDK can be used in Chrome Extensions with manifest v3, both as a content script (via the JavaScript SDK package)
or as a background script service worker (via the [service worker package](https://www.npmjs.com/package/@rudderstack/analytics-js-service-worker)).

For examples and specific details look into [Chrome Extensions Usage](https://github.com/rudderlabs/rudder-sdk-js/blob/main/examples/chrome-extension/USAGE.md)

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

# RudderStack JavaScript SDK

The [**RudderStack**](https://rudderstack.com/) JavaScript SDK leverages the `rudder-analytics.js` library to track and send user events from your website to RudderStack. You can then further transform and route this event data to the destination platform of your choice.

> For detailed documentation on the RudderStack JavaScript SDK, click [**here**](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk).

| **IMPORTANT**: We have deprecated the Autotrack feature for the RudderStack JavaScript SDK. If you still wish to use it for your project, refer to [**this repository**](https://github.com/rudderlabs/rudder-sdk-js-autotrack#autotrack). |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Installing the JavaScript SDK

To integrate the JavaScript SDK with your website, you can use this [**NPM module**](https://www.npmjs.com/package/rudder-js) to package RudderStack directly into your project.

To install, run:

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
| IE              | v10 or later           |
| Edge            | v15 or later           |
| Mozilla Firefox | v40 or later           |
| Chrome          | v37 or later           |
| Opera           | v23 or later           |
| Yandex          | v14.12 or later        |

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

## Self-Hosted control plane

If you are using a device mode destination like Heap, FullStory, etc., the JavaScript SDK needs to fetch the required configuration from the [**control plane**](https://docs.rudderstack.com/get-started/rudderstack-architecture#control-plane).

If you are self-hosting the control plane using the [**RudderStack Control Plane Lite**](https://docs.rudderstack.com/get-started/control-plane-lite#what-is-the-control-plane-url) utility, your `load` call will look like the following:

```javascript
rudderanalytics.load(<WRITE_KEY>, <DATA_PLANE_URL>, {
  configUrl: <CONTROL_PLANE_URL>,
});
```

> More information on how to get the `CONTROL_PLANE_URL` can be found [**here**](https://docs.rudderstack.com/get-started/control-plane-lite#what-is-the-control-plane-url).

| **For detailed technical documentation and troubleshooting guide on the RudderStack’s JavaScript SDK, check out our [docs](https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk).** |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Contact us

For more information on any of the sections covered in this readme, you can [**contact us**](mailto:%20docs@rudderstack.com) or start a conversation on our [**Slack**](https://resources.rudderstack.com/join-rudderstack-slack) channel.

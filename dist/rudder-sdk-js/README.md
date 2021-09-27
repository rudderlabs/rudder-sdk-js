# What is RudderStack?

[RudderStack](https://rudderstack.com/) is a **customer data pipeline** tool for collecting, routing and processing data from your websites, apps, cloud tools, and data warehouse.

More information on RudderStack can be found [here](https://github.com/rudderlabs/rudder-server).

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#what-is-the-rudderstack-javascript-sdk)What Is the RudderStack JavaScript SDK?

The RudderStack JavaScript SDK (released under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)) allows you to utilize our npm module `rudder-sdk-js` or `rudder-analytics.js` library to start sending event data from your website to RudderStack.

After integrating this SDK, you will also be able to connect to multiple destinations such as Amplitude, Google Analytics, etc. to send your data.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-use-the-rudderstack-javascript-sdk)How to Use the RudderStack JavaScript SDK?

This Quick Start Guide will help you get up and running with using the RudderStack JavaScript SDK in no time. You just need to follow the steps below:

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-1-install-rudderstack-using-the-code-snippet)Step 1: Install RudderStack Using the Code Snippet

To integrate the SDK:
You can use this [NPM module](https://www.npmjs.com/package/rudder-js) to package Rudder directly into your project.

To install, run:

```bash
npm install rudder-sdk-js --save
```

Since the module exports a bunch of APIs on an already-defined object combined with node module caching, you should run the below code only once and use the exported object throughout your project :

```jsx
import * as rudderanalytics from "rudder-sdk-js"
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>)
rudderanalytics.ready(() => {console.log("we are all set!!!")})
export  {  rudderanalytics  }
```

For ES5, with _require_:

```jsx
var rudderanalytics = require("rudder-sdk-js")
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>)
exports.rudderanalytics = rudderanalytics
```

For destinations where you don't want the SDK to load the third-party scripts separately, modify the load call:

```jsx
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>, {loadIntegration:  false})
// the SDK expects that the destination global queue or function for pushing events is
// already present for the destinations.
// Currently, the loadIntegration flag is supported for Amplitude and
// Google Analytics destinations. The SDK expects window.amplitude and window.ga to be already
// defined by the user separately for sending events to these destinations.
```

You can also refer to the sample projects for a walk through of the above: [Sample Angular Project](https://github.com/rudderlabs/rudder-analytics-angular) and [Sample React Project](https://github.com/rudderlabs/rudder-analytics-react)

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-2-identify-your-users-using-the-identify-method)Step 2: Identify your users using the `identify()` method:

The `identify()` method allows you to link users and their actions to a specific userid.

A sample example of how the `identify()` method works is as shown:

```jsx
rudderanalytics.identify(
  "12345",
  { email: "name@domain.com" },
  {
    page: {
      path: "",
      referrer: "",
      search: "",
      title: "",
      url: "",
    },
  },
  () => {
    console.log("in identify call");
  }
);
```

In the above example, information such as the user ID, email along with contextual information such as IP address, anonymousId, etc. will be captured.

> There is no need to call `identify()` for anonymous visitors to your website. Such visitors are automatically assigned an `anonymousId`.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-3-track-your-users-actions-using-the-track-method)Step 3: Track Your Users’ Actions With the `track()` Method

The `track()` method allows you to track any actions that your users might perform.

A sample example of how the `track()` method works is as shown:

```jsx
rudderanalytics.track(
  "test track event GA3",
  {
    revenue: 30,
    currency: "USD",
    user_actual_id: 12345,
  },
  () => {
    console.log("in track call");
  }
);
```

In the above example, the method tracks the event ‘**test track event GA3**’, and information such as the revenue, currency, anonymousId.

You can use this method to track various other success metrics for your website, such as user signups, item purchases, article bookmarks, and much more.

> To override contextual information, for ex: anonymizing IP and other contextual fields like page properties, the following template can be used. Similarly one can override the auto-generated anonymousId with provided ID. For this:

```
rudderanalytics.track(
  "test track event GA3",
  {
    revenue:  30,
    currency:  'USD' ,
    user_actual_id:  12345
  },
  {
    page: {
          path: "",
          referrer: "",
          search: "",
          title: "",
          url: ""
    },
    context: {
      ip:  "0.0.0.0"
    },
    anonymousId:  "00000000000000000000000000"
  },
  () => {console.log("in track call");}
);
```

You’ve now successfully installed RudderStack's JavaScript SDK tracking. You can enable and use any event destination to send your event data via RudderStack, in no time at all.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-4-check-ready-state)Step 4: Check Ready State

There are cases when you may want to tap into the features provide by end destination SDKs to enhance tracking and other functionalities. RudderStack's JavaScript SDK exposes a `ready` API with a `callback` parameter, that fires when the SDK is done initializing itself and other third-party native SDK destinations.

For example:

```jsx
rudderanalytics.ready(() => {
  console.log("we are all set!!!");
});
```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#adding-callbacks-to-standard-methods)Adding Callbacks to Standard Methods

You can also define callbacks to the common methods of the `rudderanalytics` object.

> For now, the functionality is supported for `syncPixel` method which is called in the SDK when making sync calls in integrations for relevant destinations.

For example:

```jsx
rudderanalytics.syncPixelCallback = (obj) => {
  rudderanalytics.track(
    "sync lotame",
    { destination: obj.destination },
    { integrations: { All: false, S3: true } }
  );
};
```

In the above example, we are defining a `syncPixelCallback` on the analytics object before the call to load the SDK. This will lead to calling of this registered callback with the parameter `{destination: <destination_name>}` whenever a sync call is made from the SDK for relevant integrations like _Lotame_.

The callback can be supplied in options parameter like below as well:

```jsx
// define the callbacks directly on the load method like:
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>,
	                    { clientSuppliedCallbacks: {
						    "syncPixelCallback": () => {console.log('sync done!')}
						  }
						}
)
```

We will be adding similar callbacks for APIs such as `track`, `page`, `identify`, etc.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#autotrack)Autotrack

| **IMPORTANT**: We have deprecated the Autotrack feature for the RudderStack JavaScript SDK. If you still wish to use it for your project, refer to [this repository](https://github.com/rudderlabs/rudder-sdk-js-autotrack#autotrack). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

It may happen that the need arises to track most of user interactions with a web-app. It becomes hard for a developer to capture these DOM interactions and make track calls for all. The autotrack feature of Rudder SDK helps in tracking all user interactions like `click | change | submit` automatically. The data generated will be verbose and to make sense of the data, one can use `user transformations` from the config-plane to build use-cases like monitoring user journeys etc. For more information and payload structure, click [here](https://docs.rudderstack.com/sdk-integration-guide/getting-started-with-javascript-sdk/rudderstack-autotrack-feature).

To enable autotracking, make the load call as:

```jsx
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>, {
  useAutoTracking: true,
});
```

By default, the SDK doesn't capture any DOM element values. To start capturing values, like form field values when submitting the form, other input element values etc, whitelist them using any attribute of the element for which you want to send values, For ex, tracking element values for all elements whose any one attribute is "CLASS_ATTR_NAME":

```jsx
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>, {
  useAutoTracking: true,
  valTrackingList: ["CLASS_ATTR_NAME"],
});
```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#self-hosted-config-plane)Self-hosted Config Plane

If you are using a device mode destination like Heap, FullStory, etc., the JavaScript SDK needs to fetch the required configuration from the Control Plane. If you are using the RudderStack Config Generator to host your own Control Plane, then follow [this guide](https://docs.rudderstack.com/how-to-guides/rudderstack-config-generator) and make a `load` call as shown:

```jsx
rudderanalytics.load(<YOUR_WRITE_KEY>, <DATA_PLANE_URL>, {configUrl: CONTROL_PLANE_URL});
```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#contribute)Contribute

You can start adding integrations of your choice for sending data through their JavaScript SDKs.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-build-the-sdk)How To Build the SDK

- Look for run scripts in the `package.json` file for getting browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, the important ones are:

  - `npm run buildProdBrowser`: This outputs **rudder-analytics.min.js**.
  - `npm run buildProdBrowserBrotli`: This outputs two files, **rudder-analytics.min.br.js** (the original minified file, same as above) and **rudder-analytics.min.br.js.br** (the brotli compressed file).
  - `npm run buildProdBrowserGzip`: This outputs two files, **rudder-analytics.min.gzip.js** (the original minified file, same as above) and **rudder-analytics.min.gzip.js.gz** (the gzipped compressed file).

  We are using **rollup** to build our SDKs, configuration for it is present in `rollup.config.js` in the repo directory.

- For adding or removing integrations, modify the imports in `index.js` under integrations folder.

# Contact Us

For more support on using the RudderStack JavaScript SDK, feel free to [contact us](https://rudderstack.com/contact/) or start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.

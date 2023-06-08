## Table of Contents

- [What is the RudderStack JavaScript SDK?](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#what-is-the-rudderstack-javascript-sdk)
- [How to use the RudderStack JavaScript SDK?](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-use-the-rudderstack-javascript-sdk)
- [Querystring API](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#querystring-api)
- [Adding Callbacks to Standard Methods](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#adding-callbacks-to-standard-methods)
- [Self-Hosted Control Plane](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#self-hosted-control-plane)
- [Contribute](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#contribute)

| **IMPORTANT**: We have deprecated the Autotrack feature for the RudderStack JavaScript SDK. If you still wish to use it for your project, refer to [this repository](https://github.com/rudderlabs/rudder-sdk-js-autotrack#autotrack). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


# What is RudderStack?

[RudderStack](https://rudderstack.com/) is a **customer data pipeline** tool for collecting, routing and processing data from your websites, apps, cloud tools, and data warehouse.

More information on RudderStack can be found [here](https://github.com/rudderlabs/rudder-server).

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#what-is-the-rudderstack-javascript-sdk)What Is the RudderStack JavaScript SDK?

The RudderStack JavaScript SDK (released under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)) allows you to utilize our npm module `rudder-sdk-js` or `rudder-analytics.js` library to start sending event data from your website to RudderStack. After integrating this SDK, you will also be able to connect to multiple destinations such as Amplitude, Google Analytics, etc. to send your data.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-use-the-rudderstack-javascript-sdk)How to Use the RudderStack JavaScript SDK?

This Quick Start Guide will help you get up and running with using the RudderStack JavaScript SDK in no time. You just need to follow the steps below:

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-1-install-rudderstack-using-the-code-snippet)Step 1: Install RudderStack Using the Code Snippet

To integrate the SDK, place the following code snippet in the `<head>` section of your website.

You can use either the minified or non-minified version of the code:

The minified version is as follows:

```
<script>
rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load(YOUR_WRITE_KEY,DATA_PLANE_URL),rudderanalytics.page();
</script>

<script  src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"></script>

```

The non-minified version of the code is shown below:

```
<script>
	rudderanalytics = window.rudderanalytics = [];

	var  methods = [
		"load",
		"page",
		"track",
		"identify",
		"alias",
		"group",
		"ready",
		"reset",
		"getAnonymousId",
    		"setAnonymousId"
	];

	for (var i = 0; i < methods.length; i++) {
  		var method = methods[i];
  		rudderanalytics[method] = function (methodName) {
    			return function () {
      				rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
    			};
  			}(method);
	}
	rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL);
	//For example,
	//rudderanalytics.load("1Qb1F3jSWv0eKFBPZcrM7ypgjVo", "http://localhost:8080");
	rudderanalytics.page();
</script>

<script  src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js"></script>

```

You can also execute the min file in async/defer way, like:

```
<script async src="https://cdn.rudderlabs.com/rudder-analytics.min.js"></script>

```

    Combining the initialization and the above async script together
    <script type="text/javascript">
    !function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],e.factory=function(t){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(t),e.push(r),e}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
    e.load(YOUR_WRITE_KEY,DATA_PLANE_URL),
    e.page()}();
    </script>

> **NOTE**: Whichever version of the code you use, you need to replace `YOUR_WRITE_KEY` with the write key in the RudderStack Control Plane and `DATA_PLANE_URL` with the URL of the RudderStack Server/ Data Plane.<br><br>

> **NOTE** : In all the above versions, there is an explicit `page` call at the end. This is added to ensure that whenever the SDK loads in a page, a `page` call is being sent. You can remove this call completely or modify with extra page properties to suit your requirement. You can also add `page` calls in your application in places not tied directly to page load, ex: virtual page views, page renders on route change such as in SPAs.

| **IMPORTANT**: We are moving our SDK to a different path from [https://cdn.rudderlabs.com/rudder-analytics.min.js](https://cdn.rudderlabs.com/rudder-analytics.min.js) to [https://cdn.rudderlabs.com/v1/rudder-analytics.min.js](https://cdn.rudderlabs.com/v1/rudder-analytics.min.js). The earlier path may not be maintained in coming releases. |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


### Alternative Installation using NPM

While we recommended you use the JavaScript snippet above to use the SDK in your websites, you can also use this [NPM module](https://www.npmjs.com/package/rudder-sdk-js) to package RudderStack directly into your project.

- To install, run:
  `npm install rudder-sdk-js --save`
- Since the module exports a bunch of APIs on an already-defined object combined with node module caching, you should run the below code only once and use the exported object throughout your project :

```
import * as rudderanalytics from "rudder-sdk-js"
rudderanalytics.ready(() => {console.log("we are all set!!!")})
rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL)
export  {  rudderanalytics  }
```

For ES5, with _require_:

```
var rudderanalytics  =  require("rudder-sdk-js")
rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL)
exports.rudderanalytics  =  rudderanalytics
```

You can also refer to the sample projects for a walkthrough of the above: [Sample Angular Project](https://github.com/rudderlabs/rudder-analytics-angular) and [Sample React Project](https://github.com/rudderlabs/rudder-analytics-react)

**SDK-supported Browser Versions**

- Safari >=6
- IE >=10
- Edge >=15
- Mozilla >=40
- Chrome >= 37
- Opera >= 23
- Yandex>=14.12

> **NOTE**: If the SDK doesn't work on the versions you are targeting, check if adding browser polyfills to your application solves the issue.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-2-identify-your-users-using-the-identify-method)Step 2: Identify Your Users With the `identify()` Method:

The `identify()` method allows you to link users and their actions to a specific userid.

A sample example of how the `identify()` method works is as shown:

```
rudderanalytics.identify(
      "12345",
      { email: "name@domain.com" },
      {
        page: {
          path: "",
          referrer: "",
          search: "",
          title: "",
          url: ""
        }
      },
  () => {console.log("in identify call");}
);

```

In the above example, information such as the user ID, email along with contextual information such as IP address, anonymousId, etc. will be captured.

> **NOTE**: There is no need to call `identify()` for anonymous visitors to your website. Such visitors are automatically assigned an `anonymousId`.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-3-track-your-users-actions-using-the-track-method)Step 3: Track Your Users’ Actions With the `track()` Method

The `track()` method allows you to track any actions that your users might perform.

A sample example of how the `track()` method works is as shown:

```
rudderanalytics.track(
  "test track event GA3",
  {
    revenue:  30,
    currency:  'USD' ,
    user_actual_id:  12345
  },
  () => {console.log("in track call");}
);

```

In the above example, the method tracks the event ‘**test track event GA3**’, and information such as the revenue, currency, anonymousId.

You can use this method to track various other success metrics for your website, such as user signups, item purchases, article bookmarks, and much more.

> **NOTE**: To override contextual information, for ex: anonymizing IP and other contextual fields like page properties, the following template can be used. Similarly one can override the auto-generated anonymousId with provided ID. For this:

```
rudderanalytics.track(
  "test track event GA3",
  {
    revenue:  30,
    currency:  'USD' ,
    user_actual_id:  12345
  },
  () => {console.log("in track call");}
);

```

You’ve now successfully installed `rudder-analytics.js` tracking. You can enable and use any event destination to send your event data via RudderStack, in no time at all.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-4-check-ready-state)Step 4: Check Ready State

There are cases when you may want to tap into the features provide by end destination SDKs to enhance tracking and other functionalities. RudderStack's JavaScript SDK exposes a `ready` API with a `callback` parameter, that fires when the SDK is done initializing itself and other third-party native SDK destinations.

For example:

```
rudderanalytics.ready(
	() => {console.log("we are all set!!!");}
);

```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#adding-callbacks-to-standard-methods)Adding callbacks to standard methods

| **For detailed technical documentation and troubleshooting guide on the RudderStack’s JavaScript SDK, check out our [docs](https://docs.rudderlabs.com/sdk-integration-guide/getting-started-with-javascript-sdk).** |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#querystring-api)Querystring API

RudderStack's Querystring API allows you to trigger `track`, `identify` calls using query parameters. If you pass the following parameters in the URL, then it will trigger the corresponding SDK API call.

For example:

```
http://hostname.com/?ajs_uid=12345&ajs_event=test%20event&ajs_aid=abcde&ajs_prop_testProp=prop1&ajs_trait_name=Firstname+Lastname
```

For the above URL, the below SDK calls will be triggered:

```
rudderanalytics.identify("12345", {name: "Firstname Lastname"});
rudderanalytics.track("test event", {testProp: "prop1"});
rudderanalytics.setAnonymousId("abcde");
```

You may use the below parameters as querystring parameter and trigger the corresponding call.

`ajs_uid` : Makes a `rudderanalytics.identify()` call with `userId` having the value of the parameter value.

`ajs_aid` : Makes a `rudderanalytics.setAnonymousId()` call with `anonymousId` having the value of the parameter value.

`ajs_event` : Makes a `rudderanalytics.track()` call with `event` name as parameter value.

`ajs_prop_<property>` : If `ajs_event` is passed as querystring, value of this parameter will populate the `properties` of the corresponding event in the `track` call.

`ajs_trait_<trait>` : If `ajs_uid` is provided as querysting, value of this parameter will populate the `traits` of the `identify` call made.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#adding-callbacks-to-standard-methods)Adding Callbacks to Standard Methods

You can also define callbacks to the common methods of the `rudderanalytics` object.

> **Note**: For now, the functionality is supported for `syncPixel` method which is called in the SDK when making sync calls in integrations for relevant destinations.

For example:

```
<script>
rudderanalytics.syncPixelCallback = obj  => {
    rudderanalytics.track(
         "sync lotame",
         { destination: obj.destination },
         { integrations: { All: false, S3: true } }
    );
};
</script>

<script src="https://cdn.rudderlabs.com/rudder-analytics.min.js"></script>

```

In the above example, we are defining a `syncPixelCallback` on the analytics object before the call to load the SDK. This will lead to calling of this registered callback with the parameter `{destination: <destination_name>}` whenever a sync call is made from the SDK for relevant integrations like _Lotame_.

The callback can be supplied in options parameter like below as well:

```
//define the callbacks directly on the load method like:
rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL,
	                    { clientSuppliedCallbacks: {
						    "syncPixelCallback": () => {console.log('sync done!')}
						  }
						}
)
```

We will be adding similar callbacks for APIs such as `track`, `page`, `identify`, etc.

| **IMPORTANT**: We have deprecated the Autotrack feature for the RudderStack JavaScript SDK. If you still wish to use it for your project, refer to [this repository](https://github.com/rudderlabs/rudder-sdk-js-autotrack#autotrack). |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |


# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#self-hosted-control-plane)Self-Hosted Control Plane

If you are using user behavior monitoring tools such as Heap, FullStory, etc., the JavaScript SDK needs to fetch the required configuration from the Control Plane. If you are using the RudderStack Config Generator to host your own Control Plane, then follow [this guide](https://docs.rudderstack.com/how-to-guides/rudderstack-config-generator) and make a `load` call as shown:

```
rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL, {configUrl: CONTROL_PLANE_URL});

```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#contribute)Contribute

You can start adding integrations of your choice for sending data through their JavaScript SDKs.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-build-the-sdk)How To Build the SDK

- Look for run scripts in the `package.json` file for getting browser minified and non-minified builds. The builds are updated in the `dist` folder of the directory. Among the others, the important ones are:

  - `npm run buildProdBrowser` : This outputs **rudder-analytics.min.js**.
  - `npm run buildProdBrowserBrotli`: This outputs two files, **rudder-analytics.min.br.js** (the original minified file, same as above) and **rudder-analytics.min.br.js.br** (the brotli compressed file).
  - `npm run buildProdBrowserGzip`: This outputs two files, **rudder-analytics.min.gzip.js** (the original minified file, same as above) and **rudder-analytics.min.gzip.js.gz** (the gzipped compressed file).

  We are using **rollup** to build our SDKs, configuration for it is present in `rollup.config.js` in the repo directory.

- For adding or removing integrations, modify the imports in `index.js` under integrations folder.

# Contact Us

For more support on using the RudderStack JavaScript SDK, feel free to [contact us](https://rudderstack.com/contact/) or start a conversation on our [Slack](https://resources.rudderstack.com/join-rudderstack-slack) channel.

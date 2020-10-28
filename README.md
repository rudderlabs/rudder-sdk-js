# What is RudderStack?

Rudder is an enterprise-ready, open-source alternative to Segment, for collecting and routing customer event data. More information on Rudder can be found  [here](https://github.com/rudderlabs/rudder-server).

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#what-is-the-rudderstack-javascript-sdk)What is the RudderStack JavaScript SDK?

The RudderStack JavaScript SDK (released under  [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)) allows you to utilize our npm module `rudder-sdk-js` or `rudder-analytics.js`  library to start sending event data from your website to RudderStack. After integrating this SDK, you will also be able to connect to multiple destinations such as Amplitude, Google Analytics, etc. to send the data.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-use-the-rudderstack-javascript-sdk)How to use the RudderStack JavaScript SDK?

This Quick Start Guide will help you get up and running with using the RudderStack JavaScript SDK in no time. You just need to follow the steps below:

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-1-install-rudderstack-using-the-code-snippet)Step 1: Install RudderStack using the code snippet

To integrate the SDK, place the following code snippet in the  `<head>`  section of your website.

You can use either the minified or non-minified version of the code:

The minified version is as follows:

```
<script> 
rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("YOUR_WRITE_KEY","DATA_PLANE_URI"),rudderanalytics.page();
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
	rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI");
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
    e.load("WRITE_KEY","RUDDER_SERVER_URL"),
    e.page()}();
    </script>

**NOTE**: Whichever version of the code you use, you need to replace  `YOUR_WRITE_KEY`  with the write key in the RudderStack Control Plane and  `DATA_PLANE_URI`  with the URI of the RudderStack Server/ Data Plane.

**NOTE** : In all the above versions, there is an explicit `page` call at the last. This is added to ensure whenever the SDK loads in a page, a page call is being sent. You can remove this call completely or modify with extra page properties to suit your need. You can also add page calls in your application in places not tied directly to page load, ex: virtual page views, page renders on route change such as in SPAs.

**NOTE**: We are moving our sdk to a diiferent path from the earlier  [https://cdn.rudderlabs.com/rudder-analytics.min.js](https://cdn.rudderlabs.com/rudder-analytics.min.js)  to  [https://cdn.rudderlabs.com/v1/rudder-analytics.min.js](https://cdn.rudderlabs.com/v1/rudder-analytics.min.js). The earlier path may not be maintained in coming releases.

**Alternative installation using NPM**
It is recommended to use the snippet above to use Rudder SDK in your websites, but one can use this [NPM module](https://www.npmjs.com/package/rudder-sdk-js) to package Rudder directly into your project.

 - To install:
`npm install rudder-sdk-js --save`
- Since, the module exports a bunch of api's on a already defined object combined with node module caching, you should perform the below only once and use the exported object throughout your project :
 ```
 import * as rudderanalytics from "rudder-sdk-js"
rudderanalytics.ready(() => {console.log("we are all set!!!")})
rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI")
export  {  rudderanalytics  }
 ```
 For es5, with *require*:
```
var rudderanalytics  =  require("rudder-sdk-js")
rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI")
exports.rudderanalytics  =  rudderanalytics
``` 
You can also refer to the sample projects for a walkthrough of the above: [sample angular project](https://github.com/rudderlabs/rudder-analytics-angular) and [sample react project](https://github.com/rudderlabs/rudder-analytics-react)

**SDK Supported browser versions**
 - Safari >=6 
 -  IE >=10  
 -  Edge >=15
 -  Mozilla >=40   
 - Chrome >= 37 
 -  Opera >= 23
 -  Yandex>=14.12  

 
 
 **NOTE**: If the SDK doesn't work on the versions you are targeting, check if adding browser polyfills to your application solves the issue.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-2-identify-your-users-using-the-identify-method)Step 2: Identify your users using the  `identify()`  method:

The  `identify()`  method allows you to link users and their actions to a specific userid.

A sample example of how the  `identify()`  method works is as shown:

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

**NOTE**: There is no need to call  `identify()`  for anonymous visitors to your website. Such visitors are automatically assigned an anonymousId.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-3-track-your-users-actions-using-the-track-method)Step 3: Track your users’ actions using the  `track()`  method

The  `track()`  method allows you to track any actions that your users might perform.

A sample example of how the track() method works is as shown:

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

In the above example, the method tracks the event ‘test track event GA3’, information such as the revenue, currency, anonymousId.

You can use this method to track various other success metrics for your website, such as user signups, item purchases, article bookmarks, and much more.

**NOTE**: To override contextual information, for ex: anonymising IP and other contextual fields like page properties, the following template can be used. Similarly one can override the auto generated anonymousId with provided id. For this:

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

And we’re done! You’ve successfully installed  `rudder-analytics.js`  tracking. Now you can enable and use any event destination to send your processed event data that you want, in no time at all.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#step-4-check-ready-state)Step 4: Check Ready State

There are cases when one may want to tap into the features provide by end destination SDKs to enhance tracking and other functionality. Rudder SDK exposes a  `ready`  api with a  `callback`  parameter that fires when the SDK is done initialising itself and other third-party native-sdk destinations.

Ex:

```
rudderanalytics.ready(
	() => {console.log("we are all set!!!");}
);

```
For a detailed technical documentation and troubleshooting guide on the RudderStack’s JavaScript SDK, click  [here](https://docs.rudderlabs.com/sdk-integration-guide/getting-started-with-javascript-sdk).

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#querystring-api)Querystring API

Rudder's Querystring API allows you to trigger `track`, `identify` calls using query parameters. If you pass the following parameters in the URL, then it will trigger the corresponding sdk api call.

For example,

```
http://hostname.com/?ajs_uid=12345&ajs_event=test%20event&ajs_aid=abcde&ajs_prop_testProp=prop1&ajs_trait_name=Firstname+Lastname
```
For the above URL, the below sdk calls will be triggered.

```
rudderanalytics.identify("12345", {name: "Firstname Lastname"});
rudderanalytics.track("test event", {testProp: "prop1"});
rudderanalytics.setAnonymousId("abcde");
```

You may use the below parameters as querystring parameter and trigger the corresponding call.

`ajs_uid` 		: Will make a `rudderanalytics.identify()` call with `userId` having the value of the parameter value.

`ajs_aid` 		: Will make a `rudderanalytics.setAnonymousId()` call with `anonymousId` having the value of the parameter value.

`ajs_event`		: Will make a `rudderanalytics.track()` call with `event` name as parameter value.

`ajs_prop_<property>`	: If `ajs_event` is passed as querystring, value of this parameter will populate the `properties` of the corresponding event in the `track` call.

`ajs_trait_<trait>` 	: If `ajs_uid` is provided as querysting, value of this parameter will populate the `traits` of the `identify` call made.



# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#adding-callbacks-to-standard-methods)Adding callbacks to standard methods

One can also define callbacks to common methods of  `rudderanalytics`  object.  _**Note**_: For now, the functionality is supported for  `syncPixel`  method which is called in Rudder SDK when making sync calls in integrations for relevant destinations.

Ex:

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
In the above example, we are defining a  `syncPixelCallback`  on the analytics object before the call to load the SDK. This will lead to calling of this registered callback with the parameter  `{destination: <destination_name>}`  whenever a sync call is made from Rudder SDK for relevant integrations like  _Lotame_.

The callback can be supplied in options parameter like below as well:

```
//define the callbacks directly on the load method like:
rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI",
	                    { clientSuppliedCallbacks: {
						    "syncPixelCallback": () => {console.log('sync done!')}
						  }
						}
)
```


We will be adding similar callbacks for apis such as  `track, page, identify`  etc.

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#autotrack)Autotrack

It may happen that the need arises to track most of user interactions with a web-app. It becomes hard for a developer to capture these DOM interactions and make track calls for all. The autotrack feature of Rudder SDK helps in tracking all user interactions like  `click | change | submit`  automatically. The data generated will be verbose and to make sense of the data, one can use  `user transformations`  from the config-plane to build use-cases like monitoring user journeys etc. For more information and payload structure, click  [here](https://docs.rudderstack.com/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk/rudderstack-autotrack-feature).

To enable autotracking, make the load call as:

```
rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI", {useAutoTracking:  true});

```

## Security

**IMPORTANT**: We have a bunch of safeguards around collecting sensitive information (as documented below). Despite all the checks, it is possible that some sensitive data (particularly passwords) can still be captured for certain React apps, or a number of password manager browser extensions which store passwords in the attributes in the DOM. 

This issue was first reported for [MixPanel](https://techcrunch.com/2018/02/05/mixpanel-passwords/) and also documented [here](https://freedom-to-tinker.com/2018/02/26/no-boundaries-for-credentials-password-leaks-to-mixpanel-and-session-replay-companies/).


**So, please use the autotrack feature after thoroughly testing it on your application. RudderStack doesn't store any data but this data may end up in your downstream destinations, including your warehouse.**


By default, the SDK does not track hidden, password elements, and element of type input, select, text-areas, i.e, events like `click | change | submit` on these elements won’t get tracked.

**Note**: If an element with class `rudder-include` is present, that element becomes eligible for tracking.

By default, the SDK doesn't capture any DOM element **values**. To start capturing values, like form field values when submitting the form, other input element values etc, whitelist them using any attribute of the element for which you want to send values, For ex, tracking element values for all elements whose any one attribute is "CLASS_ATTR_NAME":

```
rudderanalytics.load(YOUR_WRITE_KEY, DATA_PLANE_URL, {useAutoTracking:  true, valTrackingList: ["CLASS_ATTR_NAME"]});

```

The SDK tracks the element attributes and text elements as properties of the DOM event. It removes the attributes that have information which can be **sensitive** like credit card number, SSN, PAN, Aadhar number, etc.

If an element with class `rudder-no-track` is present in the DOM, SDK will not track on that node along with any child nodes in the DOM tree.


# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#self-hosted-config-plane)Self-hosted Config Plane

Since Rudder SDK depends on the config plane for fetching configs like  `native-sdk enabled destinations etc`, if you are self-hosting the config plane, make the load call as:

```
rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI", {configUrl:  "CONFIG_PLANE_URI"});

```

# [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#contribute)Contribute

You can start adding integrations of your choice for sending data through their JavaScript SDKs.

## [](https://github.com/rudderlabs/rudder-sdk-js/blob/master/README.md#how-to-build-the-sdk)How to build the SDK

-   Look for run scripts in the  `package.json`  file for getting browser minified and non-minified builds. The builds are updated in the  `dist`  folder of the directory. Among the others, the important ones are:
    
    -   `npm run buildProdBrowser`  : This outputs  **rudder-analytics.min.js**.
    -   `npm run buildProdBrowserBrotli`: This outputs two files,  **rudder-analytics.min.br.js**  (the original minified file, same as above) and  **rudder-analytics.min.br.js.br**  (the brotli compressed file).
    -   `npm run buildProdBrowserGzip`: This outputs two files,  **rudder-analytics.min.gzip.js**  (the original minified file, same as above) and  **rudder-analytics.min.gzip.js.gz**  (the gzipped compressed file).
    
    We are using  **rollup**  to build our SDKs, configuration for it is present in  `rollup.config.js`  in the repo directory.
    
-   For adding or removing integrations, modify the imports in  `index.js`  under integrations folder.

# What is Rudder?
Rudder is an enterprise-ready, open-source alternative to Segment, for collecting and routing customer event data. More information on Rudder can be found [here](https://github.com/rudderlabs/rudder-server).

# What is the Rudder JavaScript SDK?
The Rudder JavaScript SDK (released under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)) allows you to utilize our `rudder-analytics.js` library to start sending event data from your website to Rudder. After integrating this SDK, you will also be able to connect to multiple destinations such as Amplitude, Google Analytics, etc. to send the data.

This Quick Start Guide will help you get up and running with using the Rudder JavaScript SDK in no time. You just need to follow the steps below:

# Step 1: Install Rudder using the code snippet
To integrate the SDK, place the following code snippet in the `<head>` section of your website.

You can use either the minified or non-minified version of the code:

The minified version is as follows:
```
<script> 
rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","reset"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(d){return function(){rudderanalytics.push([d,...arguments])}}(method)}rudderanalytics.load("YOUR_WRITE_KEY","DATA_PLANE_URI"),rudderanalytics.page();
</script>

<script  src="https://cdn.rudderlabs.com/rudder-analytics.min.js"></script>
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
		"reset"
	];

	for (var i=0; i<methods.length; i++) {
		var method = methods[i];
		rudderanalytics[method] = function(methodName) {
			return function() {
				rudderanalytics.push([methodName, ...arguments]);
			}
		} (method)
	}
	rudderanalytics.load("YOUR_WRITE_KEY", "DATA_PLANE_URI");
	rudderanalytics.page();
</script>

<script  src="https://cdn.rudderlabs.com/rudder-analytics.min.js"></script>
```

**NOTE**: Whichever version of the code you use, you need to replace `YOUR_WRITE_KEY` with the write key in the Rudder Control Plane and `DATA_PLANE_URI` with the URI of the Rudder Server/ Data Plane.

# Step 2: Identify your users using the `identify()` method:
The `identify()` method allows you to link users and their actions to a specific userid.

A sample example of how the `identify()` method works is as shown:
```
rudderanalytics.identify(
      "12345",
      { email: "name@domain.com" },
      {
        context: {
          ip: "0.0.0.0"
        },
        page: {
          path: "",
          referrer: "",
          search: "",
          title: "",
          url: ""
        },
        anonymousId: "12345" 
      },
  () => {console.log("in identify call");}
);
```
In the above example, information such as the user ID, email along with contextual information such as IP address, anonymousId, etc. will be captured.

**NOTE**: There is no need to call `identify()` for anonymous visitors to your website. Such visitors are automatically assigned an anonymousId.

# Step 3: Track your users’ actions using the `track()` method
The `track()` method allows you to track any actions that your users might perform.

A sample example of how the track() method works is as shown:
```
rudderanalytics.track(
  "test track event GA3",
  {
    revenue:  30,
    currency:  'USD' ,
    user_actual_id:  12345
  },
  {
    context: {
      ip:  "0.0.0.0"
    },
    anonymousId:  "00000000000000000000000000"
  }, 
  () => {console.log("in track call");}
);
```
In the above example, the method tracks the event ‘test track event GA3’, information such as the revenue, currently, user ID and other contextual information such as IP address.

You can use this method to track various other success metrics for your website, such as user signups, item purchases, article bookmarks, and much more.

And we’re done! You’ve successfully installed `rudder-analytics.js` tracking. Now you can enable and use any event destination to send your processed event data that you want, in no time at all.

For a detailed technical documentation and troubleshooting guide on the Rudder’s JavaScript SDK, click [here]()

# Contribute
You can start adding integrations of your choice for sending data through their JavaScript SDKs.

## How to build the SDK

1. Look for run scripts in the `package.json` file for getting browser minified and non-minified builds
2. For adding or removing integrations, modify the imports in `index.js` under integrations folder

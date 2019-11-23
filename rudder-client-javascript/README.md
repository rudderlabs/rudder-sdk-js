<a href="https://www.browserstack.com"><img src="https://ci3.googleusercontent.com/proxy/fRtKCNzBZpi9ih7yLQjPyjk7A9PxqJSiy1dTNOrILhk96t0fWP7SRzPd4Hn5mtbbUBydy4zbFkokhaIAs_i98IYStoc64CUjt6bgJnR3J4lRKrZyT3L7N-M7sWO8eXnpWNTQr0cn6CaZ_euFxzzQ1937Zoef_Y7tJuEN_45xzBCoxzu_418PSbZIAY9XSJDQkI_gkqiGN0G9DXpjg89Hgp7Qg3A8CwK0nw6Tv7LudmtFxNmZffIeus-Av_QQZNdumU4I0mOtrSA7z-xrPtmxlGowDkVKIMkxVk_keFoSPFUUcx8ZrHf9I7YBZB1VQUQaovzwCMfckYgNc8dejLIoUx6f_zhSdOzgFNM=s0-d-e1-ft#https://attachment.freshdesk.com/inline/attachment?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDgwMTI3MDkyMjUsImRvbWFpbiI6ImJyb3dzZXJzdGFja2hlbHAuZnJlc2hkZXNrLmNvbSIsImFjY291bnRfaWQiOjExOTkzNjV9.C2upqj448UbAjOSoYmKEHiJ016DthbCU5XIEd-4jFJY" alt="image" title="image"></a>

Tested with Browserstack.

# What is Rudder?

**Short answer:** 
Rudder is an open-source Segment alternative written in Go, built for the enterprise. .

**Long answer:** 
Rudder is a platform for collecting, storing and routing customer event data to dozens of tools. Rudder is open-source, can run in your cloud environment (AWS, GCP, Azure or even your data-centre) and provides a powerful transformation framework to process your event data on the fly.

Released under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)


# Get Started

Place the below snippet in the `<header>` section of your html.

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

<script  src="https://cdn.rudderlabs.com/rudder.min.js"></script>

```

The above snippet does the following:
1. Creates an array to store the events until the analytics object is ready.
2. Stores a list of methods below to replay them when the analytics object is ready. 
   - "load" : loads analytics.js with your write key. 
   -  "page" : to keep track whenever a user visits a page. 
   - "track" : to keep track of user actions, like purchase, signup. 
   - "identify" : to associate userId with traits. 
   - "reset" : resets the userId and traits.
3. Loads analytics object with your writekey. **You need to replace "YOUR_WRITE_KEY" with the Writekey in Rudder control plane and "DATA_PLANE_URI" with the uri of the server/data plane.**
4. Make the page() call to track the pageview. It auto captures the properties(path, referrer, search, title, url). If you want to override them, use the call mentioned in section Sample events.

Sample SDK usages can be found under **tests** directory for vanilla html integrations.

# Sample events

Sample calls on global analytics object, for more examples, refer the tests folder.
For more info regarding the api documentation of these calls, refer For further reference of these apis, please refer [Segment spec](https://segment.com/docs/sources/website/analytics.js/)

## ```identify```

```
rudderanalytics.identify(
      "12345",
      { email: "sayan@gmail.com" },
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
In the above call, these are the following parameters:
  1. a string - userid, if provided, will override the anonymousId.
  2. a dictionary, to provide user traits, like address, email etc.
  3. a dictionary that is optional but provides information like context, integrations, anonymousId etc. You can provide user      traits in the context as well and it will set the traits value. 
     -  **anonymousId** is a UUID that is generated to identify the user. If provided, it will override the generated           one.
     -  Context is a dictionary of extra information that provides useful context about a datapoint, Eg. User’s ip        address.
  4. you can provide callback that will be executed after the successful execution of identify call.
	
## ```page```

```
rudderanalytics.page(
  "Cart",
  "Cart Viewed",
  {
    path:  "",
    referrer:  "",
    search:  "",
    title:  "",
    url:  ""
  },
  {
    context: {
      ip:  "0.0.0.0"
    },
    anonymousId:  "00000000000000000000000000"
  }, 
  () => {console.log("in page call");}
);
```
In the above call, these are the following parameters:
  1. a string - category of the page
  2. a string - name of the page
  3. a dictionary, to provide properties of the page. The mentioned parameters are auto captured.
  4. a dictionary that is optional but provides information like, context, integrations, anonymousId etc. You can provide user      traits in the context as well and it will set the traits value. 
     -  **anonymousId** is a UUID that is generated to identify the user, if it is provided, it will override the generated            one.
     -  Context is a dictionary of extra information that provides useful context about a datapoint, for example the user’s ip        address.
  5. you can provide callback that will be executed after the successful execution of page call.
	
## ```track```

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
In the above call, these are the following parameters:
  1. a string - event name 
  2. a dictionary, properties of the event that you want to track, like, revenue, currency, value etc.
  3. a dictionary that is optional but provides information like, context, integrations, anonymousId etc. You can provide user      traits in the context as well and it will set the traits value. 
     -  **anonymousId** is a UUID that is generated to identify the user, if it is provided, it will override the generated           one.
     -  Context is a dictionary of extra information that provides useful context about a datapoint, for example the user’s ip         address.
  4. you can provide callback that will be executed after the successful execution of track call.



# Contribute

One can start adding integrations like *Mixpanel*, *Facebook ads* and others for sending data through their *js* sdks.

For building the sdk
- Look for run scripts in the *package.json* file for getting browser minified and non-minified specific builds.
- For adding or removing integrations, modify the *imports* in *index.js* under **integrations** folder.

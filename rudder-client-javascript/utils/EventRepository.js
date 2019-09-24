var getJSON = require("./utils.js").getJSON;
var CONFIG_URL = require("./constants.js").CONFIG_URL;
var AnalyticsManager = require("./AnalyticsManager.js");
var getCurrentTimeFormatted = require("./utils.js").getCurrentTimeFormatted;
var replacer = require("./utils.js").replacer;
var RudderPayload = require("./RudderPayload.js");
//Event Repository
class EventRepository {
    constructor(writeKey, rudderConfig, wrappers) {
      this.eventsBuffer = [];
      this.write_key = writeKey;
      this.rudderConfig = rudderConfig;
      this.enabledNativeSDK = [];
      console.log(wrappers);
      this.isLoaded = false;
      var analyticsManager = new AnalyticsManager();
      console.log("before getjson");
      getJSON(
        CONFIG_URL + "/source-config?write_key=" + writeKey,
        wrappers,
        this.isLoaded,
        function(err, data, wrapperList, isLoaded) {
          console.log("in callback");
          if (err) {
            throw new Error("unable to download configurations from server");
          } else {
            //parse the json response and populate the configuration JSON
            var configJson = JSON.parse(data);
            var enabledNativeSDK = [];
            //iterate through all destinations to find which providers require
            //native SDK enablement
            configJson.source.destinations.forEach(function(destination, index) {
              console.log(
                "Destination " +
                  index +
                  " Enabled? " +
                  destination.enabled +
                  " Type: " +
                  destination.destinationDefinition.name +
                  " Use Native SDK? " +
                  destination.config.useNativeSDK
              );
              if (destination.enabled && destination.config.useNativeSDK) {
                //enabledNativeSDK.push(destination.destinationDefinition.name)
                switch (destination.destinationDefinition.name) {
                  case "HS":
                    var hubId = destination.config.hubId;
                    hubId = "6405167";
                    console.log("=== start init====");
                    analyticsManager.initializeHubSpot(hubId, wrappers);
  
                    console.log("=== end init====");
                    //wrapperList.push(new HubspotAnalyticsManager("6405167"));
                    break;
                  case "AF":
                    break;
                  default:
                }
              }
            });
            isLoaded = true;
          }
        }
      );
      console.log("after getjson");
    }
  
    flush(rudderElement) {
      //For Javascript SDK, event will be transmitted immediately
      //so buffer is really kept to be in alignment with other SDKs
      this.eventsBuffer = [];
  
      this.eventsBuffer.push(rudderElement); //Add to event buffer
  
      //construct payload
      var payload = new RudderPayload();
      payload.batch = this.eventsBuffer;
      payload.write_key = this.write_key;
      payload.sent_at = getCurrentTimeFormatted();
      //server-side integration, XHR is node module
  
      var xhr = new XMLHttpRequest();
  
      console.log(JSON.stringify(payload, replacer));
  
      xhr.open("POST", this.rudderConfig.getEndPointUri(), false);
      xhr.setRequestHeader("Content-Type", "application/json");
  
      //register call back to reset event buffer on successfull POST
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this.eventsBuffer = []; //reset event buffer
        }
      };
      //xhr.send(JSON.stringify(payload, replacer));
    }
  }
  module.exports = {
    EventRepository: EventRepository
  };
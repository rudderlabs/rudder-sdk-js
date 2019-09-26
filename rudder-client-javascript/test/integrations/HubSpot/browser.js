import { ScriptLoader } from "../ScriptLoader";

class HubSpot {
  constructor(hubId) {
    this.hubId = hubId;
  }

  init() {
    let hubspotJs = "http://js.hs-scripts.com/" + this.hubId + ".js";
    ScriptLoader("hubspot-integration", hubspotJs);

    console.log("===in init===");
  }

  identify(rudderElement) {
    console.log("in HubspotAnalyticsManager identify");

    let traits = rudderElement.rl_message.rl_context.rl_traits;
    let traitsValue = {};

    for (let k in traits) {
      if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
        let hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
        traitsValue[hubspotkey] = traits[k];
      }
    }
    if (traitsValue["address"]) {
      let address = traitsValue["address"];
      //traitsValue.delete(address)
      delete traitsValue["address"];
      for (let k in address) {
        if (!!Object.getOwnPropertyDescriptor(address, k) && address[k]) {
          let hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
          hubspotkey = hubspotkey == "street" ? "address" : hubspotkey;
          traitsValue[hubspotkey] = address[k];
        }
      }
    }
    let userProperties = rudderElement.rl_message.rl_context.rl_user_properties;
    for (let k in userProperties) {
      if (
        !!Object.getOwnPropertyDescriptor(userProperties, k) &&
        userProperties[k]
      ) {
        let hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
        traitsValue[hubspotkey] = userProperties[k];
      }
    }

    console.log(traitsValue);

    if (typeof window !== undefined) {
      let _hsq = (window._hsq = window._hsq || []);
      _hsq.push(["identify", traitsValue]);
    }
  }

  track(rudderElement) {
    console.log("in HubspotAnalyticsManager track");
    let _hsq = (window._hsq = window._hsq || []);
    let eventValue = {};
    eventValue["id"] = rudderElement.rl_message.rl_event;
    if (
      rudderElement.rl_message.rl_properties &&
      rudderElement.rl_message.rl_properties.revenue
    ) {
      console.log("revenue: " + rudderElement.rl_message.rl_properties.revenue);
      eventValue["value"] = rudderElement.rl_message.rl_properties.revenue;
    }
    _hsq.push(["trackEvent", eventValue]);
  }

  page(rudderElement) {
    console.log("in HubspotAnalyticsManager page");
    let _hsq = (window._hsq = window._hsq || []);
    //console.log("path: " + rudderElement.rl_message.rl_properties.path);
    //_hsq.push(["setPath", rudderElement.rl_message.rl_properties.path]);
    _hsq.push(["identify",{
        email: "testtrackpage@email.com"
    }]);
    if(rudderElement.rl_message.rl_properties && rudderElement.rl_message.rl_properties.path){
      _hsq.push(["setPath", rudderElement.rl_message.rl_properties.path]);
    }
    _hsq.push(["trackPageView"]);
  }

  loaded() {
    console.log("in hubspot isLoaded");
    return !!(window._hsq && window._hsq.push !== Array.prototype.push);
  }
}

export { HubSpot };

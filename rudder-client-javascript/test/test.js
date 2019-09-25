import { getJSONTrimmed } from "../utils/utils";
import { CONFIG_URL } from "../utils/constants";
import { integrations } from "./integrations";

function init(intgArray, configArray) {
  console.log("supported intgs ", integrations);
  let i = 0;
  intgArray.forEach(intg => {
    console.log("--name--", intg);
    let intgClass = integrations[intg];
    console.log("--class-- ", intgClass);
    if (intg === "HS") {
      let hubId = configArray[i].hubId;
      console.log("==hubId== " + hubId);
      hubId = "6405167";
      let intgInstance = new intgClass(hubId);
      intgInstance.init();
    }
  });
}

class test {
  constructor() {
    this.prop1 = "val1";
    this.prop2 = "val2";
    this.ready = false;
    this.clientIntegrations = [];
    this.configArray = [];
  }

  processResponse(status, response) {
    console.log("from callback " + this.prop1);
    console.log(response);
    response = JSON.parse(response);
    response.source.destinations.forEach(function(destination, index) {
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
        this.clientIntegrations.push(destination.destinationDefinition.name);
        this.configArray.push(destination.config);
      }
    }, this);
    init(this.clientIntegrations, this.configArray);
  }

  page() {
    //if (this.ready) {
    console.log("args ", ...arguments);
    console.log("page called " + this.prop1);
    //}
  }

  track() {
    //if (this.ready) {
    console.log("track called " + this.prop2);
    //}
  }

  load(writeKey) {
    console.log("inside load " + this.prop1);
    getJSONTrimmed(
      this,
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      this.processResponse
    );
    /* setTimeout(() => {
      this.ready = true;
    }, 5000); */
  }
}

let instance = new test();

if (process.browser) {
  console.log("is present? " + !!window.analytics);
  let methodArg = window.analytics ? window.analytics[0] : [];
  if (methodArg.length > 0) {
    instance[methodArg[0]](methodArg[1]);

    instance[methodArgNext[0]]("test args 1", "test args 2");
  }

  let methodArgNext = window.analytics ? window.analytics[1] : [];

  if (methodArgNext.length > 0) {
    instance[methodArg[0]](methodArg[1]);
  }
}

let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let load = instance.load.bind(instance);

export { page, track, load };

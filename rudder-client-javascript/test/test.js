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

      this.clientIntegrationObjects.push(intgInstance);
    }
  });

  for (let i = 0; i < this.clientIntegrationObjects.length; i++) {
    //send the queued events to the fetched integration
    this.toBeProcessedArray.forEach(event => {
      let methodName = event[0];
      event.shift();
      console.log(
        "replay on integrations " + "method " + methodName + " args " + event
      );
      this.clientIntegrationObjects[i][methodName](...event);
    });
  }

  this.toBeProcessedArray = [];
}

class test {
  constructor() {
    this.prop1 = "val1";
    this.prop2 = "val2";
    this.ready = false;
    this.clientIntegrations = [];
    this.configArray = [];
    this.clientIntegrationObjects = [];
    this.toBeProcessedArray = [];
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
    init.call(this, this.clientIntegrations, this.configArray);
  }

  page() {
    console.log("type=== " + typeof arguments);

    var args = Array.from(arguments);
    console.log("args ", args);

    //try to first send to all integrations, if list populated from BE
    this.clientIntegrationObjects.forEach(obj => {
      //obj.page(...arguments);
      console.log("called in normal flow");
      obj.page({ rl_message: { rl_properties: { path: "/abc-123" } } }); //test
    });

    if (
      this.clientIntegrationObjects.length === 0 &&
      args[args.length - 1] != "wait"
    ) {
      console.log("pushing in replay queue");
      args.unshift("page");
      this.toBeProcessedArray.push(args); //new event processing after analytics initialized  but integrations not fetched from BE
    }

    // self analytics process
    console.log("args ", args.slice(0, args.length - 1));
    console.log("page called " + this.prop1);
  }

  track() {
    console.log("track called " + this.prop2);
  }

  load(writeKey) {
    console.log("inside load " + this.prop1);
    getJSONTrimmed(
      this,
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      this.processResponse
    );
  }
}

let instance = new test();

if (process.browser) {
  console.log("is present? " + !!window.analytics);
  let eventsPushedAlready =
    !!window.analytics && window.analytics.push == Array.prototype.push;

  let methodArg = window.analytics ? window.analytics[0] : [];
  if (methodArg.length > 0 && methodArg[0] == "load") {
    instance[methodArg[0]](methodArg[1]);
    //instance[methodArgNext[0]]("test args 1", "test args 2");
  }

  if (eventsPushedAlready) {
    for (let i = 1; i < window.analytics.length; i++) {
      instance.toBeProcessedArray.push(window.analytics[i]);
    }

    console.log("queued " + instance.toBeProcessedArray.length);

    for (let i = 0; i < instance.toBeProcessedArray.length; i++) {
      let event = [...instance.toBeProcessedArray[i]];
      console.log("replay event " + event);
      let method = event[0];
      event.push("wait");
      event.shift();
      console.log("replay event modified " + event);
      instance[method](...event);
    }
  }

  /* while (!instance.ready) {
    let isReady = true;
    instance.clientIntegrationObjects.forEach(obj => {
      isReady = isReady && obj.loaded();
    });
    instance.ready = instance.clientIntegrationObjects.length > 0 && isReady;
  }

  console.log("is script ready " + instance.ready);

  console.log(
    " is hubspot loaded ",
    !!(window._hsq && window._hsq.push !== Array.prototype.push)
  );

  console.log("analytics array " + window.analytics);
  let methodArgNext = window.analytics ? window.analytics[1] : [];

  if (methodArgNext.length > 0) {
    instance[methodArg[0]](methodArg[1]);
  } */
}

let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let load = instance.load.bind(instance);

export { page, track, load };

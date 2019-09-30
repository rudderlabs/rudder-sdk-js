import { getJSONTrimmed, generateUUID } from "../utils/utils";
import { CONFIG_URL, BASE_URL } from "../utils/constants";
import { integrations } from "./integrations";
import RudderElementBuilder from "../utils/RudderElementBuilder";
import { RudderTraits } from "../utils/RudderTraits";
import Storage from "../utils/storage";
import { EventRepository } from "../utils/EventRepository";

//https://unpkg.com/test-rudder-sdk@1.0.5/dist/browser.js
function init(intgArray, configArray) {
  console.log("supported intgs ", integrations);
  let i = 0;
  this.clientIntegrationObjects = [];
  if (!intgArray || intgArray.length == 0) {
    this.toBeProcessedByIntegrationArray = [];
    return;
  }
  intgArray.forEach(intg => {
    //console.log("--name--", intg);
    let intgClass = integrations[intg];
    //console.log("--class-- ", intgClass);
    if (intg === "HS") {
      let hubId = configArray[i].hubId;
      //console.log("==hubId== " + hubId);
      hubId = "6405167";
      let intgInstance = new intgClass(hubId);
      intgInstance.init();

      this.clientIntegrationObjects.push(intgInstance);
    }
  });

  for (let i = 0; i < this.clientIntegrationObjects.length; i++) {
    //send the queued events to the fetched integration
    this.toBeProcessedByIntegrationArray.forEach(event => {
      let methodName = event[0];
      event.shift();
      /* console.log(
        "replay on integrations " + "method " + methodName + " args " + event
      ); */
      //uncomment to send data to destination
      this.clientIntegrationObjects[i][methodName](...event);
    });
  }

  this.toBeProcessedByIntegrationArray = [];
}

function flush(rudderElement) {
  if (!this.eventRepository) {
    //console.log("initialize event repo")
    this.eventRepository = EventRepository;
  }
  this.eventRepository.flush(rudderElement);
}

class Analytics {
  constructor() {
    this.prop1 = "val1";
    this.prop2 = "val2";
    this.ready = false;
    this.writeKey = "";
    this.eventsBuffer = [];
    this.clientIntegrations = [];
    this.configArray = [];
    this.clientIntegrationObjects = undefined;
    this.toBeProcessedArray = [];
    this.toBeProcessedByIntegrationArray = [];
    this.storage = new Storage();
    this.userId =
      this.storage.getUserId() != undefined
        ? this.storage.getUserId()
        : generateUUID();

    this.userTraits =
      this.storage.getUserTraits() != undefined
        ? this.storage.getUserTraits()
        : {};

    this.storage.setUserId(this.userId);
    this.eventRepository = EventRepository;
  }

  processResponse(status, response) {
    //console.log("from callback " + this.prop1);
    //console.log(response);
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

  page(category, name, properties, options, callback) {
    //console.log("type=== " + typeof arguments);

    let args = Array.from(arguments);
    console.log("args ", args);
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof properties == "function")
      (callback = properties), (options = properties = null);
    if (typeof name == "function")
      (callback = name), (options = properties = name = null);
    if (typeof category === "object")
      (options = name), (properties = category), (name = category = null);
    if (typeof name === "object")
      (options = properties), (properties = name), (name = null);
    if (typeof category === "string" && typeof name !== "string")
      (name = category), (category = null);

    if (!this.userId) {
      this.userId = generateUUID();
      this.storage.setUserId(this.userId);
    }

    let rudderElement = new RudderElementBuilder().setType("page").build();
    //console.log("arg length ",arguments.length)
    let methodArguments = arguments; //arguments[0]
    if (name) {
      console.log("name ", name);
      rudderElement["rl_message"]["rl_name"] = name; //JSON.parse(arguments[1]);
    }
    if (category) {
      if (!properties) {
        properties = {};
      }
      properties["category"] = category;
    }
    if (properties) {
      console.log(JSON.parse(JSON.stringify(properties)));
      rudderElement["rl_message"]["rl_properties"] = properties; //JSON.parse(arguments[1]);
    }

    rudderElement["rl_message"]["rl_context"]["rl_traits"] = this.userTraits;
    rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement[
      "rl_message"
    ]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"][
      "rl_anonymous_id"
    ] = this.userId;

    console.log(JSON.stringify(rudderElement));

    //try to first send to all integrations, if list populated from BE
    if (this.clientIntegrationObjects) {
      this.clientIntegrationObjects.forEach(obj => {
        //obj.page(...arguments);
        //console.log("called in normal flow");
        //obj.page({ rl_message: { rl_properties: { path: "/abc-123" } } }); //test
        obj.page(rudderElement);
      });
    }

    if (
      !this.clientIntegrationObjects
      /*this.clientIntegrationObjects.length === 0  &&
      args[args.length - 1] != "wait" */
    ) {
      //console.log("pushing in replay queue");
      //args.unshift("page");
      //this.toBeProcessedArray.push(args); //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["page", rudderElement]);
    }

    // self analytics process
    //console.log("args ", args.slice(0, args.length - 1));

    flush.call(this, rudderElement);

    console.log("page called " + this.prop1);
    if (callback) {
      callback();
    }
  }

  track(event, properties, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof properties == "function")
      (callback = properties), (options = null), (properties = null);

    if (!this.userId) {
      this.userId = generateUUID();
      this.storage.setUserId(this.userId);
    }

    let rudderElement = new RudderElementBuilder().setType("track").build();
    if (event) {
      rudderElement.setEventName(event);
    }
    if (properties) {
      rudderElement.setProperty(properties);
    }

    rudderElement["rl_message"]["rl_context"]["rl_traits"] = this.userTraits;
    rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement[
      "rl_message"
    ]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"][
      "rl_anonymous_id"
    ] = this.userId;

    console.log(JSON.stringify(rudderElement));

    //try to first send to all integrations, if list populated from BE
    if (this.clientIntegrationObjects) {
      this.clientIntegrationObjects.forEach(obj => {
        console.log("called in normal flow");
        obj.track(rudderElement);
      });
    }
    if (!this.clientIntegrationObjects) {
      console.log("pushing in replay queue");
      //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["track", rudderElement]);
    }

    // self analytics process
    flush.call(this, rudderElement);

    console.log("track is called " + this.prop2);
    if (callback) {
      callback();
    }
  }

  identify(userId, traits, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof traits == "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof userId == "object")
      (options = traits), (traits = userId), (userId = this.userId);

    this.userId = userId;
    this.storage.setUserId(this.userId);

    let rudderElement = new RudderElementBuilder().setType("identify").build();
    let rudderTraits = new RudderTraits();
    console.log(traits);
    if (traits) {
      for (let k in traits) {
        if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
          rudderTraits[k] = traits[k];
        }
      }
    }

    this.userTraits = traits;
    this.storage.setUserTraits(this.userTraits);

    rudderElement["rl_message"]["rl_context"]["rl_traits"] = this.userTraits;
    rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement[
      "rl_message"
    ]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"][
      "rl_anonymous_id"
    ] = this.userId;

    console.log(JSON.stringify(rudderElement));

    //try to first send to all integrations, if list populated from BE
    if (this.clientIntegrationObjects) {
      this.clientIntegrationObjects.forEach(obj => {
        console.log("called in normal flow");
        obj.identify(rudderElement);
      });
    }
    if (!this.clientIntegrationObjects) {
      console.log("pushing in replay queue");
      //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["identify", rudderElement]);
    }

    // self analytics process
    flush.call(this, rudderElement);

    console.log("identify is called " + this.prop2);
    if (callback) {
      callback();
    }
  }

  reset() {
    this.userId = "";
    this.userTraits = {};
    this.storage.clear();
  }

  load(writeKey) {
    console.log("inside load " + this.prop1);
    this.writeKey = writeKey;
    getJSONTrimmed(
      this,
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      this.processResponse
    );
  }
}

let instance = new Analytics();

if (process.browser) {
  //console.log("is present? " + !!window.analytics);
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

    //console.log("queued " + instance.toBeProcessedArray.length);

    for (let i = 0; i < instance.toBeProcessedArray.length; i++) {
      let event = [...instance.toBeProcessedArray[i]];
      //console.log("replay event " + event);
      let method = event[0];
      event.shift();
      //console.log("replay event modified " + event);
      instance[method](...event);
    }
    instance.toBeProcessedArray = [];
  }
}

let identify = instance.identify.bind(instance);
let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let reset = instance.reset.bind(instance);
let load = instance.load.bind(instance);

export { page, track, load, identify, reset };

import { getJSONTrimmed, generateUUID } from "./utils/utils";
import { CONFIG_URL, ECommerceEvents } from "./utils/constants";
import { integrations } from "./integrations";
import RudderElementBuilder from "./utils/RudderElementBuilder";
import { RudderTraits } from "./utils/RudderTraits";
import Storage from "./utils/storage";
import { EventRepository } from "./utils/EventRepository";
import PromotionViewedEvent from "./utils/PromotionViewedEvent";
import ECommercePromotion from "./utils/ECommercePromotion";

//https://unpkg.com/test-rudder-sdk@1.0.5/dist/browser.js

if (process.prod) {
  console.log = () => {};
}

function flush(rudderElement) {
  if (!this.eventRepository) {
    this.eventRepository = EventRepository;
  }
  this.eventRepository.flush(rudderElement);
}

class Analytics {
  constructor() {
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
    this.init(this.clientIntegrations, this.configArray);
  }

  init(intgArray, configArray) {
    console.log("supported intgs ", integrations);
    let i = 0;
    this.clientIntegrationObjects = [];
    if (!intgArray || intgArray.length == 0) {
      this.toBeProcessedByIntegrationArray = [];
      return;
    }
    intgArray.forEach(intg => {
      let intgClass = integrations[intg];
      if (intg === "HS") {
        let hubId = configArray[i].hubId;
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
        this.clientIntegrationObjects[i][methodName](...event);
      });
    }

    this.toBeProcessedByIntegrationArray = [];
  }

  page(category, name, properties, options, callback) {
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
    this.processPage(category, name, properties, options, callback);
    
  }

  track(event, properties, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof properties == "function")
      (callback = properties), (options = null), (properties = null);

    this.processTrack(event, properties, options, callback);
  }

  identify(userId, traits, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof traits == "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof userId == "object")
      (options = traits), (traits = userId), (userId = this.userId);
    
    this.processIdentify(userId, traits, options, callback);
  }

  processPage(category, name, properties, options, callback){
    if (!this.userId) {
      this.userId = generateUUID();
      this.storage.setUserId(this.userId);
    }

    let rudderElement = new RudderElementBuilder().setType("page").build();
    if (name) {
      console.log("name ", name);
      rudderElement["rl_message"]["rl_name"] = name;
    }
    if (category) {
      if (!properties) {
        properties = {};
      }
      properties["category"] = category;
    }
    if (properties) {
      console.log(JSON.parse(JSON.stringify(properties)));
      rudderElement["rl_message"]["rl_properties"] = properties;
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
        obj.page(rudderElement);
      });
    }

    if (!this.clientIntegrationObjects) {
      //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["page", rudderElement]);
    }

    flush.call(this, rudderElement);

    console.log("page called " + this.prop1);
    if (callback) {
      callback();
    }
  }

  processTrack(event, properties, options, callback){
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

  processIdentify(userId, traits, options, callback){
    this.userId = userId;
    this.storage.setUserId(this.userId);

    let rudderElement = new RudderElementBuilder().setType("identify").build();
    let rudderTraits = new RudderTraits();
    console.log(traits);
    if (traits) {
      this.userTraits = traits;
      this.storage.setUserTraits(this.userTraits);
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

  identifyUser(rudderElement, callback){
    this.userId = userId;
    this.storage.setUserId(this.userId);

    if (rudderElement && rudderElement["rl_message"]
        && rudderElement["rl_message"]["rl_context"] 
        && rudderElement["rl_message"]["rl_context"]["rl_traits"] ) {
      this.userTraits = traits;
      this.storage.setUserTraits(this.userTraits);
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

  trackPage(rudderElement, callback){
    if (!this.userId) {
      this.userId = generateUUID();
      this.storage.setUserId(this.userId);
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
        obj.page(rudderElement);
      });
    }

    if (!this.clientIntegrationObjects) {
      //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["page", rudderElement]);
    }

    flush.call(this, rudderElement);

    console.log("page called " + this.prop1);
    if (callback) {
      callback();
    }
  }

  trackEvent(rudderElement, callback){
    if (!this.userId) {
      this.userId = generateUUID();
      this.storage.setUserId(this.userId);
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
  let eventsPushedAlready =
    !!window.analytics && window.analytics.push == Array.prototype.push;

  let methodArg = window.analytics ? window.analytics[0] : [];
  if (methodArg.length > 0 && methodArg[0] == "load") {
    instance[methodArg[0]](methodArg[1]);
  }

  if (eventsPushedAlready) {
    for (let i = 1; i < window.analytics.length; i++) {
      instance.toBeProcessedArray.push(window.analytics[i]);
    }

    for (let i = 0; i < instance.toBeProcessedArray.length; i++) {
      let event = [...instance.toBeProcessedArray[i]];
      let method = event[0];
      event.shift();
      instance[method](...event);
    }
    instance.toBeProcessedArray = [];
  }
}

let identify = instance.identify.bind(instance);
let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let trackEvent = instance.trackEvent.bind(instance);
let reset = instance.reset.bind(instance);
let load = instance.load.bind(instance);

export {
  page,
  track,
  load,
  identify,
  reset,
  trackEvent,
  RudderElementBuilder,
  PromotionViewedEvent,
  ECommercePromotion,
  ECommerceEvents
};

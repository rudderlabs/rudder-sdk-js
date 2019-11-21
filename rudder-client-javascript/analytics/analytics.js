import { getJSONTrimmed, generateUUID, handleError, getDefaultPageProperties } from "./utils/utils";
import { CONFIG_URL, ECommerceEvents, MAX_WAIT_FOR_INTEGRATION_LOAD, INTEGRATION_LOAD_CHECK_INTERVAL } from "./utils/constants";
import { integrations } from "./integrations";
import RudderElementBuilder from "./utils/RudderElementBuilder";
import Storage from "./utils/storage";
import { EventRepository } from "./utils/EventRepository";
import PromotionViewedEvent from "./utils/PromotionViewedEvent";
import ECommercePromotion from "./utils/ECommercePromotion";

//https://unpkg.com/test-rudder-sdk@1.0.5/dist/browser.js

/**
 * Add the rudderelement object to flush queue
 *
 * @param {RudderElement} rudderElement
 */
function enqueue(rudderElement) {
  if (!this.eventRepository) {
    this.eventRepository = EventRepository;
  }
  this.eventRepository.enqueue(rudderElement);
}

/**
 * class responsible for handling core
 * event tracking functionalities
 */
class Analytics {
  /**
   * Creates an instance of Analytics.
   * @memberof Analytics
   */
  constructor() {
    this.initialized = false
    this.ready = false;
    this.eventsBuffer = [];
    this.clientIntegrations = [];
    this.configArray = [];
    this.clientIntegrationObjects = undefined;
    this.successfullyLoadedIntegration = [];
    this.failedToBeLoadedIntegration = [];
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

  /**
   * Process the response from control plane and
   * call initialize for integrations
   *
   * @param {*} status
   * @param {*} response
   * @memberof Analytics
   */
  processResponse(status, response) {
    console.log("===in process response=== " + status);
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

  /**
   * Initialize integrations by addinfg respective scripts
   * keep the instances reference in core
   *
   * @param {*} intgArray
   * @param {*} configArray
   * @returns
   * @memberof Analytics
   */
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
        let intgInstance = new intgClass(hubId);
        intgInstance.init();

        //this.clientIntegrationObjects.push(intgInstance);
        this.isInitialized(intgInstance).then(this.replayEvents);
      }
      if (intg === "GA") {
        let trackingID = configArray[i].trackingID;
        let intgInstance = new intgClass(trackingID);
        intgInstance.init();

        //this.clientIntegrationObjects.push(intgInstance);
        this.isInitialized(intgInstance).then(this.replayEvents);
      }
      if (intg === "HOTJAR") {
        let siteID = configArray[i].siteID;
        let intgInstance = new intgClass(siteID);
        intgInstance.init();

        /* As we Hotjar tracks all events by itself, no need to send events explicitly. 
           So, not putting 'Hotjar' object in clientIntegrationObjects list. */
      }
      if(intg === "GOOGLEADS"){
        let googleAdsConfig = configArray[i];
        let intgInstance = new intgClass(googleAdsConfig);
        intgInstance.init();

        this.isInitialized(intgInstance).then(this.replayEvents);
      }
    });
    
  }

  replayEvents(object){
    if(object.successfullyLoadedIntegration.length + object.failedToBeLoadedIntegration.length == object.clientIntegrations.length){
      object.clientIntegrationObjects = object.successfullyLoadedIntegration;
      //send the queued events to the fetched integration
      object.toBeProcessedByIntegrationArray.forEach(event => {
        let methodName = event[0];
        event.shift();
        let integrationOptions = event[0].message.integrations;
        for (let i = 0; i < object.clientIntegrationObjects.length; i++) {
          if (
            integrationOptions[object.clientIntegrationObjects[i].name] ||
            (integrationOptions[object.clientIntegrationObjects[i].name] ==
              undefined &&
              integrationOptions["All"])
          ) {
            try {
              object.clientIntegrationObjects[i][methodName](...event);
            } catch (error) {
              handleError(error);
            }
          }
        }
      });
      object.toBeProcessedByIntegrationArray = [];
    }
  }

  pause(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }


  isInitialized(instance, time = 0){
    return new Promise((resolve) => {
      if(instance.isLoaded()){
        this.successfullyLoadedIntegration.push(instance);
        return resolve(this);
      }
      if(time >= MAX_WAIT_FOR_INTEGRATION_LOAD){
        console.log("====max wait over====")
        this.failedToBeLoadedIntegration.push(instance);
        return resolve(this);
      }

      this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() => {
        return this.isInitialized(instance, time + INTEGRATION_LOAD_CHECK_INTERVAL ).then(resolve);
      });
    });

  }

  /**
   * Process page params and forward to page call
   *
   * @param {*} category
   * @param {*} name
   * @param {*} properties
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
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

  /**
   * Process track params and forward to track call
   *
   * @param {*} event
   * @param {*} properties
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  track(event, properties, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof properties == "function")
      (callback = properties), (options = null), (properties = null);

    this.processTrack(event, properties, options, callback);
  }

  /**
   * Process identify params and forward to indentify  call
   *
   * @param {*} userId
   * @param {*} traits
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  identify(userId, traits, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof traits == "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof userId == "object")
      (options = traits), (traits = userId), (userId = this.userId);

    this.processIdentify(userId, traits, options, callback);
  }

  /**
   * Send page call to Rudder BE and to initialized integrations
   *
   * @param {*} category
   * @param {*} name
   * @param {*} properties
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  processPage(category, name, properties, options, callback) {
    let rudderElement = new RudderElementBuilder().setType("page").build();
    if (name) {
      rudderElement["message"]["name"] = name;
    }
    if (!properties) {
      properties = {};
    }
    if (category) {
      properties["category"] = category;
    }
    if (properties) {
      rudderElement["message"]["properties"] = this.getPageProperties(properties)//properties;
    }

    this.trackPage(rudderElement, options, callback);
  }

  /**
   * Send track call to Rudder BE and to initialized integrations
   *
   * @param {*} event
   * @param {*} properties
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  processTrack(event, properties, options, callback) {
    let rudderElement = new RudderElementBuilder().setType("track").build();
    if (event) {
      rudderElement.setEventName(event);
    }
    if (properties) {
      rudderElement.setProperty(properties);
    } else {
      rudderElement.setProperty({});
    }

    this.trackEvent(rudderElement, options, callback);
  }

  /**
   * Send identify call to Rudder BE and to initialized integrations
   *
   * @param {*} userId
   * @param {*} traits
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  processIdentify(userId, traits, options, callback) {
    if(userId !== this.userId){
      this.reset();
    }
    this.userId = userId;
    this.storage.setUserId(this.userId);

    let rudderElement = new RudderElementBuilder().setType("identify").build();
    if (traits) {
      for(let key in traits){
        this.userTraits[key] = traits[key]
      }
      this.storage.setUserTraits(this.userTraits);
    }

    this.identifyUser(rudderElement, options, callback);
  }

  /**
   * Identify call supporting rudderelement from builder
   *
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  identifyUser(rudderElement, options,callback) {
    if (rudderElement["message"]["userId"]) {
      this.userId = rudderElement["message"]["userId"];
      this.storage.setUserId(this.userId);
    }

    if (
      rudderElement &&
      rudderElement["message"] &&
      rudderElement["message"]["context"] &&
      rudderElement["message"]["context"]["traits"]
    ) {
      this.userTraits = Object.assign({},rudderElement["message"]["context"]["traits"]);
      this.storage.setUserTraits(this.userTraits);
    }

    this.processAndSendDataToDestinations("identify", rudderElement, options, callback);
  }

  /**
   * Page call supporting rudderelement from builder
   *
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  trackPage(rudderElement, options, callback) {
    this.processAndSendDataToDestinations("page", rudderElement, options, callback);
  }

  /**
   * Track call supporting rudderelement from builder
   *
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  trackEvent(rudderElement, options, callback) {
    this.processAndSendDataToDestinations("track", rudderElement, options, callback);
  }

  /**
   * Process and send data to destinations along with rudder BE
   *
   * @param {*} type
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  processAndSendDataToDestinations(type, rudderElement, options, callback) {
    try{
      if (!this.userId) {
        this.userId = generateUUID();
        this.storage.setUserId(this.userId);
      }

      rudderElement["message"]["context"]["traits"] = Object.assign({}, this.userTraits);
      rudderElement["message"]["anonymousId"] = rudderElement["message"][
        "userId"
      ] = rudderElement["message"]["context"]["traits"][
        "anonymousId"
      ] = this.userId;

      if (options) {
        this.processOptionsParam(rudderElement, options);
      }
      console.log(JSON.stringify(rudderElement));

      var integrations = rudderElement.message.integrations;

      //try to first send to all integrations, if list populated from BE
      if (this.clientIntegrationObjects) {
        this.clientIntegrationObjects.forEach(obj => {
          console.log("called in normal flow");
          if (
            integrations[obj.name] ||
            (integrations[obj.name] == undefined && integrations["All"])
          ) {
            obj[type](rudderElement);
          }
        });
      }
      if (!this.clientIntegrationObjects) {
        console.log("pushing in replay queue");
        //new event processing after analytics initialized  but integrations not fetched from BE
        this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
      }

      // self analytics process
      enqueue.call(this, rudderElement);

      console.log(type + " is called ");
      if (callback) {
        callback();
      }
    } catch (error){
      handleError(error);
    }
  }

  /**
   * process options parameter
   *
   * @param {*} rudderElement
   * @param {*} options
   * @memberof Analytics
   */
  processOptionsParam(rudderElement, options){
    var toplevelElements = ['integrations', 'anonymousId', 'originalTimestamp']; 
    for(let key in options){
      if(toplevelElements.includes(key)){
        rudderElement.message[key] = options[key]
        //special handle for ananymousId as transformation expects anonymousId in traits.
        if(key === 'anonymousId'){
          rudderElement.message.context.traits['anonymousId'] = options[key]
        }
      } else {
        if(key !== 'context')
          rudderElement.message.context[key] = options[key]
        else{
          for(let k in options[key]){
            rudderElement.message.context[k] = options[key][k]
          }
        }
      }

    }
  }

  getPageProperties(properties){
    let defaultPageProperties = getDefaultPageProperties();
    for(let key in defaultPageProperties){
      if(properties[key] === undefined){
        properties[key] = defaultPageProperties[key]
      }
    }
    return properties;
  }

  /**
   * Clear user information
   *
   * @memberof Analytics
   */
  reset() {
    this.userId = "";
    this.userTraits = {};
    this.storage.clear();
  }

  /**
   * Call control pane to get client configs
   *
   * @param {*} writeKey
   * @memberof Analytics
   */
  load(writeKey, serverUrl) {
    console.log("inside load ");
    this.eventRepository.writeKey = writeKey;
    if(serverUrl){
      this.eventRepository.url = serverUrl;
    }
    getJSONTrimmed(this, CONFIG_URL, writeKey, this.processResponse);
  }
}

if (process.browser) {
  window.addEventListener('error', function(e) {
    handleError(e);
  }, true);
}

let instance = new Analytics();

if (process.browser) {
  let eventsPushedAlready =
    !!window.rudderanalytics && window.rudderanalytics.push == Array.prototype.push;

  let methodArg = window.rudderanalytics ? window.rudderanalytics[0] : [];
  if (methodArg.length > 0 && methodArg[0] == "load") {
    let method = methodArg[0];
    methodArg.shift();
    instance[method](...methodArg);
  }

  if (eventsPushedAlready) {
    for (let i = 1; i < window.rudderanalytics.length; i++) {
      instance.toBeProcessedArray.push(window.rudderanalytics[i]);
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
let reset = instance.reset.bind(instance);
let load = instance.load.bind(instance);
let initialized = instance.initialized = true

export {
  initialized,
  page,
  track,
  load,
  identify,
  reset
};

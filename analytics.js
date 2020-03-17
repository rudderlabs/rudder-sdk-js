import {
  getJSONTrimmed,
  generateUUID,
  handleError,
  getDefaultPageProperties
} from "./utils/utils";
import {
  CONFIG_URL,
  ECommerceEvents,
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL
} from "./utils/constants";
import { integrations } from "./integrations";
import RudderElementBuilder from "./utils/RudderElementBuilder";
import Storage from "./utils/storage";
import { EventRepository } from "./utils/EventRepository";
import logger from "./utils/logUtil";
import { addDomEventHandlers } from "./utils/autotrack.js";
import Emitter from "component-emitter";
import after from "after";

//https://unpkg.com/test-rudder-sdk@1.0.5/dist/browser.js

/**
 * Add the rudderelement object to flush queue
 *
 * @param {RudderElement} rudderElement
 */
function enqueue(rudderElement, type) {
  if (!this.eventRepository) {
    this.eventRepository = EventRepository;
  }
  this.eventRepository.enqueue(rudderElement, type);
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
    this.autoTrackHandlersRegistered = false;
    this.autoTrackFeatureEnabled = false;
    this.initialized = false;
    this.trackValues = [];
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
      this.storage.getUserId() != undefined ? this.storage.getUserId() : "";

    this.userTraits =
      this.storage.getUserTraits() != undefined
        ? this.storage.getUserTraits()
        : {};

    this.groupId =
      this.storage.getGroupId() != undefined ? this.storage.getGroupId() : "";

    this.groupTraits =
      this.storage.getGroupTraits() != undefined
        ? this.storage.getGroupTraits()
        : {};

    this.anonymousId = this.getAnonymousId();
    this.storage.setUserId(this.userId);
    this.eventRepository = EventRepository;
    this.readyCallback = () => {};
    this.executeReadyCallback = undefined;
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
    try {
      logger.debug("===in process response=== " + status);
      response = JSON.parse(response);
      if (
        response.source.useAutoTracking &&
        !this.autoTrackHandlersRegistered
      ) {
        this.autoTrackFeatureEnabled = true;
        addDomEventHandlers(this);
        this.autoTrackHandlersRegistered = true;
      }
      response.source.destinations.forEach(function(destination, index) {
        logger.debug(
          "Destination " +
            index +
            " Enabled? " +
            destination.enabled +
            " Type: " +
            destination.destinationDefinition.name +
            " Use Native SDK? " +
            destination.config.useNativeSDK
        );
        if (destination.enabled) {
          this.clientIntegrations.push(destination.destinationDefinition.name);
          this.configArray.push(destination.config);
        }
      }, this);
      this.init(this.clientIntegrations, this.configArray);
    } catch (error) {
      handleError(error);
      logger.debug("===handling config BE response processing error===");
      logger.debug(
        "autoTrackHandlersRegistered",
        this.autoTrackHandlersRegistered
      );
      if (this.autoTrackFeatureEnabled && !this.autoTrackHandlersRegistered) {
        addDomEventHandlers(this);
        this.autoTrackHandlersRegistered = true;
      }
    }
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
    let self = this;
    logger.debug("supported intgs ", integrations);
    // this.clientIntegrationObjects = [];

    if (!intgArray || intgArray.length == 0) {
      if (this.readyCallback) {
        this.readyCallback();
      }
      this.toBeProcessedByIntegrationArray = [];
      return;
    }
    intgArray.forEach((intg, index) => {
      let intgClass = integrations[intg];
      let destConfig = configArray[index];
      let intgInstance = new intgClass(destConfig, self);
      intgInstance.init();

      logger.debug("initializing destination: ", intg);

      this.isInitialized(intgInstance).then(this.replayEvents);
    });
  }

  replayEvents(object) {
    if (
      object.successfullyLoadedIntegration.length +
        object.failedToBeLoadedIntegration.length ==
      object.clientIntegrations.length
    ) {
      object.clientIntegrationObjects = [];
      object.clientIntegrationObjects = object.successfullyLoadedIntegration;

      object.executeReadyCallback = after(
        object.clientIntegrationObjects.length,
        object.readyCallback
      );

      object.on("ready", object.executeReadyCallback);

      object.clientIntegrationObjects.forEach(intg => {
        if (!intg["isReady"] || intg["isReady"]()) {
          object.emit("ready");
        }
      });

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
              if (
                !object.clientIntegrationObjects[i]["isFailed"] ||
                !object.clientIntegrationObjects[i]["isFailed"]()
              ) {
                object.clientIntegrationObjects[i][methodName](...event);
              }
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

  isInitialized(instance, time = 0) {
    return new Promise(resolve => {
      if (instance.isLoaded()) {
        this.successfullyLoadedIntegration.push(instance);
        return resolve(this);
      }
      if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
        logger.debug("====max wait over====");
        this.failedToBeLoadedIntegration.push(instance);
        return resolve(this);
      }

      this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() => {
        return this.isInitialized(
          instance,
          time + INTEGRATION_LOAD_CHECK_INTERVAL
        ).then(resolve);
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
   *
   * @param {*} to
   * @param {*} from
   * @param {*} options
   * @param {*} callback
   */
  alias(to, from, options, callback) {
    if (typeof options == "function") (callback = options), (options = null);
    if (typeof from == "function")
      (callback = from), (options = null), (from = null);
    if (typeof from == "object") (options = from), (from = null);

    let rudderElement = new RudderElementBuilder().setType("alias").build();
    rudderElement.message.previousId =
      from || this.userId ? this.userId : this.getAnonymousId();
    rudderElement.message.userId = to;

    this.processAndSendDataToDestinations(
      "alias",
      rudderElement,
      options,
      callback
    );
  }

  /**
   *
   * @param {*} to
   * @param {*} from
   * @param {*} options
   * @param {*} callback
   */
  group(groupId, traits, options, callback) {
    if (!arguments.length) return;

    if (typeof options == "function") (callback = options), (options = null);
    if (typeof traits == "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof groupId == "object")
      (options = traits), (traits = groupId), (groupId = this.groupId);

    this.groupId = groupId;
    this.storage.setGroupId(this.groupId);

    let rudderElement = new RudderElementBuilder().setType("group").build();
    if (traits) {
      for (let key in traits) {
        this.groupTraits[key] = traits[key];
      }
    } else {
      this.groupTraits = {};
    }
    this.storage.setGroupTraits(this.groupTraits);

    this.processAndSendDataToDestinations(
      "group",
      rudderElement,
      options,
      callback
    );
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
      rudderElement["message"]["properties"] = this.getPageProperties(
        properties
      ); //properties;
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
    if (userId && this.userId && userId !== this.userId) {
      this.reset();
    }
    this.userId = userId;
    this.storage.setUserId(this.userId);

    let rudderElement = new RudderElementBuilder().setType("identify").build();
    if (traits) {
      for (let key in traits) {
        this.userTraits[key] = traits[key];
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
  identifyUser(rudderElement, options, callback) {
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
      this.userTraits = Object.assign(
        {},
        rudderElement["message"]["context"]["traits"]
      );
      this.storage.setUserTraits(this.userTraits);
    }

    this.processAndSendDataToDestinations(
      "identify",
      rudderElement,
      options,
      callback
    );
  }

  /**
   * Page call supporting rudderelement from builder
   *
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  trackPage(rudderElement, options, callback) {
    this.processAndSendDataToDestinations(
      "page",
      rudderElement,
      options,
      callback
    );
  }

  /**
   * Track call supporting rudderelement from builder
   *
   * @param {*} rudderElement
   * @param {*} callback
   * @memberof Analytics
   */
  trackEvent(rudderElement, options, callback) {
    this.processAndSendDataToDestinations(
      "track",
      rudderElement,
      options,
      callback
    );
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
    try {
      if (!this.anonymousId) {
        this.setAnonymousId();
      }

      // assign page properties to context
      rudderElement["message"]["context"]["page"] = getDefaultPageProperties();

      rudderElement["message"]["context"]["traits"] = Object.assign(
        {},
        this.userTraits
      );

      logger.debug("anonymousId: ", this.anonymousId);
      rudderElement["message"]["anonymousId"] = this.anonymousId;
      rudderElement["message"]["userId"] = rudderElement["message"]["userId"]
        ? rudderElement["message"]["userId"]
        : this.userId;

      if (type == "group") {
        if (this.groupId) {
          rudderElement["message"]["groupId"] = this.groupId;
        }
        if (this.groupTraits) {
          rudderElement["message"]["traits"] = Object.assign(
            {},
            this.groupTraits
          );
        }
      }

      if (options) {
        this.processOptionsParam(rudderElement, options);
      }
      logger.debug(JSON.stringify(rudderElement));

      var integrations = rudderElement.message.integrations;

      //try to first send to all integrations, if list populated from BE
      if (this.clientIntegrationObjects) {
        this.clientIntegrationObjects.forEach(obj => {
          logger.debug("called in normal flow");
          if (
            integrations[obj.name] ||
            (integrations[obj.name] == undefined && integrations["All"])
          ) {
            if (!obj["isFailed"] || !obj["isFailed"]()) {
              obj[type](rudderElement);
            }
          }
        });
      }
      if (!this.clientIntegrationObjects) {
        logger.debug("pushing in replay queue");
        //new event processing after analytics initialized  but integrations not fetched from BE
        this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
      }

      // self analytics process
      enqueue.call(this, rudderElement, type);

      logger.debug(type + " is called ");
      if (callback) {
        callback();
      }
    } catch (error) {
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
  processOptionsParam(rudderElement, options) {
    var toplevelElements = ["integrations", "anonymousId", "originalTimestamp"];
    for (let key in options) {
      if (toplevelElements.includes(key)) {
        rudderElement.message[key] = options[key];
        //special handle for ananymousId as transformation expects anonymousId in traits.
        /* if (key === "anonymousId") {
          rudderElement.message.context.traits["anonymousId"] = options[key];
        } */
      } else {
        if (key !== "context")
          rudderElement.message.context[key] = options[key];
        else {
          for (let k in options[key]) {
            rudderElement.message.context[k] = options[key][k];
          }
        }
      }
    }
  }

  getPageProperties(properties) {
    let defaultPageProperties = getDefaultPageProperties();
    for (let key in defaultPageProperties) {
      if (properties[key] === undefined) {
        properties[key] = defaultPageProperties[key];
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
    this.anonymousId = this.setAnonymousId();
    this.storage.clear();
  }

  getAnonymousId() {
    this.anonymousId = this.storage.getAnonymousId();
    if (!this.anonymousId) {
      this.setAnonymousId();
    }
    return this.anonymousId;
  }

  setAnonymousId(anonymousId) {
    this.anonymousId = anonymousId ? anonymousId : generateUUID();
    this.storage.setAnonymousId(this.anonymousId);
  }

  /**
   * Call control pane to get client configs
   *
   * @param {*} writeKey
   * @memberof Analytics
   */
  load(writeKey, serverUrl, options) {
    let configUrl = CONFIG_URL;
    if (!writeKey || !serverUrl || serverUrl.length == 0) {
      handleError({
        message: "Unable to load due to wrong writeKey or serverUrl"
      });
      throw Error("failed to initialize");
    }
    if (options && options.logLevel) {
      logger.setLogLevel(options.logLevel);
    }
    if (options && options.configUrl) {
      configUrl = options.configUrl;
    }
    if (options && options.useAutoTracking) {
      this.autoTrackFeatureEnabled = true;
      if (this.autoTrackFeatureEnabled && !this.autoTrackHandlersRegistered) {
        addDomEventHandlers(this);
        this.autoTrackHandlersRegistered = true;
        logger.debug(
          "autoTrackHandlersRegistered",
          this.autoTrackHandlersRegistered
        );
      }
    }
    if (
      options &&
      options.valTrackingList &&
      options.valTrackingList.push == Array.prototype.push
    ) {
      this.trackValues = options.valTrackingList;
    }
    logger.debug("inside load ");
    this.eventRepository.writeKey = writeKey;
    if (serverUrl) {
      this.eventRepository.url = serverUrl;
    }
    try {
      getJSONTrimmed(this, configUrl, writeKey, this.processResponse);
    } catch (error) {
      handleError(error);
      if (this.autoTrackFeatureEnabled && !this.autoTrackHandlersRegistered) {
        addDomEventHandlers(instance);
      }
    }
  }

  ready(callback) {
    if (typeof callback == "function") {
      this.readyCallback = callback;
      return;
    }
    logger.error("ready callback is not a function");
  }
}

if (process.browser) {
  window.addEventListener(
    "error",
    function(e) {
      handleError(e);
    },
    true
  );
}

let instance = new Analytics();

Emitter(instance);

if (process.browser) {
  let eventsPushedAlready =
    !!window.rudderanalytics &&
    window.rudderanalytics.push == Array.prototype.push;

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

let ready = instance.ready.bind(instance);
let identify = instance.identify.bind(instance);
let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let alias = instance.alias.bind(instance);
let group = instance.group.bind(instance);
let reset = instance.reset.bind(instance);
let load = instance.load.bind(instance);
let initialized = (instance.initialized = true);
let getAnonymousId = instance.getAnonymousId.bind(instance);
let setAnonymousId = instance.setAnonymousId.bind(instance);

export {
  initialized,
  ready,
  page,
  track,
  load,
  identify,
  reset,
  alias,
  group,
  getAnonymousId,
  setAnonymousId
};

/* eslint-disable new-cap */
/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable no-prototype-builtins */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-sequences */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import Emitter from "component-emitter";
import { parse } from "component-querystring";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import {
  getJSONTrimmed,
  generateUUID,
  handleError,
  getDefaultPageProperties,
  getUserProvidedConfigUrl,
  findAllEnabledDestinations,
  transformToRudderNames,
  transformToServerNames,
  checkReservedKeywords,
  getReferrer,
  getReferringDomain,
  removeTrailingSlashes,
} from "./utils/utils";
import {
  CONFIG_URL,
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
  DEST_SDK_BASE_URL,
  CDN_INT_DIR,
  INTG_SUFFIX,
} from "./utils/constants";
import RudderElementBuilder from "./utils/RudderElementBuilder";
import Storage from "./utils/storage";
import { EventRepository } from "./utils/EventRepository";
import logger from "./utils/logUtil";
import ScriptLoader from "./integrations/ScriptLoader";
import parseLinker from "./utils/linker";
import { configToIntNames } from "./utils/config_to_integration_names";

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
    this.initialized = false;
    this.areEventsReplayed = false;
    this.clientIntegrations = [];
    this.loadOnlyIntegrations = {};
    this.clientIntegrationObjects = undefined;
    this.successfullyLoadedIntegration = [];
    this.failedToBeLoadedIntegration = [];
    this.toBeProcessedArray = [];
    this.toBeProcessedByIntegrationArray = [];
    this.storage = Storage;
    this.eventRepository = EventRepository;
    this.sendAdblockPage = false;
    this.sendAdblockPageOptions = {};
    this.clientSuppliedCallbacks = {};
    this.readyCallback = () => {};
    this.methodToCallbackMapping = {
      syncPixel: "syncPixelCallback",
    };
    this.loaded = false;
    this.loadIntegration = true;
    this.dynamicallyLoadedIntegrations = {};
    this.destSDKBaseURL = DEST_SDK_BASE_URL;
  }

  /**
   * initialize the user after load config
   */
  initializeUser() {
    // save once for storing older values to encrypted
    this.userId = this.storage.getUserId() || "";
    this.storage.setUserId(this.userId);

    this.userTraits = this.storage.getUserTraits() || {};
    this.storage.setUserTraits(this.userTraits);

    this.groupId = this.storage.getGroupId() || "";
    this.storage.setGroupId(this.groupId);

    this.groupTraits = this.storage.getGroupTraits() || {};
    this.storage.setGroupTraits(this.groupTraits);

    this.anonymousId = this.getAnonymousId();
    this.storage.setAnonymousId(this.anonymousId);
  }

  setInitialPageProperties() {
    if (
      this.storage.getInitialReferrer() == null &&
      this.storage.getInitialReferringDomain() == null
    ) {
      const initialReferrer = getReferrer();
      this.storage.setInitialReferrer(initialReferrer);
      this.storage.setInitialReferringDomain(
        getReferringDomain(initialReferrer)
      );
    }
  }

  allModulesInitialized(time = 0) {
    return new Promise((resolve) => {
      if (
        this.clientIntegrations.every(
          (intg) =>
            this.dynamicallyLoadedIntegrations[
              `${configToIntNames[intg.name]}${INTG_SUFFIX}`
            ] != undefined
        )
      ) {
        // logger.debug(
        //   "All integrations loaded dynamically",
        //   this.dynamicallyLoadedIntegrations
        // );
        return resolve(this);
      }
      if (time >= 2 * MAX_WAIT_FOR_INTEGRATION_LOAD) {
        // logger.debug("Max wait for dynamically loaded integrations over")
        return resolve(this);
      }

      return this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() => {
        // logger.debug("Check if all integration SDKs are loaded after pause")
        return this.allModulesInitialized(
          time + INTEGRATION_LOAD_CHECK_INTERVAL
        ).then(resolve);
      });
    });
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
      // logger.debug(`===in process response=== ${status}`)
      if (typeof response === "string") {
        response = JSON.parse(response);
      }

      response.source.destinations.forEach(function (destination, index) {
        // logger.debug(
        //   `Destination ${index} Enabled? ${destination.enabled} Type: ${destination.destinationDefinition.name} Use Native SDK? true`
        // );
        if (destination.enabled) {
          this.clientIntegrations.push({
            name: destination.destinationDefinition.name,
            config: destination.config,
          });
        }
      }, this);

      // intersection of config-plane native sdk destinations with sdk load time destination list
      this.clientIntegrations = findAllEnabledDestinations(
        this.loadOnlyIntegrations,
        this.clientIntegrations
      );

      // logger.debug("this.clientIntegrations: ", this.clientIntegrations)
      // Load all the client integrations dynamically
      this.clientIntegrations.forEach((intg) => {
        const modName = configToIntNames[intg.name];
        const scriptName = `${modName}${INTG_SUFFIX}`;
        if (process.browser) {
          const modURL = `${this.destSDKBaseURL}/${modName}.min.js`;
          if (!window.hasOwnProperty(scriptName)) {
            ScriptLoader(scriptName, modURL);
          }

          const self = this;
          const interval = setInterval(function () {
            if (window.hasOwnProperty(scriptName)) {
              const intMod = window[scriptName];
              clearInterval(interval);

              // logger.debug(scriptName, " dynamically loaded integration SDK")

              let intgInstance;
              try {
                // logger.debug(
                //   scriptName,
                //   " [Analytics] processResponse :: trying to initialize integration ::"
                // );
                intgInstance = new intMod[scriptName](intg.config, self);
                intgInstance.init();

                // logger.debug(scriptName, " initializing destination")

                self.isInitialized(intgInstance).then(() => {
                  // logger.debug(scriptName, " module init sequence complete")
                  self.dynamicallyLoadedIntegrations[scriptName] =
                    intMod[scriptName];
                });
              } catch (e) {
                logger.error(
                  scriptName,
                  " [Analytics] initialize integration (integration.init()) failed",
                  e
                );
                self.failedToBeLoadedIntegration.push(intgInstance);
              }
            }
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
          }, MAX_WAIT_FOR_INTEGRATION_LOAD);
        } else {
          // npm package specific logic goes here
        }
      });

      const self = this;
      this.allModulesInitialized().then(() => {
        // remove from the list which don't have support yet in SDK
        self.clientIntegrations = self.clientIntegrations.filter((intg) => {
          return (
            self.dynamicallyLoadedIntegrations[
              `${configToIntNames[intg.name]}${INTG_SUFFIX}`
            ] != undefined
          );
        });

        if (!self.clientIntegrations || self.clientIntegrations.length == 0) {
          if (self.readyCallback) {
            self.readyCallback();
          }
          self.toBeProcessedByIntegrationArray = [];
          return;
        }

        self.replayEvents(self);
      });
    } catch (error) {
      handleError(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  replayEvents(object) {
    if (
      object.successfullyLoadedIntegration.length +
        object.failedToBeLoadedIntegration.length ===
        object.clientIntegrations.length &&
      !object.areEventsReplayed
    ) {
      // logger.debug(
      //   "===replay events called====",
      //   " successfully loaded count: ",
      //   object.successfullyLoadedIntegration.length,
      //   " failed loaded count: ",
      //   object.failedToBeLoadedIntegration.length
      // );
      // eslint-disable-next-line no-param-reassign
      object.clientIntegrationObjects = [];
      // eslint-disable-next-line no-param-reassign
      object.clientIntegrationObjects = object.successfullyLoadedIntegration;

      // logger.debug(
      //   "==registering after callback===",
      //   " after to be called after count : ",
      //   object.clientIntegrationObjects.length
      // );

      if (
        object.clientIntegrationObjects.every(
          (intg) => !intg.isReady || intg.isReady()
        )
      ) {
        object.readyCallback();
      }

      // send the queued events to the fetched integration
      object.toBeProcessedByIntegrationArray.forEach((event) => {
        const methodName = event[0];
        event.shift();

        // convert common names to sdk identified name
        if (Object.keys(event[0].message.integrations).length > 0) {
          transformToRudderNames(event[0].message.integrations);
        }

        // if not specified at event level, All: true is default
        const clientSuppliedIntegrations = event[0].message.integrations;

        // get intersection between config plane native enabled destinations
        // (which were able to successfully load on the page) vs user supplied integrations
        const succesfulLoadedIntersectClientSuppliedIntegrations =
          findAllEnabledDestinations(
            clientSuppliedIntegrations,
            object.clientIntegrationObjects
          );

        // send to all integrations now from the 'toBeProcessedByIntegrationArray' replay queue
        for (
          let i = 0;
          i < succesfulLoadedIntersectClientSuppliedIntegrations.length;
          i += 1
        ) {
          try {
            if (
              !succesfulLoadedIntersectClientSuppliedIntegrations[i].isFailed ||
              !succesfulLoadedIntersectClientSuppliedIntegrations[i].isFailed()
            ) {
              if (
                succesfulLoadedIntersectClientSuppliedIntegrations[i][
                  methodName
                ]
              ) {
                const clonedBufferEvent = cloneDeep(event);
                succesfulLoadedIntersectClientSuppliedIntegrations[i][
                  methodName
                ](...clonedBufferEvent);
              }
            }
          } catch (error) {
            handleError(error);
          }
        }
      });
      object.toBeProcessedByIntegrationArray = [];
      object.areEventsReplayed = true;
    }
  }

  pause(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  isInitialized(instance, time = 0) {
    return new Promise((resolve) => {
      if (instance.isLoaded()) {
        // logger.debug("===integration loaded successfully====", instance.name)
        this.successfullyLoadedIntegration.push(instance);
        return resolve(this);
      }
      if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
        // logger.debug("====max wait over====")
        this.failedToBeLoadedIntegration.push(instance);
        return resolve(this);
      }

      return this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() => {
        // logger.debug("====after pause, again checking====")
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
    if (!this.loaded) return;
    if (typeof options === "function") (callback = options), (options = null);
    if (typeof properties === "function")
      (callback = properties), (options = properties = null);
    if (typeof name === "function")
      (callback = name), (options = properties = name = null);
    if (
      typeof category === "object" &&
      category != null &&
      category != undefined
    )
      (options = name), (properties = category), (name = category = null);
    if (typeof name === "object" && name != null && name != undefined)
      (options = properties), (properties = name), (name = null);
    if (typeof category === "string" && typeof name !== "string")
      (name = category), (category = null);
    if (this.sendAdblockPage && category != "RudderJS-Initiated") {
      this.sendSampleRequest();
    }

    const rudderElement = new RudderElementBuilder().setType("page").build();
    if (!properties) {
      properties = {};
    }
    if (name) {
      rudderElement.message.name = properties.name = name;
    }
    if (category) {
      rudderElement.message.category = properties.category = category;
    }
    rudderElement.message.properties = this.getPageProperties(properties);

    this.processAndSendDataToDestinations(
      "page",
      rudderElement,
      options,
      callback
    );
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
    if (!this.loaded) return;
    if (typeof options === "function") (callback = options), (options = null);
    if (typeof properties === "function")
      (callback = properties), (options = null), (properties = null);

    const rudderElement = new RudderElementBuilder().setType("track").build();
    if (event) {
      rudderElement.setEventName(event);
    }
    rudderElement.setProperty(properties || {});

    this.processAndSendDataToDestinations(
      "track",
      rudderElement,
      options,
      callback
    );
  }

  /**
   * Process identify params and forward to identify  call
   *
   * @param {*} userId
   * @param {*} traits
   * @param {*} options
   * @param {*} callback
   * @memberof Analytics
   */
  identify(userId, traits, options, callback) {
    if (!this.loaded) return;
    if (typeof options === "function") (callback = options), (options = null);
    if (typeof traits === "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof userId === "object")
      (options = traits), (traits = userId), (userId = this.userId);

    if (userId && this.userId && userId !== this.userId) {
      this.reset();
    }
    this.userId = userId;
    this.storage.setUserId(this.userId);

    if (traits) {
      for (const key in traits) {
        this.userTraits[key] = traits[key];
      }
      this.storage.setUserTraits(this.userTraits);
    }
    const rudderElement = new RudderElementBuilder()
      .setType("identify")
      .build();

    this.processAndSendDataToDestinations(
      "identify",
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
  alias(to, from, options, callback) {
    if (!this.loaded) return;
    if (typeof options === "function") (callback = options), (options = null);
    if (typeof from === "function")
      (callback = from), (options = null), (from = null);
    if (typeof from === "object") (options = from), (from = null);

    const rudderElement = new RudderElementBuilder().setType("alias").build();
    rudderElement.message.previousId =
      from || (this.userId ? this.userId : this.getAnonymousId());
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
    if (!this.loaded) return;
    if (!arguments.length) return;

    if (typeof options === "function") (callback = options), (options = null);
    if (typeof traits === "function")
      (callback = traits), (options = null), (traits = null);
    if (typeof groupId === "object")
      (options = traits), (traits = groupId), (groupId = this.groupId);

    this.groupId = groupId;
    this.storage.setGroupId(this.groupId);

    const rudderElement = new RudderElementBuilder().setType("group").build();
    if (traits) {
      for (const key in traits) {
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
      // rudderElement.message.context.page = getDefaultPageProperties();

      rudderElement.message.context.traits = {
        ...this.userTraits,
      };

      // logger.debug("anonymousId: ", this.anonymousId)
      rudderElement.message.anonymousId = this.anonymousId;
      rudderElement.message.userId = rudderElement.message.userId
        ? rudderElement.message.userId
        : this.userId;

      if (type == "group") {
        if (this.groupId) {
          rudderElement.message.groupId = this.groupId;
        }
        if (this.groupTraits) {
          rudderElement.message.traits = {
            ...this.groupTraits,
          };
        }
      }

      this.processOptionsParam(rudderElement, options);
      // logger.debug(JSON.stringify(rudderElement))

      // check for reserved keys and log
      checkReservedKeywords(rudderElement.message, type);

      // structure user supplied integrations object to rudder format
      transformToRudderNames(rudderElement.message.integrations);

      // config plane native enabled destinations, still not completely loaded
      // in the page, add the events to a queue and process later
      if (!this.clientIntegrationObjects) {
        // logger.debug("pushing in replay queue")
        // new event processing after analytics initialized  but integrations not fetched from BE
        this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
      } else {
        // if not specified at event level, All: true is default
        const clientSuppliedIntegrations = rudderElement.message.integrations;

        // get intersection between config plane native enabled destinations
        // (which were able to successfully load on the page) vs user supplied integrations
        const succesfulLoadedIntersectClientSuppliedIntegrations =
          findAllEnabledDestinations(
            clientSuppliedIntegrations,
            this.clientIntegrationObjects
          );

        // try to first send to all integrations, if list populated from BE
        try {
          succesfulLoadedIntersectClientSuppliedIntegrations.forEach((obj) => {
            if (!obj.isFailed || !obj.isFailed()) {
              if (obj[type]) {
                const clonedRudderElement = cloneDeep(rudderElement);
                obj[type](clonedRudderElement);
              }
            }
          });
        } catch (err) {
          handleError({ message: `[sendToNative]:${err}` });
        }
      }

      // convert integrations object to server identified names, kind of hack now!
      transformToServerNames(rudderElement.message.integrations);

      // self analytics process, send to rudder
      this.eventRepository.enqueue(rudderElement, type);

      // logger.debug(`${type} is called `)
      if (callback) {
        callback();
      }
    } catch (error) {
      handleError(error);
    }
  }

  utm(query) {
    // Remove leading ? if present
    if (query.charAt(0) === "?") {
      query = query.substring(1);
    }

    query = query.replace(/\?/g, "&");

    let param;
    const params = parse(query);
    const results = {};

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        if (key.substr(0, 4) === "utm_") {
          param = key.substr(4);
          if (param === "campaign") param = "name";
          results[param] = params[key];
        }
      }
    }

    return results;
  }

  /**
   * add campaign parsed details under context
   * @param {*} rudderElement
   */
  addCampaignInfo(rudderElement) {
    const msgContext = rudderElement.message.context;
    if (msgContext && typeof msgContext === "object") {
      const { search } = getDefaultPageProperties();
      rudderElement.message.context.campaign = this.utm(search);
    }
  }

  /**
   * process options parameter
   * Apart from top level keys merge everything under context
   * context.page's default properties are overridden by same keys of
   * provided properties in case of page call
   *
   * @param {*} rudderElement
   * @param {*} options
   * @memberof Analytics
   */
  processOptionsParam(rudderElement, options) {
    const { type, properties } = rudderElement.message;

    this.addCampaignInfo(rudderElement);

    // assign page properties to context.page
    rudderElement.message.context.page = this.getContextPageProperties(
      type === "page" ? properties : undefined
    );

    const topLevelElements = [
      "integrations",
      "anonymousId",
      "originalTimestamp",
    ];
    for (const key in options) {
      if (topLevelElements.includes(key)) {
        rudderElement.message[key] = options[key];
      } else if (key !== "context") {
        rudderElement.message.context = merge(rudderElement.message.context, {
          [key]: options[key],
        });
      } else if (typeof options[key] === "object" && options[key] != null) {
        rudderElement.message.context = merge(rudderElement.message.context, {
          ...options[key],
        });
      } else {
        logger.error(
          "[Analytics: processOptionsParam] context passed in options is not object"
        );
      }
    }
  }

  getPageProperties(properties, options) {
    const defaultPageProperties = getDefaultPageProperties();
    const optionPageProperties = (options && options.page) || {};
    for (const key in defaultPageProperties) {
      if (properties[key] === undefined) {
        properties[key] =
          optionPageProperties[key] || defaultPageProperties[key];
      }
    }
    return properties;
  }

  // Assign page properties to context.page if the same property is not provided under context.page
  getContextPageProperties(properties) {
    const defaultPageProperties = getDefaultPageProperties();
    const contextPageProperties = {};
    for (const key in defaultPageProperties) {
      contextPageProperties[key] =
        properties && properties[key]
          ? properties[key]
          : defaultPageProperties[key];
    }
    return contextPageProperties;
  }

  /**
   * Clear user information
   *
   * @memberof Analytics
   */
  reset(flag) {
    if (!this.loaded) return;
    if (flag) {
      this.anonymousId = "";
    }
    this.userId = "";
    this.userTraits = {};
    this.groupId = "";
    this.groupTraits = {};
    this.storage.clear(flag);
  }

  getAnonymousId() {
    // if (!this.loaded) return;
    this.anonymousId = this.storage.getAnonymousId();
    if (!this.anonymousId) {
      this.setAnonymousId();
    }
    return this.anonymousId;
  }

  getUserTraits() {
    return this.userTraits;
  }

  /**
   * Sets anonymous id in the following precedence:
   * 1. anonymousId: Id directly provided to the function.
   * 2. rudderAmpLinkerParm: value generated from linker query parm (rudderstack)
   *    using praseLinker util.
   * 3. generateUUID: A new unique id is generated and assigned.
   *
   * @param {string} anonymousId
   * @param {string} rudderAmpLinkerParm
   */
  setAnonymousId(anonymousId, rudderAmpLinkerParm) {
    // if (!this.loaded) return;
    const parsedAnonymousIdObj = rudderAmpLinkerParm
      ? parseLinker(rudderAmpLinkerParm)
      : null;
    const parsedAnonymousId = parsedAnonymousIdObj
      ? parsedAnonymousIdObj.rs_amp_id
      : null;
    this.anonymousId = anonymousId || parsedAnonymousId || generateUUID();
    this.storage.setAnonymousId(this.anonymousId);
  }

  isValidWriteKey(writeKey) {
    if (
      !writeKey ||
      typeof writeKey !== "string" ||
      writeKey.trim().length == 0
    ) {
      return false;
    }
    return true;
  }

  isValidServerUrl(serverUrl) {
    if (
      !serverUrl ||
      typeof serverUrl !== "string" ||
      serverUrl.trim().length == 0
    ) {
      return false;
    }
    return true;
  }

  /**
   * Call control pane to get client configs
   *
   * @param {*} writeKey
   * @memberof Analytics
   */
  load(writeKey, serverUrl, options) {
    // logger.debug("inside load ")
    if (this.loaded) return;
    if (!this.isValidWriteKey(writeKey) || !this.isValidServerUrl(serverUrl)) {
      handleError({
        message:
          "[Analytics] load:: Unable to load due to invalid writeKey or serverUrl",
      });
      throw Error("failed to initialize");
    }

    if (options && options.logLevel) {
      logger.setLogLevel(options.logLevel);
    }
    if (options && options.setCookieDomain) {
      this.storage.options({ domain: options.setCookieDomain });
    }
    if (options && options.integrations) {
      Object.assign(this.loadOnlyIntegrations, options.integrations);
      transformToRudderNames(this.loadOnlyIntegrations);
    }

    if (options && options.sendAdblockPage) {
      this.sendAdblockPage = true;
    }
    if (
      options &&
      options.sendAdblockPageOptions &&
      typeof options.sendAdblockPageOptions === "object"
    ) {
      this.sendAdblockPageOptions = options.sendAdblockPageOptions;
    }
    if (options && options.clientSuppliedCallbacks) {
      // convert to rudder recognized method names
      const transformedCallbackMapping = {};
      Object.keys(this.methodToCallbackMapping).forEach((methodName) => {
        if (this.methodToCallbackMapping.hasOwnProperty(methodName)) {
          if (
            options.clientSuppliedCallbacks[
              this.methodToCallbackMapping[methodName]
            ]
          ) {
            transformedCallbackMapping[methodName] =
              options.clientSuppliedCallbacks[
                this.methodToCallbackMapping[methodName]
              ];
          }
        }
      });
      Object.assign(this.clientSuppliedCallbacks, transformedCallbackMapping);
      this.registerCallbacks(true);
    }

    this.eventRepository.url = serverUrl;
    this.eventRepository.writeKey = writeKey;
    if (
      options &&
      options.queueOptions &&
      options.queueOptions != null &&
      typeof options.queueOptions === "object"
    ) {
      this.eventRepository.startQueue(options.queueOptions);
    } else {
      this.eventRepository.startQueue({});
    }

    if (options && options.loadIntegration != undefined) {
      this.loadIntegration = !!options.loadIntegration;
    }

    this.initializeUser();
    this.setInitialPageProperties();
    this.loaded = true;

    function errorHandler(error) {
      handleError(error);
    }

    if (options && options.destSDKBaseURL) {
      this.destSDKBaseURL = removeTrailingSlashes(options.destSDKBaseURL);
      if (!this.destSDKBaseURL) {
        handleError({
          message: "[Analytics] load:: CDN base URL is not valid",
        });
        throw Error("failed to load");
      }
    } else {
      // Get the CDN base URL from the included 'rudder-analytics.min.js' script tag
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i += 1) {
        const curScriptSrc = removeTrailingSlashes(
          scripts[i].getAttribute("src")
        );
        if (
          curScriptSrc &&
          curScriptSrc.startsWith("http") &&
          curScriptSrc.endsWith("rudder-analytics.min.js")
        ) {
          this.destSDKBaseURL = curScriptSrc
            .split("/")
            .slice(0, -1)
            .concat(CDN_INT_DIR)
            .join("/");
          break;
        }
      }
    }

    if (options && options.getSourceConfig) {
      if (typeof options.getSourceConfig !== "function") {
        handleError('option "getSourceConfig" must be a function');
      } else {
        const res = options.getSourceConfig();

        if (res instanceof Promise) {
          res
            .then((pRes) => this.processResponse(200, pRes))
            .catch(errorHandler);
        } else {
          this.processResponse(200, res);
        }
      }
      return;
    }

    let configUrl = CONFIG_URL;
    if (options && options.configUrl) {
      configUrl = getUserProvidedConfigUrl(options.configUrl);
    }

    try {
      getJSONTrimmed(this, configUrl, writeKey, this.processResponse);
    } catch (error) {
      errorHandler(error);
    }
  }

  ready(callback) {
    if (!this.loaded) return;
    if (typeof callback === "function") {
      this.readyCallback = callback;
      return;
    }
    logger.error("ready callback is not a function");
  }

  initializeCallbacks() {
    Object.keys(this.methodToCallbackMapping).forEach((methodName) => {
      if (this.methodToCallbackMapping.hasOwnProperty(methodName)) {
        this.on(methodName, () => {});
      }
    });
  }

  registerCallbacks(calledFromLoad) {
    if (!calledFromLoad) {
      Object.keys(this.methodToCallbackMapping).forEach((methodName) => {
        if (this.methodToCallbackMapping.hasOwnProperty(methodName)) {
          if (window.rudderanalytics) {
            if (
              typeof window.rudderanalytics[
                this.methodToCallbackMapping[methodName]
              ] === "function"
            ) {
              this.clientSuppliedCallbacks[methodName] =
                window.rudderanalytics[
                  this.methodToCallbackMapping[methodName]
                ];
            }
          }
          // let callback =
          //   ? typeof window.rudderanalytics[
          //       this.methodToCallbackMapping[methodName]
          //     ] == "function"
          //     ? window.rudderanalytics[this.methodToCallbackMapping[methodName]]
          //     : () => {}
          //   : () => {};

          // logger.debug("registerCallbacks", methodName, callback);

          // this.on(methodName, callback);
        }
      });
    }

    Object.keys(this.clientSuppliedCallbacks).forEach((methodName) => {
      if (this.clientSuppliedCallbacks.hasOwnProperty(methodName)) {
        // logger.debug(
        //   "registerCallbacks",
        //   methodName,
        //   this.clientSuppliedCallbacks[methodName]
        // );
        this.on(methodName, this.clientSuppliedCallbacks[methodName]);
      }
    });
  }

  sendSampleRequest() {
    ScriptLoader(
      "ad-block",
      "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    );
  }
}

const instance = new Analytics();

function processDataInAnalyticsArray(analytics) {
  analytics.toBeProcessedArray.forEach((x) => {
    var event = [...x];
    const method = event[0];
    event.shift();
    // logger.debug("=====from analytics array, calling method:: ", method)
    analytics[method](...event);
  });

  instance.toBeProcessedArray = [];
}

/**
 * parse the given query string into usable Rudder object
 * @param {*} query
 */
function parseQueryString(query) {
  const queryDefaults = {
    trait: "ajs_trait_",
    prop: "ajs_prop_",
  };

  function getDataFromQueryObj(qObj, dataType) {
    const data = {};
    Object.keys(qObj).forEach((key) => {
      if (key.startsWith(dataType)) {
        data[key.substr(dataType.length)] = qObj[key];
      }
    });
    return data;
  }

  const queryObject = parse(query);
  if (queryObject.ajs_aid) {
    instance.toBeProcessedArray.push(["setAnonymousId", queryObject.ajs_aid]);
  }

  if (queryObject.ajs_uid) {
    instance.toBeProcessedArray.push([
      "identify",
      queryObject.ajs_uid,
      getDataFromQueryObj(queryObject, queryDefaults.trait),
    ]);
  }

  if (queryObject.ajs_event) {
    instance.toBeProcessedArray.push([
      "track",
      queryObject.ajs_event,
      getDataFromQueryObj(queryObject, queryDefaults.prop),
    ]);
  }
}

Emitter(instance);

window.addEventListener(
  "error",
  (e) => {
    handleError(e, instance);
  },
  true
);

// initialize supported callbacks
instance.initializeCallbacks();

// register supported callbacks
instance.registerCallbacks(false);

const defaultMethod = "load";
const argumentsArray = window.rudderanalytics || [];

// Skip all the methods queued prior to the 'defaultMethod'
while (argumentsArray.length > 0) {
  if (argumentsArray[0][0] === defaultMethod) {
    instance.toBeProcessedArray.push(argumentsArray[0]);
    argumentsArray.shift();
    break;
  }
  argumentsArray.shift();
}

// parse querystring of the page url to send events
parseQueryString(window.location.search);

argumentsArray.forEach((x) => instance.toBeProcessedArray.push(x));

processDataInAnalyticsArray(instance);

const ready = instance.ready.bind(instance);
const identify = instance.identify.bind(instance);
const page = instance.page.bind(instance);
const track = instance.track.bind(instance);
const alias = instance.alias.bind(instance);
const group = instance.group.bind(instance);
const reset = instance.reset.bind(instance);
const load = instance.load.bind(instance);
const initialized = (instance.initialized = true);
const getUserTraits = instance.getUserTraits.bind(instance);
const getAnonymousId = instance.getAnonymousId.bind(instance);
const setAnonymousId = instance.setAnonymousId.bind(instance);

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
  getUserTraits,
  getAnonymousId,
  setAnonymousId,
};

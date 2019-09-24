//  <copyright file="RudderClient.js" company="Rudder Labs">
//   Copyright (c) 2019 Rudder Labs All rights reserved.
//  -----------------------------------------------------------------------
//  </copyright>
//  <author>Rudder Labs</author>
//  -----------------------------------------------------------------------

"use strict";

var MessageType = require("./utils.constants.js").MessageType;
var ECommerceParamNames = require("./utils.constants.js").ECommerceParamNames;
var ECommerceEvents = require("./utils.constants.js").ECommerceEvents;
var RudderIntegrationPlatform = require("./utils.constants.js")
  .RudderIntegrationPlatform;
var BASE_URL = require("./utils.constants.js").BASE_URL;
var CONFIG_URL = require("./utils.constants.js").CONFIG_URL;
var FLUSH_QUEUE_SIZE = require("./utils.constants.js").FLUSH_QUEUE_SIZE;

var replacer = require("./utils.utils.js").replacer;
var generateUUID = require("./utils.utils.js").generateUUID;
var getCurrentTimeFormatted = require("./utils.utils.js")
  .getCurrentTimeFormatted;
var getJSON = require("./utils.utils.js").getJSON;
var RudderConfig = require("./utils.RudderConfig.js");
var AnalyticsManager = require("./utils.AnalyticsManager.js");
var EventRepository = require("./utils.EventRepository.js");
var RudderPayload = require("./utils.RudderPayload.js");
var RudderElement = require("./utils.RudderElement.js");
var RudderElementBuilder = require("./utils.RudderElementBuilder.js");
var RudderMessage = require("./utils.RudderMessage.js");
var RudderContext = require("./utils.RudderContext.js");
var RudderApp = require("./utils.RudderApp.js");
var RudderTraits = require("./utils.RudderTraits.js").RudderTraits;
var TraitsAddress = require("./utils.RudderTraits.js").TraitsAddress;
var TraitsCompany = require("./utils.RudderTraits.js").TraitsCompany;
var RudderLibraryInfo = require("./utils.RudderInfo.js").RudderLibraryInfo;

//Singleton implementation of the core SDK client class
var RudderClient = (function() {
  //Instance stores a reference to the Singleton
  var instance;

  //Private variables and methods
  //Rudder config
  var rudderConfig;

  //Event repository
  var eventRepository;

  var wrappers = [];

  //Track function
  //TO-DO: Add code for target-provided SDK integrations when implemented
  function track(rudderElement) {
    if (rudderElement.rl_message) {
      //process only if valid message is there
      rudderElement.rl_message.validateFor(MessageType.TRACK);
      //validated, now set event type and add to flush queue
      rudderElement.rl_message.rl_type = MessageType.TRACK;
      //check if rl_category is populated under rl_properties,
      //else use the rl_event value
      if (!rudderElement.rl_message.rl_properties["rl_category"]) {
        rudderElement.rl_message.rl_properties["rl_category"] =
          rudderElement.rl_message.rl_event;
      }
      eventRepository.flush(rudderElement);
      console.log(wrappers);
      wrappers.forEach(analyticsManager => {
        analyticsManager.track(rudderElement);
      });
    }
  }

  //Page function
  //TO-DO: Add code for target-provided SDK integrations when implemented
  function page(rudderElement) {
    if (rudderElement.rl_message) {
      //process only if valid message is there
      rudderElement.rl_message.validateFor(MessageType.PAGE);
      //validated, now set event type and add to flush queue
      rudderElement.rl_message.rl_type = MessageType.PAGE;
      eventRepository.flush(rudderElement);
      console.log(wrappers);
      wrappers.forEach(analyticsManager => {
        analyticsManager.page(rudderElement);
      });
    }
  }

  //Screen call removed as it does not make sense in a web SDK

  //Identify function
  //TO-DO: Add code for target-provided SDK integrations when implemented
  function identify(rudderTraits) {
    var rudderElement = new RudderElementBuilder()
      .setEvent(MessageType.IDENTIFY)
      .setUserId(rudderTraits.rl_id)
      .build();
    rudderElement.updateTraits(rudderTraits);
    rudderElement.setType(MessageType.IDENTIFY);
    eventRepository.flush(rudderElement);
    console.log(wrappers);
    wrappers.forEach(analyticsManager => {
      analyticsManager.identify(rudderElement);
    });
  }

  function init() {
    //Public variables and methods
    return {
      track: track,
      page: page,
      //screen: screen,
      identify: identify
    };
  }

  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function(writeKey, rudderConfig) {
      if (!instance) {
        //Check that valid input object instances have been provided for creating
        //RudderClient instance

        if (!writeKey || 0 === writeKey.length) {
          throw new Error("writeKey cannot be null or empty");
        }

        if (!rudderConfig) {
          throw new Error("rudderConfig cannot be null");
        }
        instance = init();
        //Initialize
        eventRepository = new EventRepository(writeKey, rudderConfig, wrappers);

        this.rudderConfig = rudderConfig;
        return instance;
      }
      return instance;
    }
  };
})();

window.RudderClient = RudderClient;
window.RudderConfig = RudderConfig;

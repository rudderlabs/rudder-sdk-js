//  <copyright file="RudderClient.js" company="Rudder Labs">
//   Copyright (c) 2019 Rudder Labs All rights reserved.
//  -----------------------------------------------------------------------
//  </copyright>
//  <author>Rudder Labs</author>
//  -----------------------------------------------------------------------

"use strict";

var MessageType = require("./analytics/utils/constants.js.js").MessageType;
var ECommerceParamNames = require("./analytics/utils/constants.js.js")
  .ECommerceParamNames;
var ECommerceEvents = require("./analytics/utils/constants.js.js")
  .ECommerceEvents;
var RudderIntegrationPlatform = require("./analytics/utils/constants.js.js")
  .RudderIntegrationPlatform;
var BASE_URL = require("./analytics/utils/constants.js.js").BASE_URL;
var CONFIG_URL = require("./analytics/utils/constants.js.js").CONFIG_URL;
var FLUSH_QUEUE_SIZE = require("./analytics/utils/constants.js.js")
  .FLUSH_QUEUE_SIZE;

var replacer = require("./analytics/utils/utils.js.js").replacer;
var generateUUID = require("./analytics/utils/utils.js.js").generateUUID;
var getCurrentTimeFormatted = require("./analytics/utils/utils.js.js")
  .getCurrentTimeFormatted;
var getJSON = require("./analytics/utils/utils.js.js").getJSON;
var RudderConfig = require("./analytics/utils/RudderConfig.js.js").RudderConfig;
var AnalyticsManager = require("./analytics/utils/AnalyticsManager.js.js");
var EventRepository = require("./analytics/utils/EventRepository.js.js")
  .EventRepository;
var RudderPayload = require("./analytics/utils/RudderPayload.js");
var RudderElement = require("./analytics/utils/RudderElement.js.js");
var RudderElementBuilder = require("./analytics/utils/RudderElementBuilder.js.js")
  .RudderElementBuilder;
var RudderMessage = require("./analytics/utils/RudderMessage.js.js");
var RudderContext = require("./analytics/utils/RudderContext.js.js");
var RudderApp = require("./analytics/utils/RudderApp.js.js");
var RudderTraits = require("./analytics/utils/RudderTraits.js.js").RudderTraits;
var TraitsAddress = require("./analytics/utils/RudderTraits.js.js")
  .TraitsAddress;
var TraitsCompany = require("./analytics/utils/RudderTraits.js.js")
  .TraitsCompany;
var RudderLibraryInfo = require("./analytics/utils/RudderInfo.js.js")
  .RudderLibraryInfo;

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
    getInstance: function(writeKey) {
      if (!instance) {
        //Check that valid input object instances have been provided for creating
        //RudderClient instance
        console.log(RudderConfig);
        var rudderConfig = new RudderConfig()
          .getDefaultConfig()
          .setFlushQueueSize(1);

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
window.RudderTraits = RudderTraits;

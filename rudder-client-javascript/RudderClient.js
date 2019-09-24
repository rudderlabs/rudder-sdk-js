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

//Context class
class RudderContext {
  constructor() {
    this.rl_app = new RudderApp();
    this.rl_traits = null;
    this.rl_library = new RudderLibraryInfo();
    //this.rl_os = null;
    var os = new RudderOSInfo();
    os.rl_version = ""; //skipping version for simplicity now
    var screen = new RudderScreenInfo();

    //Depending on environment within which the code is executing, screen
    //dimensions can be set
    //User agent and locale can be retrieved only for browser
    //For server-side integration, same needs to be set by calling program
    if (typeof window === "undefined") {
      //server-side integration
      screen.rl_width = 0;
      screen.rl_height = 0;
      screen.rl_density = 0;
      os.rl_version = "";
      os.rl_name = "";
      this.rl_user_agent = null;
      this.rl_locale = null;
    } else {
      //running within browser
      screen.rl_width = window.width;
      screen.rl_height = window.height;
      screen.rl_density = window.devicePixelRatio;
      this.rl_user_agent = navigator.userAgent;
      //property name differs based on browser version
      this.rl_locale = navigator.language || navigator.browserLanguage;
    }

    this.screen = screen;
    this.rl_device = null;
    this.rl_network = null;
  }
}

//Application class
class RudderApp {
  constructor() {
    this.rl_build = "1.0.0";
    this.rl_name = "RudderLabs JavaScript SDK";
    this.rl_namespace = "com.rudderlabs.javascript";
    this.rl_version = "1.0.0";
  }
}

//Traits class
class RudderTraits {
  constructor() {
    this.rl_address = null;
    this.rl_age = null;
    this.rl_birthday = null;
    this.rl_company = null;
    this.rl_createdat = null;
    this.rl_description = null;
    this.rl_email = null;
    this.rl_firstname = null;
    this.rl_gender = null;
    this.rl_id = null;
    this.rl_lastname = null;
    this.rl_name = null;
    this.rl_phone = null;
    this.rl_title = null;
    this.rl_username = null;
  }

  //Setter methods to aid Builder pattern
  setAddress(address) {
    this.rl_address = address;
    return this;
  }

  setAge(age) {
    this.rl_age = age;
    return this;
  }

  setBirthday(birthday) {
    this.rl_birthday = birthday;
    return this;
  }

  setCompany(company) {
    this.rl_company = company;
    return this;
  }

  setCreatedAt(createAt) {
    this.rl_createdat = createAt;
    return this;
  }

  setDescription(description) {
    this.rl_description = description;
    return this;
  }

  setEmail(email) {
    this.rl_email = email;
    return this;
  }

  setFirstname(firstname) {
    this.rl_firstname = firstname;
    return this;
  }

  setId(id) {
    this.rl_id = id;
    return this;
  }

  setLastname(lastname) {
    this.rl_lastname = lastname;
    return this;
  }

  setName(name) {
    this.rl_name = name;
    return this;
  }

  setPhone(phone) {
    this.rl_phone = phone;
    return this;
  }

  setTitle(title) {
    this.rl_title = title;
    return this;
  }

  setUsername(username) {
    this.rl_username = username;
    return this;
  }
}

//Class for Address to be embedded in Traits
class TraitsAddress {
  constructor() {
    this.rl_city = "";
    this.rl_country = "";
    this.rl_postalcode = "";
    this.rl_state = "";
    this.rl_street = "";
  }
}

//Class for Company to be embedded in Traits
class TraitsCompany {
  constructor() {
    this.rl_name = "";
    this.rl_id = "";
    this.rl_industry = "";
  }
}

//Library information class
class RudderLibraryInfo {
  constructor() {
    this.rl_name = "RudderLabs JavaScript SDK";
    this.rl_version = "1.0.0";
  }
}

//Operating System information class
class RudderOSInfo {
  constructor() {
    this.rl_name = "";
    this.rl_version = "";
  }
}

//Screen information class
class RudderScreenInfo {
  constructor() {
    this.rl_density = 0;
    this.rl_width = 0;
    this.rl_height = 0;
  }
}

//Device information class
class RudderDeviceInfo {
  constructor() {
    this.rl_id = "";
    this.rl_manufacturer = "";
    this.rl_model = "";
    this.rl_name = "";
  }
}

//Carrier information
class RudderNetwork {
  constructor() {
    this.rl_carrier = "";
  }
}

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

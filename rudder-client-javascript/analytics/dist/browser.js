var analytics = (function (exports) {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  //Utility method for excluding null and empty values in JSON
  function replacer(key, value) {
    if (!value || value == "") {
      return undefined;
    } else {
      return value;
    }
  } //Utility function for UUID genration


  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime();

    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
    });
  } //Utility function to get current time (formatted) for including in sent_at field


  function getCurrentTimeFormatted() {
    var curDateTime = new Date().toISOString();
    var curDate = curDateTime.split("T")[0];
    var curTimeExceptMillis = curDateTime.split("T")[1].split("Z")[0].split(".")[0];
    var curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
    return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis;
  } //Utility function to retrieve configuration JSON from server


  function getJSONTrimmed(context, url, callback) {
    //server-side integration, XHR is node module
    var cb_ = callback.bind(context);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
      var status = xhr.status;

      if (status == 200) {
        console.log("status 200");
        cb_(200, xhr.responseText);
      } else {
        cb_(status);
      }

      console.log("in response process");
    };

    console.log("before send");
    xhr.send();
    console.log("after send");
  }

  //Message Type enumeration
  var MessageType = {
    TRACK: "track",
    PAGE: "page",
    //SCREEN: "screen",
    IDENTIFY: "identify"
  }; //ECommerce Parameter Names Enumeration

  var ECommerceEvents = {
    PRODUCTS_SEARCHED: "Products Searched",
    PRODUCT_LIST_VIEWED: "Product List Viewed",
    PRODUCT_LIST_FILTERED: "Product List Filtered",
    PROMOTION_VIEWED: "Promotion Viewed",
    PROMOTION_CLICKED: "Promotion Clicked",
    PRODUCT_CLICKED: "Product Clicked",
    PRODUCT_VIEWED: "Product Viewed",
    PRODUCT_ADDED: "Product Added",
    PRODUCT_REMOVED: "Product Removed",
    CART_VIEWED: "Cart Viewed",
    CHECKOUT_STARTED: "Checkout Started",
    CHECKOUT_STEP_VIEWED: "Checkout Step Viewed",
    CHECKOUT_STEP_COMPLETED: "Checkout Step Completed",
    PAYMENT_INFO_ENTERED: "Payment Info Entered",
    ORDER_UPDATED: "Order Updated",
    ORDER_COMPLETED: "Order Completed",
    ORDER_REFUNDED: "Order Refunded",
    ORDER_CANCELLED: "Order Cancelled",
    COUPON_ENTERED: "Coupon Entered",
    COUPON_APPLIED: "Coupon Applied",
    COUPON_DENIED: "Coupon Denied",
    COUPON_REMOVED: "Coupon Removed",
    PRODUCT_ADDED_TO_WISHLIST: "Product Added to Wishlist",
    PRODUCT_REMOVED_FROM_WISHLIST: "Product Removed from Wishlist",
    WISH_LIST_PRODUCT_ADDED_TO_CART: "Wishlist Product Added to Cart",
    PRODUCT_SHARED: "Product Shared",
    CART_SHARED: "Cart Shared",
    PRODUCT_REVIEWED: "Product Reviewed"
  }; //Enumeration for integrations supported
  var BASE_URL = "http://18.222.145.124:5000/dump"; //"https://rudderlabs.com";

  var CONFIG_URL = "https://api.rudderlabs.com";
  var FLUSH_QUEUE_SIZE = 30;
  var FLUSH_INTERVAL_DEFAULT = 5000;
  /* module.exports = {
    MessageType: MessageType,
    ECommerceParamNames: ECommerceParamNames,
    ECommerceEvents: ECommerceEvents,
    RudderIntegrationPlatform: RudderIntegrationPlatform,
    BASE_URL: BASE_URL,
    CONFIG_URL: CONFIG_URL,
    FLUSH_QUEUE_SIZE: FLUSH_QUEUE_SIZE
  }; */

  function ScriptLoader(id, src) {
    console.log("in script loader=== " + id); //if (document.getElementById(id)) {
    //console.log("id not found==");

    var js = document.createElement("script");
    js.src = src;
    js.type = "text/javascript";
    js.id = id;
    var e = document.getElementsByTagName("script")[0];
    console.log("==script==", e);
    e.parentNode.insertBefore(js, e); //}
  } //('hubspot-integration', '//HubSpot.js');

  var HubSpot =
  /*#__PURE__*/
  function () {
    function HubSpot(hubId) {
      _classCallCheck(this, HubSpot);

      this.hubId = hubId;
    }

    _createClass(HubSpot, [{
      key: "init",
      value: function init() {
        var hubspotJs = "http://js.hs-scripts.com/" + this.hubId + ".js";
        ScriptLoader("hubspot-integration", hubspotJs);
        console.log("===in init===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        console.log("in HubspotAnalyticsManager identify");
        var traits = rudderElement.rl_message.rl_context.rl_traits;
        var traitsValue = {};

        for (var k in traits) {
          if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
            var hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
            traitsValue[hubspotkey] = traits[k];
          }
        }

        if (traitsValue["address"]) {
          var address = traitsValue["address"]; //traitsValue.delete(address)

          delete traitsValue["address"];

          for (var _k in address) {
            if (!!Object.getOwnPropertyDescriptor(address, _k) && address[_k]) {
              var _hubspotkey = _k.startsWith("rl_") ? _k.substring(3, _k.length) : _k;

              _hubspotkey = _hubspotkey == "street" ? "address" : _hubspotkey;
              traitsValue[_hubspotkey] = address[_k];
            }
          }
        }

        var userProperties = rudderElement.rl_message.rl_context.rl_user_properties;

        for (var _k2 in userProperties) {
          if (!!Object.getOwnPropertyDescriptor(userProperties, _k2) && userProperties[_k2]) {
            var _hubspotkey2 = _k2.startsWith("rl_") ? _k2.substring(3, _k2.length) : _k2;

            traitsValue[_hubspotkey2] = userProperties[_k2];
          }
        }

        console.log(traitsValue);

        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined) {
          var _hsq = window._hsq = window._hsq || [];

          _hsq.push(["identify", traitsValue]);
        }
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
        console.log("in HubspotAnalyticsManager track");

        var _hsq = window._hsq = window._hsq || [];

        var eventValue = {};
        eventValue["id"] = rudderElement.rl_message.rl_event;

        if (rudderElement.rl_message.rl_properties && rudderElement.rl_message.rl_properties.revenue) {
          console.log("revenue: " + rudderElement.rl_message.rl_properties.revenue);
          eventValue["value"] = rudderElement.rl_message.rl_properties.revenue;
        }

        _hsq.push(["trackEvent", eventValue]);
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        console.log("in HubspotAnalyticsManager page");

        var _hsq = window._hsq = window._hsq || []; //console.log("path: " + rudderElement.rl_message.rl_properties.path);
        //_hsq.push(["setPath", rudderElement.rl_message.rl_properties.path]);

        /* _hsq.push(["identify",{
            email: "testtrackpage@email.com"
        }]); */


        if (rudderElement.rl_message.rl_properties && rudderElement.rl_message.rl_properties.path) {
          _hsq.push(["setPath", rudderElement.rl_message.rl_properties.path]);
        }

        _hsq.push(["trackPageView"]);
      }
    }, {
      key: "loaded",
      value: function loaded() {
        console.log("in hubspot isLoaded");
        return !!(window._hsq && window._hsq.push !== Array.prototype.push);
      }
    }]);

    return HubSpot;
  }();

  //import nodeCode from "./node";
  var index =  HubSpot ;

  var integrations = {
    HS: index
  };

  //Application class
  class RudderApp {
    constructor() {
      this.rl_build = "1.0.0";
      this.rl_name = "RudderLabs JavaScript SDK";
      this.rl_namespace = "com.rudderlabs.javascript";
      this.rl_version = "1.0.0";
    }

  }

  //Library information class
  class RudderLibraryInfo {
    constructor() {
      this.rl_name = "RudderLabs JavaScript SDK";
      this.rl_version = "1.0.0";
    }

  } //Operating System information class


  class RudderOSInfo {
    constructor() {
      this.rl_name = "";
      this.rl_version = "";
    }

  } //Screen information class


  class RudderScreenInfo {
    constructor() {
      this.rl_density = 0;
      this.rl_width = 0;
      this.rl_height = 0;
    }

  } //Device information class

  //Context class

  class RudderContext {
    constructor() {
      this.rl_app = new RudderApp();
      this.rl_traits = null;
      this.rl_library = new RudderLibraryInfo(); //this.rl_os = null;

      var os = new RudderOSInfo();
      os.rl_version = ""; //skipping version for simplicity now

      var screen = new RudderScreenInfo(); //Depending on environment within which the code is executing, screen
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
        this.rl_user_agent = navigator.userAgent; //property name differs based on browser version

        this.rl_locale = navigator.language || navigator.browserLanguage;
      }

      this.screen = screen;
      this.rl_device = null;
      this.rl_network = null;
    }

  }

  //Core message class with default values

  class RudderMessage {
    constructor() {
      this.rl_channel = "web";
      this.rl_context = new RudderContext();
      this.rl_type = null;
      this.rl_action = null;
      this.rl_message_id = generateUUID().toString();
      this.rl_timestamp = new Date().getTime();
      this.rl_anonymous_id = generateUUID().toString();
      this.rl_user_id = null;
      this.rl_event = null;
      this.rl_properties = {}; //By default, all integrations will be set as enabled from client
      //Decision to route to specific destinations will be taken at server end

      this.rl_integrations = {};
      this.rl_integrations["all"] = true;
    } //Get property


    getProperty(key) {
      return this.rl_properties[key];
    } //Add property


    addProperty(key, value) {
      this.rl_properties[key] = value;
    } //Validate whether this message is semantically valid for the type mentioned


    validateFor(messageType) {
      //First check that rl_properties is populated
      if (!this.rl_properties) {
        throw new Error("Key rl_properties is required");
      } //Event type specific checks


      switch (messageType) {
        case MessageType.TRACK:
          //check if rl_event is present
          if (!this.rl_event) {
            throw new Error("Key rl_event is required for track event");
          } //Next make specific checks for e-commerce events


          if (this.rl_event in Object.values(ECommerceEvents)) {
            switch (this.rl_event) {
              case ECommerceEvents.CHECKOUT_STEP_VIEWED:
              case ECommerceEvents.CHECKOUT_STEP_COMPLETED:
              case ECommerceEvents.PAYMENT_INFO_ENTERED:
                this.checkForKey("checkout_id");
                this.checkForKey("step");
                break;

              case ECommerceEvents.PROMOTION_VIEWED:
              case ECommerceEvents.PROMOTION_CLICKED:
                this.checkForKey("promotion_id");
                break;

              case ECommerceEvents.ORDER_REFUNDED:
                this.checkForKey("order_id");
                break;

              default:
            }
          } else if (!this.rl_properties["rl_category"]) {
            //if rl_category is not there, set to rl_event
            this.rl_properties["rl_category"] = this.rl_event;
          }

          break;

        case MessageType.PAGE:
          break;

        case MessageType.SCREEN:
          if (!this.rl_properties["name"]) {
            throw new Error("Key 'name' is required in rl_properties");
          }

          break;
      }
    } //Function for checking existence of a particular property


    checkForKey(propertyName) {
      if (!this.rl_properties[propertyName]) {
        throw new Error("Key '" + propertyName + "' is required in rl_properties");
      }
    }

  }

  class RudderElement {
    constructor() {
      this.rl_message = new RudderMessage();
    } //Setters that in turn set the field values for the contained object


    setType(type) {
      this.rl_message.rl_type = type;
    }

    setProperty(rudderProperty) {
      this.rl_message.rl_properties = rudderProperty;
    }

    setUserProperty(rudderUserProperty) {
      this.rl_message.rl_user_properties = rudderUserProperty;
    }

    setUserId(userId) {
      this.rl_message.rl_user_id = userId;
    }

    setEventName(eventName) {
      this.rl_message.rl_event = eventName;
    }

    updateTraits(traits) {
      this.rl_message.rl_context.rl_traits = traits;
    }

    getElementContent() {
      return this.rl_message;
    }

  }

  //Class responsible for building up the individual elements in a batch

  class RudderElementBuilder {
    constructor() {
      this.rudderProperty = null;
      this.rudderUserProperty = null;
      this.event = null;
      this.userId = null;
      this.channel = null;
      this.type = null;
    } //Set the property


    setProperty(inputRudderProperty) {
      this.rudderProperty = inputRudderProperty;
      return this;
    } //Build and set the property object


    setPropertyBuilder(rudderPropertyBuilder) {
      this.rudderProperty = rudderPropertyBuilder.build();
      return this;
    }

    setUserProperty(inputRudderUserProperty) {
      this.rudderUserProperty = inputRudderUserProperty;
      return this;
    }

    setUserPropertyBuilder(rudderUserPropertyBuilder) {
      this.rudderUserProperty = rudderUserPropertyBuilder.build();
      return this;
    } //Setter methods for all variables. Instance is returned for each call in
    //accordance with the Builder pattern


    setEvent(event) {
      this.event = event;
      return this;
    }

    setUserId(userId) {
      this.userId = userId;
      return this;
    }

    setChannel(channel) {
      this.channel = channel;
      return this;
    }

    setType(eventType) {
      this.type = eventType;
      return this;
    }

    build() {
      var element = new RudderElement();
      element.setUserId(this.userId);
      element.setType(this.type);
      element.setEventName(this.event);
      element.setProperty(this.rudderProperty);
      element.setUserProperty(this.rudderUserProperty);
      return element;
    }

  }

  //Payload class, contains batch of Elements
  class RudderPayload {
    constructor() {
      this.batch = null;
      this.write_key = null;
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
    } //Setter methods to aid Builder pattern


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

  } //Class for Company to be embedded in Traits

  let defaults = {
    user_storage_key: "rl_user_id",
    user_storage_trait: "rl_trait"
  };

  class Storage {
    constructor() {
      this.storage = window.localStorage;
    }

    setItem(key, value) {
      let stringValue = "";

      if (typeof value == "string") {
        stringValue = value;
      }

      if (typeof value == "object") {
        stringValue = JSON.stringify(value);
      }

      this.storage.setItem(key, stringValue);
    }

    setUserId(value) {
      if (typeof value != "string") {
        console.log("userId should be string");
        return;
      }

      this.storage.setItem(defaults.user_storage_key, value);
      return;
    }

    setUserTraits(value) {
      if (typeof value != "object") {
        console.log("traits should be object");
        return;
      }

      this.storage.setItem(defaults.user_storage_trait, JSON.stringify(value));
      return;
    }

    getItem(key) {
      let stringValue = this.storage.getItem(key);
      return JSON.parse(stringValue);
    }

    getUserId() {
      return this.storage.getItem(defaults.user_storage_key);
    }

    getUserTraits() {
      return JSON.parse(this.storage.getItem(defaults.user_storage_trait));
    }

    removeItem(key) {
      this.storage.removeItem(key);
    }

    clear() {
      this.storage.clear();
    }

  }

  var Storage$1 =  Storage ;

  class EventRepository {
    constructor() {
      this.eventsBuffer = [];
      this.url = BASE_URL; //"http://localhost:9005"; //BASE_URL;

      this.state = "READY";
      /* setInterval(function (){
          this.preaparePayloadAndFlush(this.eventsBuffer);
        }, 5000); */

      setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);
    }

    preaparePayloadAndFlush(repo) {
      //construct payload
      console.log("==== in preaparePayloadAndFlush with state: " + repo.state);
      console.log(repo.eventsBuffer);

      if (repo.eventsBuffer.length == 0 || repo.state === "PROCESSING") {
        return;
      }

      var eventsPayload = repo.eventsBuffer.slice(0, FLUSH_QUEUE_SIZE);
      var payload = new RudderPayload();
      payload.batch = eventsPayload; //this.eventsBuffer;

      payload.write_key = repo.write_key;
      payload.sent_at = getCurrentTimeFormatted(); //server-side integration, XHR is node module

      var xhr = new XMLHttpRequest();
      console.log("==== in flush sending to Rudder BE ====");
      console.log(JSON.stringify(payload, replacer).replace(/rl_/g, ""));
      xhr.open("POST", repo.url, true);
      xhr.setRequestHeader("Content-Type", "application/json"); //register call back to reset event buffer on successfull POST

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          //this.eventsBuffer = []; //reset event buffer
          console.log("====== request processed successfully: " + xhr.status);
          repo.eventsBuffer = repo.eventsBuffer.slice(FLUSH_QUEUE_SIZE);
          console.log(repo.eventsBuffer.length);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          console.log("====== request failed with status: " + xhr.status);
        }

        repo.state = "READY";
      };

      xhr.send(JSON.stringify(payload, replacer).replace(/rl_/g, ""));
      repo.state = "PROCESSING";
    }

    flush(rudderElement) {
      //For Javascript SDK, event will be transmitted immediately
      //so buffer is really kept to be in alignment with other SDKs
      //this.eventsBuffer = [];
      console.log(this.eventsBuffer);
      this.eventsBuffer.push(rudderElement.getElementContent()); //Add to event buffer

      console.log("==== Added to flush queue =====" + this.eventsBuffer.length);
    }

  }

  let eventRepository = new EventRepository();

  function init(intgArray, configArray) {
    var _this = this;

    console.log("supported intgs ", integrations);
    var i = 0;
    this.clientIntegrationObjects = [];

    if (!intgArray || intgArray.length == 0) {
      this.toBeProcessedByIntegrationArray = [];
      return;
    }

    intgArray.forEach(function (intg) {
      //console.log("--name--", intg);
      var intgClass = integrations[intg]; //console.log("--class-- ", intgClass);

      if (intg === "HS") {
        var hubId = configArray[i].hubId; //console.log("==hubId== " + hubId);

        hubId = "6405167";
        var intgInstance = new intgClass(hubId);
        intgInstance.init();

        _this.clientIntegrationObjects.push(intgInstance);
      }
    });

    var _loop = function _loop(_i) {
      //send the queued events to the fetched integration
      _this.toBeProcessedByIntegrationArray.forEach(function (event) {
        var _this$clientIntegrati;

        var methodName = event[0];
        event.shift();
        /* console.log(
          "replay on integrations " + "method " + methodName + " args " + event
        ); */
        //uncomment to send data to destination

        (_this$clientIntegrati = _this.clientIntegrationObjects[_i])[methodName].apply(_this$clientIntegrati, _toConsumableArray(event));
      });
    };

    for (var _i = 0; _i < this.clientIntegrationObjects.length; _i++) {
      _loop(_i);
    }

    this.toBeProcessedByIntegrationArray = [];
  }

  function flush(rudderElement) {
    if (!this.eventRepository) {
      //console.log("initialize event repo")
      this.eventRepository = eventRepository;
    }

    this.eventRepository.flush(rudderElement);
  }

  var test =
  /*#__PURE__*/
  function () {
    function test() {
      _classCallCheck(this, test);

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
      this.storage = new Storage$1();
      this.userId = this.storage.getUserId() != undefined ? this.storage.getUserId() : generateUUID();
      this.userTraits = this.storage.getUserTraits() != undefined ? this.storage.getUserTraits() : {};
      this.storage.setUserId(this.userId);
      this.eventRepository = eventRepository;
    }

    _createClass(test, [{
      key: "processResponse",
      value: function processResponse(status, response) {
        //console.log("from callback " + this.prop1);
        //console.log(response);
        response = JSON.parse(response);
        response.source.destinations.forEach(function (destination, index) {
          console.log("Destination " + index + " Enabled? " + destination.enabled + " Type: " + destination.destinationDefinition.name + " Use Native SDK? " + destination.config.useNativeSDK);

          if (destination.enabled && destination.config.useNativeSDK) {
            this.clientIntegrations.push(destination.destinationDefinition.name);
            this.configArray.push(destination.config);
          }
        }, this);
        init.call(this, this.clientIntegrations, this.configArray);
      }
    }, {
      key: "page",
      value: function page(category, name, properties, options, callback) {
        //console.log("type=== " + typeof arguments);
        var args = Array.from(arguments);
        console.log("args ", args);
        if (typeof options == "function") callback = options, options = null;
        if (typeof properties == "function") callback = properties, options = properties = null;
        if (typeof name == "function") callback = name, options = properties = name = null;
        if (_typeof(category) === "object") options = name, properties = category, name = category = null;
        if (_typeof(name) === "object") options = properties, properties = name, name = null;
        if (typeof category === "string" && typeof name !== "string") name = category, category = null;

        if (!this.userId) {
          this.userId = generateUUID();
          this.storage.setUserId(this.userId);
        }

        var rudderElement = new RudderElementBuilder().setType("page").build(); //console.log("arg length ",arguments.length)

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
        rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement["rl_message"]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"]["rl_anonymous_id"] = this.userId;
        console.log(JSON.stringify(rudderElement)); //try to first send to all integrations, if list populated from BE

        if (this.clientIntegrationObjects) {
          this.clientIntegrationObjects.forEach(function (obj) {
            //obj.page(...arguments);
            //console.log("called in normal flow");
            //obj.page({ rl_message: { rl_properties: { path: "/abc-123" } } }); //test
            obj.page(rudderElement);
          });
        }

        if (!this.clientIntegrationObjects
        /*this.clientIntegrationObjects.length === 0  &&
        args[args.length - 1] != "wait" */
        ) {
            //console.log("pushing in replay queue");
            //args.unshift("page");
            //this.toBeProcessedArray.push(args); //new event processing after analytics initialized  but integrations not fetched from BE
            this.toBeProcessedByIntegrationArray.push(["page", rudderElement]);
          } // self analytics process
        //console.log("args ", args.slice(0, args.length - 1));


        flush.call(this, rudderElement);
        console.log("page called " + this.prop1);

        if (callback) {
          callback();
        }
      }
    }, {
      key: "track",
      value: function track(event, properties, options, callback) {
        if (typeof options == "function") callback = options, options = null;
        if (typeof properties == "function") callback = properties, options = null, properties = null;

        if (!this.userId) {
          this.userId = generateUUID();
          this.storage.setUserId(this.userId);
        }

        var rudderElement = new RudderElementBuilder().setType("track").build();

        if (event) {
          rudderElement.setEventName(event);
        }

        if (properties) {
          rudderElement.setProperty(properties);
        }

        rudderElement["rl_message"]["rl_context"]["rl_traits"] = this.userTraits;
        rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement["rl_message"]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"]["rl_anonymous_id"] = this.userId;
        console.log(JSON.stringify(rudderElement)); //try to first send to all integrations, if list populated from BE

        if (this.clientIntegrationObjects) {
          this.clientIntegrationObjects.forEach(function (obj) {
            console.log("called in normal flow");
            obj.track(rudderElement);
          });
        }

        if (!this.clientIntegrationObjects) {
          console.log("pushing in replay queue"); //new event processing after analytics initialized  but integrations not fetched from BE

          this.toBeProcessedByIntegrationArray.push(["track", rudderElement]);
        } // self analytics process


        flush.call(this, rudderElement);
        console.log("track is called " + this.prop2);

        if (callback) {
          callback();
        }
      }
    }, {
      key: "identify",
      value: function identify(userId, traits, options, callback) {
        if (typeof options == "function") callback = options, options = null;
        if (typeof traits == "function") callback = traits, options = null, traits = null;
        if (_typeof(userId) == "object") options = traits, traits = userId, userId = this.userId;
        this.userId = userId;
        this.storage.setUserId(this.userId);
        var rudderElement = new RudderElementBuilder().setType("identify").build();
        var rudderTraits = new RudderTraits();
        console.log(traits);

        if (traits) {
          for (var k in traits) {
            if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
              rudderTraits[k] = traits[k];
            }
          }
        }

        this.userTraits = traits;
        this.storage.setUserTraits(this.userTraits);
        rudderElement["rl_message"]["rl_context"]["rl_traits"] = this.userTraits;
        rudderElement["rl_message"]["rl_anonymous_id"] = rudderElement["rl_message"]["rl_user_id"] = rudderElement["rl_message"]["rl_context"]["rl_traits"]["rl_anonymous_id"] = this.userId;
        console.log(JSON.stringify(rudderElement)); //try to first send to all integrations, if list populated from BE

        if (this.clientIntegrationObjects) {
          this.clientIntegrationObjects.forEach(function (obj) {
            console.log("called in normal flow");
            obj.identify(rudderElement);
          });
        }

        if (!this.clientIntegrationObjects) {
          console.log("pushing in replay queue"); //new event processing after analytics initialized  but integrations not fetched from BE

          this.toBeProcessedByIntegrationArray.push(["identify", rudderElement]);
        } // self analytics process


        flush.call(this, rudderElement);
        console.log("identify is called " + this.prop2);

        if (callback) {
          callback();
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        this.userId = "";
        this.userTraits = {};
        this.storage.clear();
      }
    }, {
      key: "load",
      value: function load(writeKey) {
        console.log("inside load " + this.prop1);
        this.writeKey = writeKey;
        getJSONTrimmed(this, CONFIG_URL + "/source-config?write_key=" + writeKey, this.processResponse);
      }
    }]);

    return test;
  }();

  var instance = new test();

  {
    //console.log("is present? " + !!window.analytics);
    var eventsPushedAlready = !!window.analytics && window.analytics.push == Array.prototype.push;
    var methodArg = window.analytics ? window.analytics[0] : [];

    if (methodArg.length > 0 && methodArg[0] == "load") {
      instance[methodArg[0]](methodArg[1]); //instance[methodArgNext[0]]("test args 1", "test args 2");
    }

    if (eventsPushedAlready) {
      for (var i = 1; i < window.analytics.length; i++) {
        instance.toBeProcessedArray.push(window.analytics[i]);
      } //console.log("queued " + instance.toBeProcessedArray.length);


      for (var _i2 = 0; _i2 < instance.toBeProcessedArray.length; _i2++) {
        var event = _toConsumableArray(instance.toBeProcessedArray[_i2]); //console.log("replay event " + event);


        var method = event[0];
        event.shift(); //console.log("replay event modified " + event);

        instance[method].apply(instance, _toConsumableArray(event));
      }

      instance.toBeProcessedArray = [];
    }
  }

  var identify = instance.identify.bind(instance);
  var page = instance.page.bind(instance);
  var track = instance.track.bind(instance);
  var reset = instance.reset.bind(instance);
  var load = instance.load.bind(instance);

  exports.identify = identify;
  exports.load = load;
  exports.page = page;
  exports.reset = reset;
  exports.track = track;

  return exports;

}({}));

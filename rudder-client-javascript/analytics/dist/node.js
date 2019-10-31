'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
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

//import * as XMLHttpRequestNode from "Xmlhttprequest";
var XMLHttpRequestNode;

{
  XMLHttpRequestNode = require("Xmlhttprequest");
}

var btoaNode;

{
  btoaNode = require("btoa");
}
/**
 *
 * Utility method for excluding null and empty values in JSON
 * @param {*} key
 * @param {*} value
 * @returns
 */


function replacer(key, value) {
  if (value === null || value === undefined) {
    return undefined;
  } else {
    return value;
  }
}
/**
 *
 * Utility function for UUID genration
 * @returns
 */


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
}
/**
 *
 * Utility function to get current time (formatted) for including in sent_at field
 * @returns
 */


function getCurrentTimeFormatted() {
  var curDateTime = new Date().toISOString(); // Keeping same as iso string

  /* let curDate = curDateTime.split("T")[0];
  let curTimeExceptMillis = curDateTime
    .split("T")[1]
    .split("Z")[0]
    .split(".")[0];
  let curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
  return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis; */

  return curDateTime;
}
/**
 *
 * Utility function to retrieve configuration JSON from server
 * @param {*} context
 * @param {*} url
 * @param {*} callback
 */


function getJSONTrimmed(context, url, writeKey, callback) {
  //server-side integration, XHR is node module
  var cb_ = callback.bind(context);

  if (false) {
    var xhr;
  } else {
    var xhr = new XMLHttpRequestNode.XMLHttpRequest();
  }

  xhr.open("GET", url, true);

  {
    xhr.setRequestHeader("Authorization", "Basic " + btoaNode(writeKey + ":"));
  }

  xhr.onload = function () {
    var status = xhr.status;

    if (status == 200) {
      console.log("status 200 " + "calling callback");
      cb_(200, xhr.responseText);
    } else {
      handleError(new Error("request failed with status: " + xhr.status + " for url: " + url));
      cb_(status);
    }
  };

  xhr.send();
}

function handleError(error) {
  var errorMessage = error.message ? error.message : undefined;

  if (error instanceof Event) {
    if (error.target && error.target.localName == "script") {
      errorMessage = "error in script loading: " + error.target.id;
    }
  }

  if (errorMessage) {
    console.log("%c" + errorMessage, 'color: blue');
  }
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

var CONFIG_URL = "https://api.rudderlabs.com/sourceConfig"; //"https://api.rudderlabs.com/workspaceConfig";
var FLUSH_INTERVAL_DEFAULT = 5000;
var MAX_WAIT_FOR_INTEGRATION_LOAD = 10000;
var INTEGRATION_LOAD_CHECK_INTERVAL = 1000;
/* module.exports = {
  MessageType: MessageType,
  ECommerceParamNames: ECommerceParamNames,
  ECommerceEvents: ECommerceEvents,
  RudderIntegrationPlatform: RudderIntegrationPlatform,
  BASE_URL: BASE_URL,
  CONFIG_URL: CONFIG_URL,
  FLUSH_QUEUE_SIZE: FLUSH_QUEUE_SIZE
}; */

var HubSpotNode =
/*#__PURE__*/
function () {
  function HubSpotNode() {
    _classCallCheck(this, HubSpotNode);

    console.log("nothing to construct");
  }

  _createClass(HubSpotNode, [{
    key: "init",
    value: function init() {
      console.log("node not supported");
      console.log("===in init===");
    }
  }, {
    key: "identify",
    value: function identify(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "track",
    value: function track(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "page",
    value: function page(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "loaded",
    value: function loaded() {
      console.log("in hubspot isLoaded");
      console.log("node not supported");
    }
  }]);

  return HubSpotNode;
}();

var index =  HubSpotNode;

//import ua from "universal-analytics";
var ua;

{
  ua = require("universal-analytics");
}

var GANode =
/*#__PURE__*/
function () {
  function GANode(trackingID) {
    _classCallCheck(this, GANode);

    this.trackingID = trackingID;
    this.client = "";
  }

  _createClass(GANode, [{
    key: "init",
    value: function init() {
      console.log("===in GA Node init==="); //this.client = ua(this.trackingID, "6a14abda-6b12-4578-bf66-43c754eaeda9");
    }
  }, {
    key: "identify",
    value: function identify(rudderElement) {
      console.log("=== in GA Node identify===");
      this.client = ua(this.trackingID, rudderElement.message.userId);
    }
  }, {
    key: "track",
    value: function track(rudderElement) {
      console.log("=== in GA Node track===");
      this.client.event(rudderElement.message.type, rudderElement.message.event, function (err) {
        // Handle the error if necessary.
        // In case no error is provided you can be sure
        // the request was successfully sent off to Google.
        console.log("error sending to GA" + err);
      });
    }
  }, {
    key: "page",
    value: function page(rudderElement) {
      console.log("=== in GA Node page===");

      if (rudderElement.message.properties && rudderElement.message.properties.path) {
        this.client.pageview(rudderElement.message.properties.path, function (err) {
          // Handle the error if necessary.
          // In case no error is provided you can be sure
          // the request was successfully sent off to Google.
          console.log("error sending to GA" + err);
        }); //this.client.pageview(rudderElement.message.properties.path).send();
      }
    }
  }, {
    key: "loaded",
    value: function loaded() {
      console.log("in GA isLoaded");
      console.log("node not supported");
    }
  }]);

  return GANode;
}();

var index$1 =  GANode;

var HotjarNode =
/*#__PURE__*/
function () {
  function HotjarNode() {
    _classCallCheck(this, HotjarNode);

    console.log("nothing to construct");
  }

  _createClass(HotjarNode, [{
    key: "init",
    value: function init() {
      console.log("node not supported");
      console.log("===in init===");
    }
  }, {
    key: "identify",
    value: function identify(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "track",
    value: function track(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "page",
    value: function page(rudderElement) {
      console.log("node not supported");
    }
  }, {
    key: "loaded",
    value: function loaded() {
      console.log("in hubspot isLoaded");
      console.log("node not supported");
    }
  }]);

  return HotjarNode;
}();

var index$2 =  HotjarNode;

var integrations = {
  HS: index,
  GA: index$1,
  HOTJAR: index$2
};

//Application class
var RudderApp = function RudderApp() {
  _classCallCheck(this, RudderApp);

  this.build = "1.0.0";
  this.name = "RudderLabs JavaScript SDK";
  this.namespace = "com.rudderlabs.javascript";
  this.version = "1.0.0";
};

//Library information class
var RudderLibraryInfo = function RudderLibraryInfo() {
  _classCallCheck(this, RudderLibraryInfo);

  this.name = "RudderLabs JavaScript SDK";
  this.version = "1.0.0";
}; //Operating System information class


var RudderOSInfo = function RudderOSInfo() {
  _classCallCheck(this, RudderOSInfo);

  this.name = "";
  this.version = "";
}; //Screen information class


var RudderScreenInfo = function RudderScreenInfo() {
  _classCallCheck(this, RudderScreenInfo);

  this.density = 0;
  this.width = 0;
  this.height = 0;
}; //Device information class

var RudderContext = function RudderContext() {
  _classCallCheck(this, RudderContext);

  this.app = new RudderApp();
  this.traits = null;
  this.library = new RudderLibraryInfo(); //this.os = null;

  var os = new RudderOSInfo();
  os.version = ""; //skipping version for simplicity now

  var screen = new RudderScreenInfo(); //Depending on environment within which the code is executing, screen
  //dimensions can be set
  //User agent and locale can be retrieved only for browser
  //For server-side integration, same needs to be set by calling program

  {
    //server-side integration
    screen.width = 0;
    screen.height = 0;
    screen.density = 0;
    os.version = "";
    os.name = "";
    this.userAgent = null;
    this.locale = null;
  }

  this.ip = "0.0.0.0";
  this.os = os;
  this.screen = screen;
  this.device = null;
  this.network = null;
};

var RudderMessage =
/*#__PURE__*/
function () {
  function RudderMessage() {
    _classCallCheck(this, RudderMessage);

    this.channel = "web";
    this.context = new RudderContext();
    this.type = null;
    this.action = null;
    this.messageId = generateUUID().toString();
    this.originalTimestamp = new Date().toISOString();
    this.anonymousId = generateUUID().toString();
    this.userId = null;
    this.event = null;
    this.properties = {}; //By default, all integrations will be set as enabled from client
    //Decision to route to specific destinations will be taken at server end

    this.integrations = {};
    this.integrations["All"] = true;
  } //Get property


  _createClass(RudderMessage, [{
    key: "getProperty",
    value: function getProperty(key) {
      return this.properties[key];
    } //Add property

  }, {
    key: "addProperty",
    value: function addProperty(key, value) {
      this.properties[key] = value;
    } //Validate whether this message is semantically valid for the type mentioned

  }, {
    key: "validateFor",
    value: function validateFor(messageType) {
      //First check that properties is populated
      if (!this.properties) {
        throw new Error("Key properties is required");
      } //Event type specific checks


      switch (messageType) {
        case MessageType.TRACK:
          //check if event is present
          if (!this.event) {
            throw new Error("Key event is required for track event");
          } //Next make specific checks for e-commerce events


          if (this.event in Object.values(ECommerceEvents)) {
            switch (this.event) {
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
          } else if (!this.properties["category"]) {
            //if category is not there, set to event
            this.properties["category"] = this.event;
          }

          break;

        case MessageType.PAGE:
          break;

        case MessageType.SCREEN:
          if (!this.properties["name"]) {
            throw new Error("Key 'name' is required in properties");
          }

          break;
      }
    } //Function for checking existence of a particular property

  }, {
    key: "checkForKey",
    value: function checkForKey(propertyName) {
      if (!this.properties[propertyName]) {
        throw new Error("Key '" + propertyName + "' is required in properties");
      }
    }
  }]);

  return RudderMessage;
}();

var RudderElement =
/*#__PURE__*/
function () {
  function RudderElement() {
    _classCallCheck(this, RudderElement);

    this.message = new RudderMessage();
  } //Setters that in turn set the field values for the contained object


  _createClass(RudderElement, [{
    key: "setType",
    value: function setType(type) {
      this.message.type = type;
    }
  }, {
    key: "setProperty",
    value: function setProperty(rudderProperty) {
      this.message.properties = rudderProperty;
    }
  }, {
    key: "setUserProperty",
    value: function setUserProperty(rudderUserProperty) {
      this.message.user_properties = rudderUserProperty;
    }
  }, {
    key: "setUserId",
    value: function setUserId(userId) {
      this.message.userId = userId;
    }
  }, {
    key: "setEventName",
    value: function setEventName(eventName) {
      this.message.event = eventName;
    }
  }, {
    key: "updateTraits",
    value: function updateTraits(traits) {
      this.message.context.traits = traits;
    }
  }, {
    key: "getElementContent",
    value: function getElementContent() {
      return this.message;
    }
  }]);

  return RudderElement;
}();

var RudderElementBuilder =
/*#__PURE__*/
function () {
  function RudderElementBuilder() {
    _classCallCheck(this, RudderElementBuilder);

    this.rudderProperty = null;
    this.rudderUserProperty = null;
    this.event = null;
    this.userId = null;
    this.channel = null;
    this.type = null;
  } //Set the property


  _createClass(RudderElementBuilder, [{
    key: "setProperty",
    value: function setProperty(inputRudderProperty) {
      this.rudderProperty = inputRudderProperty;
      return this;
    } //Build and set the property object

  }, {
    key: "setPropertyBuilder",
    value: function setPropertyBuilder(rudderPropertyBuilder) {
      this.rudderProperty = rudderPropertyBuilder.build();
      return this;
    }
  }, {
    key: "setUserProperty",
    value: function setUserProperty(inputRudderUserProperty) {
      this.rudderUserProperty = inputRudderUserProperty;
      return this;
    }
  }, {
    key: "setUserPropertyBuilder",
    value: function setUserPropertyBuilder(rudderUserPropertyBuilder) {
      this.rudderUserProperty = rudderUserPropertyBuilder.build();
      return this;
    } //Setter methods for all variables. Instance is returned for each call in
    //accordance with the Builder pattern

  }, {
    key: "setEvent",
    value: function setEvent(event) {
      this.event = event;
      return this;
    }
  }, {
    key: "setUserId",
    value: function setUserId(userId) {
      this.userId = userId;
      return this;
    }
  }, {
    key: "setChannel",
    value: function setChannel(channel) {
      this.channel = channel;
      return this;
    }
  }, {
    key: "setType",
    value: function setType(eventType) {
      this.type = eventType;
      return this;
    }
  }, {
    key: "build",
    value: function build() {
      var element = new RudderElement();
      element.setUserId(this.userId);
      element.setType(this.type);
      element.setEventName(this.event);
      element.setProperty(this.rudderProperty);
      element.setUserProperty(this.rudderUserProperty);
      return element;
    }
  }]);

  return RudderElementBuilder;
}();

var StorageNode =
/*#__PURE__*/
function () {
  function StorageNode() {
    _classCallCheck(this, StorageNode);

    this.storage = {};
  }

  _createClass(StorageNode, [{
    key: "setItem",
    value: function setItem(key, value) {
      console.log("not implemented");
    }
  }, {
    key: "setUserId",
    value: function setUserId(value) {
      console.log("not implemented");
    }
  }, {
    key: "setUserTraits",
    value: function setUserTraits(value) {
      console.log("not implemented");
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      console.log("not implemented");
    }
  }, {
    key: "getUserId",
    value: function getUserId() {
      console.log("not implemented");
    }
  }, {
    key: "getUserTraits",
    value: function getUserTraits() {
      console.log("not implemented");
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      console.log("not implemented");
    }
  }, {
    key: "clear",
    value: function clear() {
      console.log("not implemented");
    }
  }]);

  return StorageNode;
}();

var Storage =  StorageNode;

//Payload class, contains batch of Elements
var RudderPayload = function RudderPayload() {
  _classCallCheck(this, RudderPayload);

  this.batch = null;
  this.writeKey = null;
};

var XMLHttpRequestNode$1;

{
  XMLHttpRequestNode$1 = require("Xmlhttprequest");
}

var btoaNode$1;

{
  btoaNode$1 = require("btoa");
}
/**
 *
 * @class EventRepository responsible for adding events into
 * flush queue and sending data to rudder backend
 * in batch and maintains order of the event.
 */


var EventRepository =
/*#__PURE__*/
function () {
  /**
   *Creates an instance of EventRepository.
   * @memberof EventRepository
   */
  function EventRepository() {
    _classCallCheck(this, EventRepository);

    this.eventsBuffer = [];
    this.writeKey = "";
    this.url = BASE_URL; //"http://localhost:9005"; //BASE_URL;

    this.state = "READY";
    this.batchSize = 0;
    setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);
  }
  /**
   *
   *
   * @param {EventRepository} repo
   * @returns
   * @memberof EventRepository
   */


  _createClass(EventRepository, [{
    key: "preaparePayloadAndFlush",
    value: function preaparePayloadAndFlush(repo) {
      //construct payload
      console.log("==== in preaparePayloadAndFlush with state: " + repo.state);
      console.log(repo.eventsBuffer);

      if (repo.eventsBuffer.length == 0 || repo.state === "PROCESSING") {
        return;
      }

      var eventsPayload = repo.eventsBuffer;
      var payload = new RudderPayload();
      payload.batch = eventsPayload;
      payload.writeKey = repo.writeKey;
      payload.sentAt = getCurrentTimeFormatted(); //add sentAt to individual events as well

      payload.batch.forEach(function (event) {
        event.sentAt = payload.sentAt;
      });
      repo.batchSize = repo.eventsBuffer.length; //server-side integration, XHR is node module

      if (false) {
        var xhr;
      } else {
        var xhr = new XMLHttpRequestNode$1.XMLHttpRequest();
      }

      console.log("==== in flush sending to Rudder BE ====");
      console.log(JSON.stringify(payload, replacer));
      xhr.open("POST", repo.url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      {
        xhr.setRequestHeader("Authorization", "Basic " + btoaNode$1(payload.writeKey + ":"));
      } //register call back to reset event buffer on successfull POST


      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("====== request processed successfully: " + xhr.status);
          repo.eventsBuffer = repo.eventsBuffer.slice(repo.batchSize);
          console.log(repo.eventsBuffer.length);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          handleError(new Error("request failed with status: " + xhr.status + " for url: " + repo.url));
        }

        repo.state = "READY";
      };

      xhr.send(JSON.stringify(payload, replacer));
      repo.state = "PROCESSING";
    }
    /**
     *
     *
     * @param {RudderElement} rudderElement
     * @memberof EventRepository
     */

  }, {
    key: "enqueue",
    value: function enqueue(rudderElement) {
      //so buffer is really kept to be in alignment with other SDKs
      console.log(this.eventsBuffer);
      this.eventsBuffer.push(rudderElement.getElementContent()); //Add to event buffer

      console.log("==== Added to flush queue =====" + this.eventsBuffer.length);
    }
  }]);

  return EventRepository;
}();

var eventRepository = new EventRepository();

var RudderProperty =
/*#__PURE__*/
function () {
  function RudderProperty() {
    _classCallCheck(this, RudderProperty);

    this.propertyMap = {};
  }

  _createClass(RudderProperty, [{
    key: "getPropertyMap",
    value: function getPropertyMap() {
      return this.propertyMap;
    }
  }, {
    key: "getProperty",
    value: function getProperty(key) {
      return this.propertyMap[key];
    }
  }, {
    key: "setProperty",
    value: function setProperty(key, value) {
      this.propertyMap[key] = value;
    }
  }, {
    key: "setPropertyMap",
    value: function setPropertyMap(inputPropertyMap) {
      var _this = this;

      if (!this.propertyMap) {
        this.propertyMap = inputPropertyMap;
      } else {
        Object.keys(inputPropertyMap).forEach(function (key) {
          _this.propertyMap[key] = inputPropertyMap[key];
        });
      }
    }
  }]);

  return RudderProperty;
}();

var PromotionEvent =
/*#__PURE__*/
function () {
  function PromotionEvent() {
    _classCallCheck(this, PromotionEvent);

    this.promotion = null;
  } //Setter method in accordance to Builder pattern


  _createClass(PromotionEvent, [{
    key: "setPromotion",
    value: function setPromotion(promotion) {
      this.promotion = promotion;
      return this;
    }
  }, {
    key: "build",
    value: function build() {
      var eventProperty = new RudderProperty();
      eventProperty.setPropertyMap(this.promotion);
      return eventProperty;
    }
  }]);

  return PromotionEvent;
}();

var PromotionViewedEvent =
/*#__PURE__*/
function (_PromotionEvent) {
  _inherits(PromotionViewedEvent, _PromotionEvent);

  function PromotionViewedEvent() {
    _classCallCheck(this, PromotionViewedEvent);

    return _possibleConstructorReturn(this, _getPrototypeOf(PromotionViewedEvent).call(this));
  }

  _createClass(PromotionViewedEvent, [{
    key: "event",
    value: function event() {
      return ECommerceEvents.PROMOTION_VIEWED;
    }
  }]);

  return PromotionViewedEvent;
}(PromotionEvent);

//Class representing e-commerce promotion
var ECommercePromotion =
/*#__PURE__*/
function () {
  function ECommercePromotion() {
    _classCallCheck(this, ECommercePromotion);

    this.promotion_id = "";
    this.creative = "";
    this.name = "";
    this.position = 0;
  } //Setter methods in accordance with Builder pattern


  _createClass(ECommercePromotion, [{
    key: "setPromotionId",
    value: function setPromotionId(promotionId) {
      this.promotion_id = promotionId;
      return this;
    }
  }, {
    key: "setCreative",
    value: function setCreative(creative) {
      this.creative = creative;
      return this;
    }
  }, {
    key: "setName",
    value: function setName(name) {
      this.name = name;
      return this;
    }
  }, {
    key: "setPosition",
    value: function setPosition(position) {
      this.position = position;
      return this;
    }
  }]);

  return ECommercePromotion;
}();

/**
 * Add the rudderelement object to flush queue
 *
 * @param {RudderElement} rudderElement
 */

function enqueue(rudderElement) {
  if (!this.eventRepository) {
    this.eventRepository = eventRepository;
  }

  this.eventRepository.enqueue(rudderElement);
}
/**
 * class responsible for handling core
 * event tracking functionalities
 */


var Analytics =
/*#__PURE__*/
function () {
  /**
   * Creates an instance of Analytics.
   * @memberof Analytics
   */
  function Analytics() {
    _classCallCheck(this, Analytics);

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
    this.userId = this.storage.getUserId() != undefined ? this.storage.getUserId() : generateUUID();
    this.userTraits = this.storage.getUserTraits() != undefined ? this.storage.getUserTraits() : {};
    this.storage.setUserId(this.userId);
    this.eventRepository = eventRepository;
  }
  /**
   * Process the response from control plane and
   * call initialize for integrations
   *
   * @param {*} status
   * @param {*} response
   * @memberof Analytics
   */


  _createClass(Analytics, [{
    key: "processResponse",
    value: function processResponse(status, response) {
      console.log("===in process response=== " + status);
      response = JSON.parse(response);
      response.source.destinations.forEach(function (destination, index) {
        console.log("Destination " + index + " Enabled? " + destination.enabled + " Type: " + destination.destinationDefinition.name + " Use Native SDK? " + destination.config.useNativeSDK);

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

  }, {
    key: "init",
    value: function init(intgArray, configArray) {
      var _this = this;

      console.log("supported intgs ", integrations);
      var i = 0;
      this.clientIntegrationObjects = [];

      if (!intgArray || intgArray.length == 0) {
        this.toBeProcessedByIntegrationArray = [];
        return;
      }

      intgArray.forEach(function (intg) {
        var intgClass = integrations[intg];

        if (intg === "HS") {
          var hubId = configArray[i].hubId;
          var intgInstance = new intgClass(hubId);
          intgInstance.init(); //this.clientIntegrationObjects.push(intgInstance);

          _this.isInitialized(intgInstance).then(_this.replayEvents);
        }

        if (intg === "GA") {
          var trackingID = configArray[i].trackingID;

          var _intgInstance = new intgClass(trackingID);

          _intgInstance.init(); //this.clientIntegrationObjects.push(intgInstance);


          _this.isInitialized(_intgInstance).then(_this.replayEvents);
        }

        if (intg === "HOTJAR") {
          var siteID = configArray[i].siteID;

          var _intgInstance2 = new intgClass(siteID);

          _intgInstance2.init();
          /* As we Hotjar tracks all events by itself, no need to send events explicitly. 
             So, not putting 'Hotjar' object in clientIntegrationObjects list. */

        }
      });
    }
  }, {
    key: "replayEvents",
    value: function replayEvents(object) {
      if (object.successfullyLoadedIntegration.length + object.failedToBeLoadedIntegration.length == object.clientIntegrations.length) {
        object.clientIntegrationObjects = object.successfullyLoadedIntegration; //send the queued events to the fetched integration

        object.toBeProcessedByIntegrationArray.forEach(function (event) {
          var methodName = event[0];
          event.shift();
          var integrationOptions = event[0].message.integrations;

          for (var i = 0; i < object.clientIntegrationObjects.length; i++) {
            if (integrationOptions[object.clientIntegrationObjects[i].name] || integrationOptions[object.clientIntegrationObjects[i].name] == undefined && integrationOptions["All"]) {
              try {
                var _object$clientIntegra;

                (_object$clientIntegra = object.clientIntegrationObjects[i])[methodName].apply(_object$clientIntegra, _toConsumableArray(event));
              } catch (error) {
                handleError(error);
              }
            }
          }
        });
        object.toBeProcessedByIntegrationArray = [];
      }
    }
  }, {
    key: "pause",
    value: function pause(time) {
      return new Promise(function (resolve) {
        setTimeout(resolve, time);
      });
    }
  }, {
    key: "isInitialized",
    value: function isInitialized(instance) {
      var _this2 = this;

      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return new Promise(function (resolve) {
        if (instance.isLoaded()) {
          _this2.successfullyLoadedIntegration.push(instance);

          return resolve(_this2);
        }

        if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
          console.log("====max wait over====");

          _this2.failedToBeLoadedIntegration.push(instance);

          return resolve(_this2);
        }

        _this2.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(function () {
          return _this2.isInitialized(instance, time + INTEGRATION_LOAD_CHECK_INTERVAL).then(resolve);
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

  }, {
    key: "page",
    value: function page(category, name, properties, options, callback) {
      if (typeof options == "function") callback = options, options = null;
      if (typeof properties == "function") callback = properties, options = properties = null;
      if (typeof name == "function") callback = name, options = properties = name = null;
      if (_typeof(category) === "object") options = name, properties = category, name = category = null;
      if (_typeof(name) === "object") options = properties, properties = name, name = null;
      if (typeof category === "string" && typeof name !== "string") name = category, category = null;
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

  }, {
    key: "track",
    value: function track(event, properties, options, callback) {
      if (typeof options == "function") callback = options, options = null;
      if (typeof properties == "function") callback = properties, options = null, properties = null;
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

  }, {
    key: "identify",
    value: function identify(userId, traits, options, callback) {
      if (typeof options == "function") callback = options, options = null;
      if (typeof traits == "function") callback = traits, options = null, traits = null;
      if (_typeof(userId) == "object") options = traits, traits = userId, userId = this.userId;
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

  }, {
    key: "processPage",
    value: function processPage(category, name, properties, options, callback) {
      var rudderElement = new RudderElementBuilder().setType("page").build();

      if (name) {
        rudderElement["message"]["name"] = name;
      }

      if (category) {
        if (!properties) {
          properties = {};
        }

        properties["category"] = category;
      }

      if (properties) {
        rudderElement["message"]["properties"] = properties;
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

  }, {
    key: "processTrack",
    value: function processTrack(event, properties, options, callback) {
      var rudderElement = new RudderElementBuilder().setType("track").build();

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

  }, {
    key: "processIdentify",
    value: function processIdentify(userId, traits, options, callback) {
      this.userId = userId;
      this.storage.setUserId(this.userId);
      var rudderElement = new RudderElementBuilder().setType("identify").build();

      if (traits) {
        this.userTraits = traits;
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

  }, {
    key: "identifyUser",
    value: function identifyUser(rudderElement, options, callback) {
      if (rudderElement["message"]["userId"]) {
        this.userId = rudderElement["message"]["userId"];
        this.storage.setUserId(this.userId);
      }

      if (rudderElement && rudderElement["message"] && rudderElement["message"]["context"] && rudderElement["message"]["context"]["traits"]) {
        this.userTraits = rudderElement["message"]["context"]["traits"];
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

  }, {
    key: "trackPage",
    value: function trackPage(rudderElement, options, callback) {
      this.processAndSendDataToDestinations("page", rudderElement, options, callback);
    }
    /**
     * Track call supporting rudderelement from builder
     *
     * @param {*} rudderElement
     * @param {*} callback
     * @memberof Analytics
     */

  }, {
    key: "trackEvent",
    value: function trackEvent(rudderElement, options, callback) {
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

  }, {
    key: "processAndSendDataToDestinations",
    value: function processAndSendDataToDestinations(type, rudderElement, options, callback) {
      try {
        if (!this.userId) {
          this.userId = generateUUID();
          this.storage.setUserId(this.userId);
        }

        rudderElement["message"]["context"]["traits"] = this.userTraits;
        rudderElement["message"]["anonymousId"] = rudderElement["message"]["userId"] = rudderElement["message"]["context"]["traits"]["anonymousId"] = this.userId;

        if (options) {
          this.processOptionsParam(rudderElement, options);
        }

        console.log(JSON.stringify(rudderElement));
        var integrations = rudderElement.message.integrations; //try to first send to all integrations, if list populated from BE

        if (this.clientIntegrationObjects) {
          this.clientIntegrationObjects.forEach(function (obj) {
            console.log("called in normal flow");

            if (integrations[obj.name] || integrations[obj.name] == undefined && integrations["All"]) {
              obj[type](rudderElement);
            }
          });
        }

        if (!this.clientIntegrationObjects) {
          console.log("pushing in replay queue"); //new event processing after analytics initialized  but integrations not fetched from BE

          this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
        } // self analytics process


        enqueue.call(this, rudderElement);
        console.log(type + " is called ");

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

  }, {
    key: "processOptionsParam",
    value: function processOptionsParam(rudderElement, options) {
      var toplevelElements = ['integrations', 'anonymousId', 'originalTimestamp'];

      for (var key in options) {
        if (toplevelElements.includes(key)) {
          rudderElement.message[key] = options[key];
        } else {
          if (key !== 'context') rudderElement.message.context[key] = options[key];else {
            for (var k in options[key]) {
              rudderElement.message.context[k] = options[key][k];
            }
          }
        }
      }
    }
    /**
     * Clear user information
     *
     * @memberof Analytics
     */

  }, {
    key: "reset",
    value: function reset() {
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

  }, {
    key: "load",
    value: function load(writeKey, serverUrl) {
      console.log("inside load ");
      this.eventRepository.writeKey = writeKey;

      if (serverUrl) {
        this.eventRepository.url = serverUrl;
      }

      getJSONTrimmed(this, CONFIG_URL, writeKey, this.processResponse);
    }
  }]);

  return Analytics;
}();

var instance = new Analytics();

var identify = instance.identify.bind(instance);
var page = instance.page.bind(instance);
var track = instance.track.bind(instance);
var trackEvent = instance.trackEvent.bind(instance);
var trackPage = instance.trackPage.bind(instance);
var identifyUser = instance.identifyUser.bind(instance);
var reset = instance.reset.bind(instance);
var load = instance.load.bind(instance);

exports.ECommerceEvents = ECommerceEvents;
exports.ECommercePromotion = ECommercePromotion;
exports.PromotionViewedEvent = PromotionViewedEvent;
exports.RudderElementBuilder = RudderElementBuilder;
exports.identify = identify;
exports.identifyUser = identifyUser;
exports.load = load;
exports.page = page;
exports.reset = reset;
exports.track = track;
exports.trackEvent = trackEvent;
exports.trackPage = trackPage;

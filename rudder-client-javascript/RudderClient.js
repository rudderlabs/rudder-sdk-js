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

//Rudder configration class
var RudderConfig = (function() {
  var instance;

  function init() {
    //Private variables
    var endPointUri = BASE_URL;
    var flushQueueSize = FLUSH_QUEUE_SIZE;
    var integrations = [];

    //Public methods
    return {
      getDefaultIntegrations: function() {
        return [];
      },

      getEndPointUri: function() {
        return endPointUri;
      },

      getFlushQueueSize: function() {
        return this.flushQueueSize;
      },

      getIntegrations: function() {
        return this.integrations;
      },

      setIntegrations: function(integrations) {
        this.integrations = integrations;
        return this;
      },

      setFlushQueueSize: function(flushQueueSize) {
        this.flushQueueSize = flushQueueSize;
        return this;
      },

      setEndPointUri: function(endPointUri) {
        this.endPointUri = endPointUri;
        return this;
      }
    };
  }

  return {
    getDefaultConfig: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();

class AnalyticsManager {
  initializeHubSpot(hubId, wrappers) {
    if (typeof window !== undefined) {
      /* $.ajax({
        async: false,
        url: "/integration/HubSpot.js",
        dataType: "script"
      }); */
      //var _hub = new HubspotAnalyticsManager(hubId).init();
      var HubspotAnalyticsManager = require("./integration/Hubspot.js");
      var _hub = new HubspotAnalyticsManager();
      if (_hub) {
        console.log("===_hub===", _hub);
        wrappers.push(_hub);
        console.log("Hubspot loaded!");
      }
      console.log("Script loaded in sync");
    }
  }
}

//Event Repository
class EventRepository {
  constructor(writeKey, rudderConfig, wrappers) {
    this.eventsBuffer = [];
    this.write_key = writeKey;
    this.rudderConfig = rudderConfig;
    this.enabledNativeSDK = [];
    console.log(wrappers);
    this.isLoaded = false;
    var analyticsManager = new AnalyticsManager();
    console.log("before getjson");
    getJSON(
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      wrappers,
      this.isLoaded,
      function(err, data, wrapperList, isLoaded) {
        console.log("in callback");
        if (err) {
          throw new Error("unable to download configurations from server");
        } else {
          //parse the json response and populate the configuration JSON
          var configJson = JSON.parse(data);
          var enabledNativeSDK = [];
          //iterate through all destinations to find which providers require
          //native SDK enablement
          configJson.source.destinations.forEach(function(destination, index) {
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
              //enabledNativeSDK.push(destination.destinationDefinition.name)
              switch (destination.destinationDefinition.name) {
                case "HS":
                  var hubId = destination.config.hubId;
                  hubId = "6405167";
                  console.log("=== start init====");
                  analyticsManager.initializeHubSpot(hubId, wrappers);

                  console.log("=== end init====");
                  //wrapperList.push(new HubspotAnalyticsManager("6405167"));
                  break;
                case "AF":
                  break;
                default:
              }
            }
          });
          isLoaded = true;
        }
      }
    );
    console.log("after getjson");
  }

  flush(rudderElement) {
    //For Javascript SDK, event will be transmitted immediately
    //so buffer is really kept to be in alignment with other SDKs
    this.eventsBuffer = [];

    this.eventsBuffer.push(rudderElement); //Add to event buffer

    //construct payload
    var payload = new RudderPayload();
    payload.batch = this.eventsBuffer;
    payload.write_key = this.write_key;
    payload.sent_at = getCurrentTimeFormatted();
    //server-side integration, XHR is node module

    var xhr = new XMLHttpRequest();

    console.log(JSON.stringify(payload, replacer));

    xhr.open("POST", this.rudderConfig.getEndPointUri(), false);
    xhr.setRequestHeader("Content-Type", "application/json");

    //register call back to reset event buffer on successfull POST
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.eventsBuffer = []; //reset event buffer
      }
    };
    //xhr.send(JSON.stringify(payload, replacer));
  }
}

//Payload class, contains batch of Elements
class RudderPayload {
  constructor() {
    this.batch = null;
    this.write_key = null;
  }
}

//Individual element class containing Rudder Message
class RudderElement {
  constructor() {
    this.rl_message = new RudderMessage();
  }

  //Setters that in turn set the field values for the contained object
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
}

//Class responsible for building up the individual elements in a batch
//that is transmitted by the SDK
class RudderElementBuilder {
  constructor() {
    this.rudderProperty = null;
    this.rudderUserProperty = null;
    this.event = null;
    this.userId = null;
    this.channel = null;
  }

  //Set the property
  setProperty(inputRudderProperty) {
    this.rudderProperty = inputRudderProperty;
    return this;
  }

  //Build and set the property object
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
  }

  //Setter methods for all variables. Instance is returned for each call in
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

  build() {
    var element = new RudderElement();
    element.setUserId(this.userId);
    element.setEventName(this.event);
    element.setProperty(this.rudderProperty);
    element.setUserProperty(this.rudderUserProperty);
    return element;
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
    this.rl_properties = {};

    //By default, all integrations will be set as enabled from client
    //Decision to route to specific destinations will be taken at server end
    this.rl_integrations = {};
    this.rl_integrations["all"] = true;
  }

  //Get property
  getProperty(key) {
    return this.rl_properties[key];
  }

  //Add property
  addProperty(key, value) {
    this.rl_properties[key] = value;
  }

  //Validate whether this message is semantically valid for the type mentioned
  validateFor(messageType) {
    //First check that rl_properties is populated
    if (!this.rl_properties) {
      throw new Error("Key rl_properties is required");
    }
    //Event type specific checks
    switch (messageType) {
      case MessageType.TRACK:
        //check if rl_event is present
        if (!this.rl_event) {
          throw new Error("Key rl_event is required for track event");
        }
        //Next make specific checks for e-commerce events
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
  }

  //Function for checking existence of a particular property
  checkForKey(propertyName) {
    if (!this.rl_properties[propertyName]) {
      throw new Error(
        "Key '" + propertyName + "' is required in rl_properties"
      );
    }
  }
}

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

//Sample Usage

/* var client
  = RudderClient.getInstance("1QbNPCBQp2RFWolFj2ZhXi2ER6a", RudderConfig.getDefaultConfig().setFlushQueueSize(1));

client.identify((new RudderTraits()).
  setName("Mini").
  setEmail("minimouse@rudderlabs.com").
  setId(generateUUID())); */

/*
var props = new RudderProperty();
props.setProperty("title","How to create a tracking plan");
props.setProperty("course", "Intro to Analytics");
client.track(new RudderElementBuilder().
                setEvent("Article Completed").
                setProperty(props.getPropertyMap()).
                setUserId("dipanjan").
                build());



client.identify((new RudderTraits()).
                    setName("dipanjan").
                    setEmail("dipanjan@rudderlabs.com").
                    setId(generateUUID));

client.page(new RudderElementBuilder().
             setProperty(new PagePropertyBuilder().
                setTitle("Blog Page").
                setUrl("https://rudderlabs.com").
                setPath("/blogs").
                setReferrer("https://www.rudderlabs.com").
                build().
                getPropertyMap()).
                build());


//e-commerce examples
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCTS_SEARCHED).
                setProperty(new ProductSearchedEvent().
                setQuery("Dummy Query 1").
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_LIST_VIEWED).
                setProperty(new ProductListViewedEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                setListId("Dummy List 1").
                setCategory("Dummy Product Category 1").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_LIST_FILTERED).
                setProperty(new ProductListFilteredEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                addFilter(new ECommerceProductFilter().setType("Dummy Filter 1")).
                addFilter(new ECommerceProductFilter().setType("Dummy Filter 2")).
                addSort(new ECommerceProductSort().setType("Dummy Sort 1")).
                addSort(new ECommerceProductSort().setType("Dummy Sort 2")).
                setListId("Dummy List 3").
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PROMOTION_VIEWED).
                setProperty(new PromotionViewedEvent().
                setPromotion(new ECommercePromotion().
                setPromotionId("Dummy Promotion 1").
                setCreative("Dummy Creative 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PROMOTION_CLICKED).
                setProperty(new PromotionViewedEvent().
                setPromotion(new ECommercePromotion().
                setPromotionId("Dummy Promotion 2").
                setCreative("Dummy Creative 2").
                setName("Dummy Promotion Name 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_VIEWED).
                setProperty(new ProductViewedEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 0A").
                setProductId("Dummy Product ID 0A").
                setSku("Dummy SKU 0A")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_CLICKED).
                setProperty(new ProductViewedEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 0B").
                setProductId("Dummy Product ID 0B").
                setPrice(10.85).
                setCurrency("USD").
                setSku("Dummy SKU 0B")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_ADDED).
                setProperty(new ProductAddedToCartEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 1A")).
                setCartId("Dummy Cart 1A").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REMOVED).
                setProperty(new ProductAddedToCartEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 1B")).
                setCartId("Dummy Cart 1B").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CART_VIEWED).
                setProperty(new CartViewedEvent().
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2")).
                setCartId("Dummy Cart 1").
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STARTED).
                setProperty(new CheckoutStartedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 1").
                addProduct(new ECommerceProduct().setName("Dummy Product 1")).
                addProduct(new ECommerceProduct().setName("Dummy Product 2"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STEP_VIEWED).
                setProperty(new CheckoutStepViewedEvent().
                setCheckout(new ECommerceCheckout().
                setCheckoutId("Dummy Checkout Id 1").
                setStep(2).
                setShippingMethod("Dummy Checkout Shipping Method 1").
                setPaymentMethod("Dummy Checkout Payment Method 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CHECKOUT_STEP_COMPLETED).
                setProperty(new CheckoutStepViewedEvent().
                setCheckout(new ECommerceCheckout().
                setCheckoutId("Dummy Checkout Id 2").
                setStep(3).
                setShippingMethod("Dummy Checkout Shipping Method 2").
                setPaymentMethod("Dummy Checkout Payment Method 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PAYMENT_INFO_ENTERED).
                setProperty(new PaymentInfoEnteredEvent().
                setPaymentInfo(new ECommercePaymentInfo().
                setCheckoutId("Dummy Checkout Id 3").
                setStep(4).
                setShippingMethod("Dummy Checkout Shipping Method 3").
                setPaymentMethod("Dummy Checkout Payment Method 3")).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_UPDATED).
                setProperty(new OrderUpdatedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 4").
                setAffiliation("Dummy Affiliation 2").
                addProduct(new ECommerceProduct().setName("Dummy Product 5")).
                addProduct(new ECommerceProduct().setName("Dummy Product 6").setSku("Dummy SKU 3"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_COMPLETED).
                setProperty(new OrderCompletedEvent().
                setOrder(new ECommerceCompletedOrder().
                setOrderId("Dummy Order 5").
                setCheckoutId("Dummy Checkout Id 2").
                setAffiliation("Dummy Affiliation 2").
                addProduct(new ECommerceProduct().setName("Dummy Product 7")).
                addProduct(new ECommerceProduct().setName("Dummy Product 8").setSku("Dummy SKU 4"))).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_REFUNDED).
                setProperty(new OrderRefundedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 5").
                setAffiliation("Dummy Affiliation 3").
                setTotal(45.85).
                setCurrency("USD").
                addProduct(new ECommerceProduct().setName("Dummy Product 5")).
                addProduct(new ECommerceProduct().setName("Dummy Product 6").setSku("Dummy SKU 3"))).
                build().getPropertyMap()).
                build());


client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.ORDER_CANCELLED).
                setProperty(new OrderRefundedEvent().
                setOrder(new ECommerceOrder().
                setOrderId("Dummy Order 9").
                setAffiliation("Dummy Affiliation 4").
                setTotal(30).
                setRevenue(25.00).
                setShipping(3).
                setTax(2).
                setDiscount(2.5).
                setCoupon("hasbros").
                setCurrency("USD").
                addProduct(new ECommerceProduct().setName("Dummy Product 7")).
                addProduct(new ECommerceProduct().setName("Dummy Product 8").setSku("Dummy SKU 4"))).
                build().getPropertyMap()).
                build());




client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_APPLIED).
            setProperty(new CouponAppliedEvent().
            setCoupon(new ECommerceAppliedOrRemovedCoupon().
            setOrderId("Dummy Order Id 10").
            setCartId("Dummy Card Id 3").
            setCouponId("Dummy Coupon Id 1").
            setCouponName("Dummy Coupon Name 1").
            setDiscount(12.32)).
            build().getPropertyMap()).
            build());



client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_DENIED).
            setProperty(new CouponDeniedEvent().
            setCoupon(new ECommerceDeniedCoupon().
            setOrderId("Dummy Order Id 11").
            setCartId("Dummy Card Id 4").
            setCouponId("Dummy Coupon Id 2").
            setCouponName("Dummy Coupon Name 2").
            setReason("Dummy Coupon Deny Reason 1")).
            build().getPropertyMap()).
            build());




client.track(new RudderElementBuilder().
            setEvent(ECommerceEvents.COUPON_REMOVED).
            setProperty(new CouponRemovedEvent().
            setCoupon(new ECommerceAppliedOrRemovedCoupon().
            setOrderId("Dummy Order Id 11").
            setCartId("Dummy Card Id 4").
            setCouponId("Dummy Coupon Id 2").
            setCouponName("Dummy Coupon Name 2").
            setDiscount(23.32)).
            build().getPropertyMap()).
            build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST).
                setProperty(new ProductAddedToWishlistEvent().
                setProduct(new ECommerceProduct().
                setName("Dummy Product 2").
                setCategory("Dummy Product Category 413").
                setSku("Dummy Product SKU 43").
                setVariant("Dummy Product Variant 34").
                setCoupon("Dummy Product Coupon 123")).
                setWishlist(new ECommerceWishList().setWishlistId("Dummy Wishlist 1").
                setWishlistName("Dummy Wishlist 1")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REMOVED_FROM_WISHLIST).
                setProperty(new ProductRemovedFromWishlistEvent().
                setProduct(new ECommerceProduct().
                setName("Dummy Product 23").
                setCategory("Dummy Product Category 543").
                setSku("Dummy Product SKU 78").
                setVariant("Dummy Product Variant 98").
                setCoupon("Dummy Product Coupon 113")).
                setWishlist(new ECommerceWishList().setWishlistId("Dummy Wishlist 2").
                setWishlistName("Dummy Wishlist 2")).
                build().getPropertyMap()).
                build());

client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.WISH_LIST_PRODUCT_ADDED_TO_CART).
                setProperty(new WishlistProductAddedToCartEvent().
                setCartId("Dummy Cart ID 2019").
                setProduct(new ECommerceProduct().
                setName("Dummy Product 54").
                setCategory("Dummy Product Category 28").
                setSku("Dummy Product SKU 12").
                setVariant("Dummy Product Variant 76").
                setCoupon("Dummy Product Coupon 3")).
                setWishlist(new ECommerceWishList()
                .setWishlistId("Dummy Wishlist 2").
                setWishlistName("Dummy Wishlist 2")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_SHARED).
                setProperty(new ProductSharedEvent().
                setShareVia("Dummy Share Via 1").
                setShareMessage("Dummy Message 1").
                setRecipient("Dummy Recipient 1").
                setProduct(new ECommerceProduct().
                setName("Dummy Product 542").
                setCategory("Dummy Product Category 228").
                setSku("Dummy Product SKU 212").
                setVariant("Dummy Product Variant 276").
                setCoupon("Dummy Product Coupon 23")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.CART_SHARED).
                setProperty(new CartSharedEvent().
                setShareVia("Dummy Share Via 2").
                setShareMessage("Dummy Message 2").
                setRecipient("Dummy Recipient 2").
                setCartId("Dummy Shared Cart Id 1").
                addProduct(new ECommerceProductBase().
                setProductId("Dummy Product Id 255")).
                addProduct(new ECommerceProductBase().
                setProductId("Dummy Product Id 522")).
                build().getPropertyMap()).
                build());
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_REVIEWED).
                setProperty(new ProductReviewedEvent().
                setProductId("Dummy Review Propduct Id 67").
                setReviewId("Dummy Review ID 1").
                setReviewBody("Dummy Review Body 1").
                setRating("Excellent").
                build().getPropertyMap()).
                build());
*/

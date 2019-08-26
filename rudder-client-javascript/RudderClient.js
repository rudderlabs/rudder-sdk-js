//  -----------------------------------------------------------------------
//  <copyright file="RudderClient.js" company="Rudder Labs">
//   Copyright (c) 2019 Rudder Labs All rights reserved.
//  </copyright>
//  <author>Rudder Labs</author>
//  -----------------------------------------------------------------------


//Utility function for UUID genration
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

//Utility function for converting an object to a map
function convertToMap (obj) {
    let map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}


//Message Type enumeration
var MessageType = {
    TRACK: "track",
    PAGE: "page",
    SCREEN: "screen",
    IDENTIFY: "identify"
};

//ECommerce Parameter Names Enumeration
var ECommerceParamNames ={
    QUERY:  "query",
    PRICE:  "price",
    PRODUCT_ID: "product_id",
    CATEGORY:   "category",
    CURRENCY:   "currency",
    LIST_ID:    "list_id",
    PRODUCTS:   "products",
    WISHLIST_ID:    "wishlist_id",
    WISHLIST_NAME:  "wishlist_name",
    QUANTITY:   "quantity",
    CART_ID:    "cart_id",
    CHECKOUT_ID:    "checkout_id",
    TOTAL:  "total",
    REVENUE:    "revenue",
    ORDER_ID:   "order_id"
}
//ECommerce Events Enumeration
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
}

//Enumeration for integrations supported
var RudderIntegrationPlatform = {
    RUDDERLABS: "rudderlabs",
    GA: "ga",
    AMPLITUDE: "amplitude"
}

const BASE_URL = "https://rudderlabs.com";

const FLUSH_QUEUE_SIZE = 30;

//Generic class to model various properties collection to be provided for messages
class RudderProperty {
    contructor(){
        var propertyMap = new Map();
    }

    getProperty(key){
        return (propertyMap.has(key)?propertyMap.get(key):null);
    }
    
    setProperty (key, value){
        propertyMap.set(key, value);
    }

    hasProperty(key){
        return propertyMap.has(key);
    }

    getPropertyMap(){
        return this.propertyMap;
    }

    setProperty(inputPropertyMap){
        if(!this.propertyMap){
            this.propertyMap = inputPropertyMap;
        } else {
            for(var key of inputPropertyMap.entries()){
                this.propertyMap.set(key, inputPropertyMap.get(key));
            }
        }

    }

}

//Class for building the "page" message payload
class PagePropertyBuilder {
    constructor(){
        this.title = "";
        this.url = "";
        this.path = "";
        this.referrer = "";
        this.search = "";
        this.keywords = "";
    }
    //Build the core constituents of the payload
    build(){
        if (!this.url || 0 === this.url.length){
            throw new Error("Page url cannot be null or empty");
        }
        var pageProperty = new RudderProperty();
        pageProperty.setProperty("title", this.title);
        pageProperty.setProperty("url", this.url);
        pageProperty.setProperty("path", this.path);
        pageProperty.setProperty("referrer", this.referrer);
        pageProperty.setProperty("search", this.search);
        pageProperty.setProperty("keywords", this.keywords);
        return pageProperty;

    }
}

//Class for building the "screen" message payload 
class ScreenPropertyBuilder {
    constructor(){
        this.name = "";
    }

    build(){
        if(!this.name || 0 === this.name){
            throw new Error("Screen name cannot be null or empty");
        }

        var screenProperty = new RudderProperty();
        screenProperty.setProperty("name", this.name);
        return screenProperty;
    }
}


//Class representing e-commerce order object
class ECommerceOrder {
    contructor(){
        this.order_id = "";
        this.affiliation = "";
        this.total = 0;
        this.value = 0;
        this.revenue = 0;
        this.shipping = 0;
        this.tax = 0;
        this.discount = 0;
        this.coupon = "";
        this.currency = "";
        this.products = [];

    }
}

//Class representing e-commerce product object
class ECommerceProduct {
    constructor(){
        this.product_id = "";
        this.sku = "";
        this.category = "";
        this.name = "";
        this.brand = "";
        this.variant = "";
        this.price = 0;
        this.currency = "";
        this.quantity = 0;
        this.coupon = "";
        this.position = 0;
        this.url = "";
        this.image_url = "";
    }
}

//Class representing e-commerce promotion
class ECommercePromotion {
    constructor(){
        this.promotion_id = "";
        this.creative = "";
        this.name = "";
        this.position = 0;
    }

}

//Class representing an e-commerce cart
class ECommerceCart {
    constructor() {
        this.cart_id = "";
        this.products = [];
    }

    addProducts(productsToBeAdded){
        if(productsToBeAdded){ //add only if not-null
            this.products.pushValues(productsToBeAdded);
        }
    }

    addProduct(productToBeAdded){
        if(productToBeAdded){ //add only if not-null
            this.products.push(productToBeAdded);
        }
    }
}

//Class representing e-commerce coupon
class ECommerceCoupon {
    constructor() {
        this.cart_id = "";
        this.order_id = "";
        this.coupon_id = "";
        this.coupon_name = "";
        this.discount = 0;
        this.reason = "";
    }
}
//Class representing e-commerce wishlist
class ECommerceWishList {
    constructor(){
        this.wishlist_id = "";
        this.wishlist_name = "";
    }
    
}



//Class encapsulating checkout details
class ECommerceCheckout {
    constructor(){
        this.checkout_id = "";
        this.order_id = "";
        this.step = "";
        this.shipping_method = "";
        this.payment_method = "";

    }
}

//Class representing "checkout started" event
class CheckoutStartedEvent {
    constructor(){
        this.order = null; //order details as part of the checkout
        this.checkout = null; //checkout details
    }
    
    event (){
        return ECommerceEvents.CHECKOUT_STARTED;
    }

    build(){
        var checkoutProperty = new RudderProperty();
        checkoutProperty.setProperty(convertToMap(this.order));
        checkoutProperty.setProperty(convertToMap(this.checkout));
        return checkoutProperty;
    }
}




//Rudder configration class
var RudderConfig = (function () {

    var instance;

    function init(){

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
                return this.endPointUri;
            },

            getFlushQueueSize: function() {
                return this.flushQueueSize;
            },

            setIntegrations: function(integrations){
                this.integrations = integrations;
            },

            setFlushQueueSize: function(flushQueueSize) {
                this.flushQueueSize = flushQueueSize;
            },

            setEndPointUri: function (endPointUri) {
                this.endPointUri = endPointUri;
            }

        };

    };

    return {
        getDefaultConfig: function() {
            if (!instance){
                instance = init();
            }
            return instance;
        }
    };
    
})();

//Event Repository
class EventRepository {
    contructor(){
        var events = [];
        var eventsBuffer = [];
        var writeKey = null;
        var rudderConfig = null;
    }


}


//Payload class, contains batch of Elements
class RudderPayload {
    constructor(){
        var curDateTime = new Date().toISOString();
        var curDate = curDateTime.split('T')[0];
        var curTimeExceptMillis 
        = curDateTime.split('T')[1].split('Z')[0].split('.')[0];
        var curTimeMillis = curDateTime.split('Z')[0].split('.')[1];
        //console.log(curDate + " " + curTimeExceptMillis + "+" + curTimeMillis);
        this.sent_at = curDate + " " + curTimeExceptMillis + "+" + curTimeMillis;
        this.batch = null;
    }
}

//Individual element class containing Rudder Message
class RudderElement {
    constructor(){
        this.rl_message = new RudderMessage();
    }

    //Setters that in turn set the field values for the contained object
    setType(type){
        this.rl_message.rl_type = type;
    }

    setProperty(rudderProperty){
        this.rl_message.rl_properties = rudderProoperty;
    }

    setUserId(userId){
        this.rl_message.rl_user_id = userId;
    }

    setEventName(eventName){
        this.rl_message.rl_event = eventName;
    }

    updateTraits(traits){
        this.rl_message.rl_context.rl_traits = traits;
    }

    //Set integration enabled/disabled and if enabled, set the destination properties
    addIntegrationProps(integrationKey, isEnabled, destinationProps){
        this.rl_message.rl_integrations.set(integrationKey, isEnabled);
        if (isEnabled){
            this.rl_message.rl_destination_properties.set(integrationKey, destinationProps);
        }
    }

}

//Class responsible for building up the individual elements in a batch
//that is transmitted by the SDK
class RudderElementBuilder {

    constructor(){
        this.rudderProperty = null;
        this.event = null;
        this.userId = null;
        this.channel = null;
    }

    //Set the property
    setProperty(rudderProperty){
        this.rudderProperty = rudderProperty;
        return this;
    }

    //Populate property from a map
    setPropertyMap(propertyMap){
        if (!this.rudderProperty){
            this.rudderProperty = new RudderProperty();
        }
        this.rudderProperty.addProperties(propertyMap);
        return this;
    }
    
    //Build and set the property object
    setPropertyBuilder(rudderPropertyBuilder){
        this.rudderProperty = rudderPropertyBuilder.build();
        return this;
    }

    //Setter methods for all variables. Instance is returned for each call in 
    //accordance with the Builder pattern

    setEvent(event){
        this.event = event;
        return this;
    }

    setUserId (userId) {
        this.userId = userId;
        return this;
    }

    setChannel(channel){
        this.channel = channel;
        return this;
    }

    build(){

        element = new RudderElement();
        element.setUserId(this.userId);
        element.setEventName(this.event);
        element.setProperty(this.rudderProperty);
        return element;
    }

}



//Core message class with default values
class RudderMessage {

    constructor(){
        this.rl_channel = "web";
        this.rl_context = null;
        this.rl_type = null;
        this.rl_action = null;
        this.rl_message_id = generateUUID().toString();
        this.rl_timestamp = new Date().getTime();
        this.rl_anonymous_id = null;
        this.rl_user_id = null;
        this.rl_event = null;
        this.rl_properties = new Map();
        this.rl_integrations = new Map();
        this.rl_destination_properties = new Map();

    }

    //Get property
    getProperty(key){
        return this.rl_properties.get(key);
    }

    //Add property
    addProperty(key, value){
        this.rl_properties.set(key, value);
    }

    //Validate whether this message is semantically valid for the type mentioned
    validateFor (messageType){
        //First check that rl_properties is populated
        if(!this.rl_properties){
            throw new Error("Key rl_properties is required");
        }
        //Event type specific checks
        switch (messageType){
            case MessageType.TRACK:
                //check if rl_event is present
                if (!this.rl_event){
                    throw new Error("Key rl_event is required for track event");
                }
                //Next make specific checks for e-commerce events
                if (this.rl_event in Object.values(ECommerceEvents)){
                    switch(rl_event){
                        case ECommerceEvents.CHECKOUT_STEP_VIEWED:
                        case ECommerceEvents.CHECKOUT_STEP_COMPLETED:
                        case ECommerceEvents.PAYMENT_INFO_ENTERED:
                            checkForKey("checkout_id");
                            checkForKey("step");
                            break;
                        case ECommerceEvents.PROMOTION_VIEWED:
                        case ECommerceEvents.PROMOTION_CLICKED:
                            checkForKey("promotion_id");
                            break;
                        case ECommerceEvents.ORDER_REFUNDED:
                            checkForKey("order_id");
                            break;
                        default:    
                    }
                } else if (!this.rl_properties.has("category") ||
                            !this.rl_properties.get("category")){
                                throw new Error("Key 'category' is required in rl_properties");
                }

                break;
            case MessageType.PAGE:
                break;
            case MessageType.SCREEN:
                if (!this.rl_properties.has("name") ||
                    !this.rl_properties.get("name")){
                        throw new Error("Key 'name' is required in rl_properties");
                }
                break;
        }

    }

    //Function for checking existence of a particular property
    checkForKey(propertyName){
        if(!this.rl_properties.has(propertyName) || 
            !this.rl_properties.get(propertyName)) {
                throw new Error("Key '" + propertyName + "' is required in rl_properties");
            }
    }

    //Utility methods for adding one or more integrations
    addIntegration(platform){
        this.rl_integrations.push(platform);
    }

    addIntegrations(platformArray){
        this.rl_integrations.pushValues(platformArray);
    }
}

//Context class
class RudderContext {
    constructor(){
        this.rl_app = null;
        this.rl_traits = null;
        this.rl_library = null;
        //this.rl_os = null;
        var os = new RudderOSInfo();
        os.rl_version = ""; //skipping version for simplicity now
        var screen = new RudderScreenInfo();

        //Depending on environment within which the code is executing, screen
        //dimensions can be set
        //User agent and locale can be retrieved only for browser
        //For server-side integration, same needs to be set by calling program
        if (typeof window === 'undefined') { //server-side integration
            screen.rl_width = 0;
            screen.rl_height = 0;
            screen.rl_density = 0;
            os.rl_version = "";
            os.rl_name = "";
            this.rl_user_agent = null;
            this.rl_locale = null;
        } else { //running within browser
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
    constructor(){
        this.rl_build = "";
        this.rl_name = "";
        this.rl_namespace = "";
        this.rl_version = "";
    
    }
}

//Traits class
class RudderTraits {
    constructor(){
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
        this.rl_phone = null;
        this.rl_title = null;
        this.rl_username = null;
    }

}

//Class for Address to be embedded in Traits
class TraitsAddress {
    constructor(){
        this.rl_city = "";
        this.rl_country = "";
        this.rl_postalcode = "";
        this.rl_state = "";
        this.rl_street = "";
    }
}

//Class for Company to be embedded in Traits
class TraitsCompany {
    constructor(){
        this.rl_name = "";
        this.rl_id = "";
        this.rl_industry = "";
    }
}


//Library information class
class RudderLibraryInfo {
    constructor(){
        this.rl_name = "";
        this.rl_version = "";
    }
}

//Operating System information class
class RudderOSInfo {
    constructor(){
        this.rl_name = "";
        this.rl_version = "";
    }

}

//Screen information class
class RudderScreenInfo {
    constructor(){
        this.rl_density = 0;
        this.rl_width = 0;
        this.rl_height = 0;
    }
}

//Device information class
class RudderDeviceInfo {

    constructor(){
        this.rl_id = "";
        this.rl_manufacturer = "";
        this.rl_model = "";
        this.rl_name = "";

    }
}

//Carrier information
class RudderNetwork {
     constructor(){
         this.rl_carrier = "";
     }
}

//Singleton implementation of the core SDK client class
var RudderClient = function () {
 
    //Instance stores a reference to the Singleton
    var instance;


    function init() {

        //Private variables and methods
        //Rudder config
        var rudderConfig;

        //Event repository
        var eventRepository;
        

        //Public variables and methods
        return {

            //Initialize integrations
            initiateIntegrations: function (rudderConfig){
                        
            },

            //Track function
            track: function(rudderElement){
                if(rudderElement.rl_message){ //process only if valid message is there
                    rudderElement.rl_message.validateFor(MessageType.TRACK);
                    //validated, now set event type and add to flush queue
                    rudderElement.rl_message.rl_type = MessageType.TRACK;
                    addToFlushQueue(rudderElement);
                }

            },

            //Page function
            page: function(rudderElement){
                if(rudderElement.rl_message){ //process only if valid message is there
                    rudderElement.rl_message.validateFor(MessageType.PAGE);
                    //validated, now set event type and add to flush queue
                    rudderElement.rl_message.rl_type = MessageType.PAGE;
                    addToFlushQueue(rudderElement);
                }

            },

            //Screen function
            screen: function(rudderElement){
                if(rudderElement.rl_message){ //process only if valid message is there
                    rudderElement.rl_message.validateFor(MessageType.SCREEN);
                    //validated, now set event type and add to flush queue
                    rudderElement.rl_message.rl_type = MessageType.SCREEN;
                    addToFlushQueue(rudderElement);
                }

            }

        }
    
    }
   
    return {
   
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function (writeKey) {

            return getInstance(writeKey, RudderConfig.getDefaultConfig());
        },

        getInstance: function (writeKey, rudderConfig){


            if ( !instance ) {

                //Check that valid input object instances have been provided for creating
                //RudderClient instance

                if (!writeKey || 0 === writeKey.length){
                    throw new Error("writeKey cannot be null or empty");
                }

                if(!rudderConfig){
                    throw new Error("rudderConfig cannot be null");
                }

                    
                instance = init();

                //Initialize
                eventRepository = new EventRepository(writeKey, rudderConfig);
                rudderConfig = rudderConfig;

                initiateIntegrations(rudderConfig);
            }

            return instance;
        }

    }
   
};



//Test code 
context = new RudderContext();
context.applicationContext = {};
var Instance1 = RudderClient.getInstance(context);
//console.log(JSON.stringify(new RudderElement()));
var eventRepository = new EventRepository();
eventRepository.rudderConfig = new RudderConfig();



  
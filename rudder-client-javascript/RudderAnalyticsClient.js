//  -----------------------------------------------------------------------
//  <copyright file="RudderAnalyticsClient.js" company="Rudder Labs">
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

//Message Type enumeration
var MessageType = {
    TRACK: "track",
    PAGE: "page",
    SCREEN: "screen",
    IDENTIFY: "identify"
};

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

const BASE_URL = "";

//Singleton implementation of the core SDK client class
var Analytics = (function () {
 
    // Instance stores a reference to the Singleton
    var instance;

   
    function init() {

        //Private variables and methods
        

        //Public variables and methods
        return {

            //Track function
            track: function(event){
                if(event.message){ //process only if valid message is there
                    event.message.validateFor(MessageType.TRACK);
                    //validated, now set event type and add to flush queue
                    event.message.type = MessageType.TRACK.value;
                    addToFlushQueue(event);
                }

            }
        };
    
    };
   
    return {
   
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function (context,
                                flushQueueSize = 10,
                                endPointUri = BASE_URL,
                                shouldCache = true) {

            if ( !instance ) {
                if (!context || !context.applicationContext){
                    throw new Error("Application context cannot be null");
                }

                instance = init();

                //Initialize
                instance.context = context;
                instance.flushQueueSize = flushQueueSize;
                instance.endPointUri = endPointUri;
                instance.shouldCache = shouldCache;
            }

            return instance;
        }

    };
   
})();

//Message payload class
class RudderElement {
    constructor(){
        this.rl_message = new RudderMessage();
        
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
        this.rl_integrations = [];

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
                                throw new Error("Key category is required in rl_properties");
                }

                break;
            case MessageType.PAGE:
                break;
            case MessageType.SCREEN:
                if (!this.rl_properties.has("name") ||
                    !this.rl_properties.get("name")){
                        throw new Error("Key name is required in rl_properties");
                }
                break;
        }

    }

    //Function for checking existence of a particular property
    checkForKey(propertyName){
        if(!this.rl_properties.has(propertyName) || 
            !this.rl_properties.get(propertyName)) {
                throw new Error("Key " + propertyName + " is required in rl_properties");
            }
    }
}

//Context class
class RudderContext {
    constructor(){
        this.rl_app = null;
        this.rl_traits = null;
        this.rl_library = null;
        this.rl_os = null;
        this.rl_screen = null;
        //User agent and locale can be retrieved only for browser
        //For server-side integration, same needs to be set by calling program
        if (typeof window === 'undefined') { //server-side integration
            this.rl_user_agent = null;
            this.rl_locale = null;
        } else { //running within browser
            this.rl_user_agent = navigator.userAgent;
            //property name differs based on browser version
            this.rl_locale = navigator.language || navigator.browserLanguage;
        }
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


//Rudder event class
class RudderEvent {

}

//Test code 
context = new RudderContext();
context.applicationContext = {};
var Instance1 = Analytics.getInstance(context);
console.log(JSON.stringify(new RudderElement()));


  
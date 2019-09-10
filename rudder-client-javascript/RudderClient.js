//  <copyright file="RudderClient.js" company="Rudder Labs">
//   Copyright (c) 2019 Rudder Labs All rights reserved.
//  -----------------------------------------------------------------------
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


//Utility function to get current time (formatted) for including in sent_at field
function getCurrentTimeFormatted (){
    var curDateTime = new Date().toISOString();
    var curDate = curDateTime.split('T')[0];
    var curTimeExceptMillis 
    = curDateTime.split('T')[1].split('Z')[0].split('.')[0];
    var curTimeMillis = curDateTime.split('Z')[0].split('.')[1];
     return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis;

}

//Utility function to retrieve configuration JSON from server
function getJSON(url, callback) {
    if (typeof window === 'undefined') { //server-side integration, XHR is node module
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    }

    //Add query param which would be token


    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
}


//Message Type enumeration
var MessageType = {
    TRACK: "track",
    PAGE: "page",
    //SCREEN: "screen",
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
    ORDER_ID:   "order_id",
    FILTERS:    "filters",
    SORTS:  "sorts"  
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

    
    constructor(){
        this.propertyMap = {};
    }

    
    getPropertyMap(){
        return this.propertyMap;
    }

    getProperty(key){
        return (this.propertyMap[key]);
    }

    setProperty (key, value){
        this.propertyMap[key]=value;
     }
 

    setPropertyMap(inputPropertyMap){
        if(!this.propertyMap){
            this.propertyMap = inputPropertyMap;
        } else {
            Object.keys(inputPropertyMap).forEach(key => {
                this.propertyMap[key]=inputPropertyMap[key];
            });
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

    //Setter methods to align with Builder pattern

    setTitle(title){
        this.title = title;
        return this;
    }

    setUrl(url){
        this.url = url;
        return this;
    }

    setPath(path){
        this.path = path;
        return this;
    }

    setReferrer(referrer){
        this.referrer = referrer;
        return this;
    }

    setSearch(search){
        this.search = search;
        return search;
    }

    setKeywords(keywords){
        this.keywords = keywords;
        return this;
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
    constructor(){
        this.order_id = "";
        this.affiliation = "";
        this.value = 0;
        this.revenue = 0;
        this.shipping = 0;
        this.tax = 0;
        this.discount = 0;
        this.coupon = "";
        this.currency = "";
        this.products = [];

    }

    //Generic setter methods to enable builder pattern
    setOrderId(orderId){
        this.order_id = orderId;
        return this;
    }

    setAffiliation(affiliation){
        this.affiliation = affiliation;
        return this;
    }

    setValue(value){
        this.value = value;
        return this;
    }

    setRevenue(revenue){
        this.revenue = revenue;
        return this;
    }

    setShipping(shipping){
        this.shipping = shipping;
        return true;
    }

    setTax(tax){
        this.tax = tax;
        return this;
    }

    setDiscount(discount){
        this.discount = discount;
        return this;
    }

    setCoupon(coupon){
        this.coupon = coupon;
        return this;
    }

    setCurrency(currency){
        this.currency = currency;
        return this;
    }

    addProducts(productsToBeAdded){
        if(productsToBeAdded){ //add only if not-null
            if (!this.products){ //check for null array
                this.products = [];
            }
            this.products.pushValues(productsToBeAdded);
        }
        return this; //to aid builder pattern
    }

    addProduct(productToBeAdded){
        if(productToBeAdded){ //add only if not-null
            if (!this.products){ //check for null array
                this.products = [];
            }

            this.products.push(productToBeAdded);
        }
        return this; //to aid builder pattern
    }


}
//Class representing e-commerce product filter
class ECommerceProductFilter {
    constructor(){
        this.type = "";
        this.value = "";
    }

    //Setter methods in accordance to Builder pattern 
    setType(type){
        this.type = type;
        return this;
    }

    setValue(value){
        this.value = value;
        return this;
    }
}

//Class representing e-commerce product sort
class ECommerceProductSort {
    constructor(){
        this.type = "";
        this.value = "";
    }

    //Setter methods in accordance to Builder pattern 
    setType(type){
        this.type = type;
        return this;
    }

    setValue(value){
        this.value = value;
        return this;
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

    //Setter methods in accordance with Builder pattern
    setProductId(productId){
        this.product_id = productId;
        return this;
    }

    setSku(sku){
        this.sku = sku;
        return this;
    }

    setCategory(category){
        this.category = category;
        return this;
    }

    setName(name){
        this.name = name;
        return this;
    }

    setBrand(brand){
        this.brand = brand;
        return this;
    }

    setVariant(variant){
        this.variant = variant;
        return this;
    }

    setPrice(price){
        this.price = price;
        return this;
    }

    setCurrency(currency){
        this.currency = currency;
        return this;
    }

    setQuantity(quantity){
        this.quantity = quantity;
        return this;
    }

    setCoupon(coupon){
        this.coupon = coupon;
        return coupon;
    }

    setPosition(position){
        this.position = position;
        return this;
    }

    setUrl(url){
        this.url = url;
        return this;
    }

    setImageUrl(imageUrl){
        this.image_url = imageUrl;
        return this;
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

    //Setter methods in accordance with Builder pattern
    setPromotionId(promotionId){
        this.promotion_id = promotionId;
        return this;
    }

    setCreative(creative){
        this.creative = creative;
        return this;
    }

    setName(name){
        this.name = name;
        return this;
    }

    setPosition(position){
        this.position = position;
        return this;
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
        return this; //to aid builder pattern
    }

    addProduct(productToBeAdded){
        if(productToBeAdded){ //add only if not-null
            this.products.push(productToBeAdded);
        }
        return this; //to aid builder pattern
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

    //Generic setters in accordance with builder pattern
    setWishlistId(wishlistId){
        this.wishlist_id = wishlistId;
        return this;

    }

    setWishlistName(wishlistName){
        this.wishlist_name = wishlistName;
        return this;
    }    
}



//Class encapsulating checkout details
class ECommerceCheckout {
    constructor(){
        this.checkout_id = "";
        this.step = -1;
        this.shipping_method = "";
        this.payment_method = "";

    }

    //Setter methods in accordance to Builder pattern
    setCheckoutId(checkoutId){
        this.checkout_id = checkoutId;
        return this;
    }

    setStep(step){
        this.step = step;
        return this;
    }

    setShippingMethod(shippingMethod){
        this.shipping_method = shippingMethod;
        return this;
    }

    setPaymentMethod(paymentMethod){
        this.payment_method = paymentMethod;
        return this;
    }
}

//Class representing Payment Info
class ECommercePaymentInfo extends ECommerceCheckout {
    constructor(){
        super();
        this.order_id = "";

    }

    //Setter methods in accordance to Builder pattern
    setOrderId(orderId){
        this.order_id = orderId;
        return this;
    }
}

//Parent class of promotion viewed and promotion clicked events
class PromotionEvent {

    constructor(){
        this.promotion = null;
    }

    //Setter method in accordance to Builder pattern
    setPromotion(promotion){
        this.promotion = promotion;
        return this;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.promotion);
        return eventProperty;
    }

}

//Promotion Viewed Event class
class PromotionViewedEvent extends PromotionEvent {

    event(){
        return ECommerceEvents.PROMOTION_VIEWED;
    }
}

class PromotionClickedEvent extends PromotionEvent {

    event(){
        return ECommerceEvents.PROMOTION_CLICKED;
    }
}

//Parent class of "checkout step viewed" and "checkout step completed" events
class CheckoutEvent {
    constructor() {
        this.checkout = null;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.checkout);
        return eventProperty;
    }

    //Setter method in accordance with Builder pattern
    setCheckout(checkout){
        this.checkout = checkout;
        return this;
    }
}

//class representing "Checkout Step Viewed"
class CheckoutStepViewedEvent extends CheckoutEvent {
    event(){
        return ECommerceEvents.CHECKOUT_STEP_VIEWED;
    }
}

//class representing "Checkout Step Completed"
class CheckoutStepCompletedEvent extends CheckoutEvent {
    event(){
        return ECommerceEvents.CHECKOUT_STEP_COMPLETED;
    }
}

//Parent class of "checkout started" and "order completed" events
class OrderEvent {
    constructor(){
        this.order = null; //order details as part of the checkout
    }
    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.order);
        return eventProperty;
    }

    //Generic setter methods to enable builder pattern
    setOrder(order){
        this.order = order;
        return this;
    }

}
//Class representing "checkout started" event
class CheckoutStartedEvent extends OrderEvent{
    event (){
        return ECommerceEvents.CHECKOUT_STARTED;
    }

}


//Class representing order completed event
class OrderCompletedEvent extends OrderEvent {

    event(){
        return ECommerceEvents.ORDER_COMPLETED;
    }

}

//Class representing payment info entered event
class PaymentInfoEnteredEvent {
    constructor(){
        this.paymentInfo = null;
    }

    event() {
        return ECommerceEvents.PAYMENT_INFO_ENTERED;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.paymentInfo);
        return eventProperty;

    }

    //Setter method in accordance with Builder pattern
    setPaymentInfo(paymentInfo){
        this.paymentInfo = paymentInfo;
        return this;
    }

}

//Parent class of "Product Clicked" and "Product Viewed" events
class ProductEvent {
    constructor(){
        this.product = null;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.product);
        return eventProperty;
    }

    //Setters in accordance to Builder pattern
    setProduct(product){
        this.product = product;
        return this;
    }

}

//Class representing "Product Clicked Event"
class ProductClickedEvent extends ProductEvent {
    event() {
        return ECommerceEvents.PRODUCT_CLICKED;
    }
}

//Class representing "Product Viewed Event"
//Class representing "Product Clicked Event"
class ProductViewedEvent extends ProductEvent {
    event() {
        return ECommerceEvents.PRODUCT_VIEWED;
    }
}

//Parent class of "Product Added to Cart" and "Product Removed from Cart" events
class ProductCartEvent {
    constructor(){
        this.product = null;
        this.cartId = null;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.product);
        eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
        return eventProperty;
    }

    //Setter methods in accordance to Builder pattern

    setProduct(product){
        this.product = product;
        return this;
    }

    setCartId(cartId) {
        this.cartId = cartId;
        return this;
    }
}


//Class representing product addition to cart event
class ProductAddedToCartEvent extends ProductCartEvent {

    event(){
        return ECommerceEvents.PRODUCT_ADDED;
    }

}

//Class for representing product removed event
class ProductRemovedFromCartEvent extends ProductCartEvent {
    event(){
        return ECommerceEvents.PRODUCT_REMOVED;
    }
}


//Class representing product addition to cart event
class ProductAddedToWishlistEvent {
    constructor(){
        this.product = null;
        this.wishlist = null;
    }

    event(){
        return ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setPropertyMap(this.product);
        eventProperty.setProperty(ECommerceParamNames.WISHLIST_ID, 
            this.wishlist.wishlist_id);
        eventProperty.setProperty(ECommerceParamNames.WISHLIST_NAME,
            this.wishlist.wishlist_name);
                
        return eventProperty;
    }

    //Generic setter methods in alignment with builder pattern
    setProduct(product){
        this.product = product;
        return this;
    }

    setWishlist(wishlist){
        this.wishlist = wishlist;
        return this;
    }
}

//Class representing product list view
class ProductListViewedEvent {
    constructor(){
        this.listId = null;
        this.category = null;
        this.products = [];
    }
    
    //Setter methods in accordance to Builder pattern

    setListId(listId){
        this.listId = listId;
        return this;
    }

    setCategory(category){
        this.category = category;
        return this;
    }

    addProducts(products){
        if (!this.products){
            this.products = products;
        } else {
            this.products.pushValues(products);
        }
        return this;
        
    }

    addProduct(product){
        if(!this.products){
            this.products = [];
        }
        this.products.push(product);
        return this;
    }


    event(){
        return ECommerceEvents.PRODUCT_LIST_VIEWED;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setProperty(ECommerceParamNames.LIST_ID, this.listId);
        eventProperty.setProperty(ECommerceParamNames.CATEGORY, this.category);
        eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
        return eventProperty;
    }

}

//Class representing "Product List Filtered" event
class ProductListFilteredEvent {
    constructor(){
        this.listId = null;
        this.filters = [];
        this.sorts = [];
        this.products = [];
    }
    
    //Setter methods in accordance to Builder pattern

    setListId(listId){
        this.listId = listId;
        return this;
    }

    addProducts(products){
        if (!this.products){
            this.products = products;
        } else {
            this.products.pushValues(products);
        }
        return this;
        
    }

    addProduct(product){
        if(!this.products){
            this.products = [];
        }
        this.products.push(product);
        return this;
    }

    addFilters(filters){
        if (!this.filters){
            this.filters = filters;
        } else {
            this.filters.pushValues(filters);
        }
        return this;
        
    }

    addFilter(filter){
        if(!this.filters){
            this.filters = [];
        }
        this.filters.push(filter);
        return this;
    }

    addSorts(sorts){
        if (!this.sorts){
            this.sorts = sorts;
        } else {
            this.sorts.pushValues(sorts);
        }
        return this;
        
    }

    addSort(sort){
        if(!this.sorts){
            this.sorts = [];
        }
        this.sorts.push(sort);
        return this;
    }


    event(){
        return ECommerceEvents.PRODUCT_LIST_FILTERED;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setProperty(ECommerceParamNames.LIST_ID, this.listId);
        eventProperty.setProperty(ECommerceParamNames.FILTERS, this.filters);
        eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
        eventProperty.setProperty(ECommerceParamNames.SORTS, this.sorts);
        return eventProperty;
    }

}

//Class representing "Cart Viewed" event
class CartViewedEvent {
    constructor(){
        this.cartId = null;
        this.products = [];
    }

    
    addProducts(products){
        if (!this.products){
            this.products = products;
        } else {
            this.products.pushValues(products);
        }
        return this; //keeping code aligned with builder pattern
        
    }

    addProduct(product){
        if(!this.products){
            this.products = [];
        }
        this.products.push(product);
        return this; //keeping code aligned with builder pattern
    }

    setCartId(cartId){
        this.cartId = cartId;
        return this; //builder pattern
    }

    event(){
        return ECommerceEvents.CART_VIEWED;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
        eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
        return eventProperty;
    }

}





//Class for representing product searched event
class ProductSearchedEvent {
    constructor(){
        this.query = null;
    }

    event(){
        return ECommerceEvents.PRODUCTS_SEARCHED;
    }

    build(){
        var eventProperty = new RudderProperty();
        eventProperty.setProperty(ECommerceParamNames.QUERY, this.query);
        return eventProperty;
    }

    //Getter method in accordance with builder pattern
    setQuery(query){
        this.query = query;
        return this;
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
                return endPointUri;
            },

            getFlushQueueSize: function() {
                return this.flushQueueSize;
            },

            getIntegrations: function() {
                return this.integrations;
            },

            setIntegrations: function(integrations){
                this.integrations = integrations;
                return this;
            },

            setFlushQueueSize: function(flushQueueSize) {
                this.flushQueueSize = flushQueueSize;
                return this;
            },

            setEndPointUri: function (endPointUri) {
                this.endPointUri = endPointUri;
                return this;
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
    constructor(writeKey, rudderConfig){

        this.eventsBuffer = [];
        this.write_key = writeKey;
        this.rudderConfig = rudderConfig;

        /*
        //Not implementing right now since for JavaScript we're not using 
        //native SDKs
        getJSON(BASE_URL, function(err, data){
            if(err){
                throw new Error("unable to download configurations from server");
            } else {
                //parse the json response and populate the configuration JSON                
                //TO-DO
            }
        });
        */

    }

    flush(rudderElement){

        //For Javascript SDK, event will be transmitted immediately
        //so buffer is really kept to be in alignment with other SDKs
        this.eventsBuffer = [];

        
        this.eventsBuffer.push(rudderElement); //Add to event buffer
        

        //construct payload
        var payload = new RudderPayload();
        payload.batch = this.eventsBuffer; 
        payload.write_key = this.write_key;
        payload.sent_at = getCurrentTimeFormatted();

        if (typeof window === 'undefined') { //server-side integration, XHR is node module
            var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        }
    
        var xhr = new XMLHttpRequest();

        console.log(JSON.stringify(payload));

        xhr.open("POST", this.rudderConfig.getEndPointUri(), true);
        xhr.setRequestHeader("Content-Type", "application/json");

        //register call back to reset event buffer on successfull POST
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.eventsBuffer = []; //reset event buffer
            } 
        };
        xhr.send(JSON.stringify(payload));

    }

}


//Payload class, contains batch of Elements
class RudderPayload {
    constructor(){
        this.batch = null;
        this.write_key = null;
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
    
        this.rl_message.rl_properties = rudderProperty;

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
    setProperty(inputRudderProperty){
        this.rudderProperty = inputRudderProperty;
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
        this.channel  = channel;
        return this;
    }

    build(){

        var element = new RudderElement();
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
        this.rl_integrations["all"]=true;
    }

    //Get property
    getProperty(key){
        return this.rl_properties[key];
    }

    //Add property
    addProperty(key, value){
        this.rl_properties[key]=value;
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
                } else if (!this.rl_properties["rl_category"]){
                                //if rl_category is not there, set to rl_event
                                this.rl_properties["rl_category"] = this.rl_event;
                }

                break;
            case MessageType.PAGE:
                break;
            case MessageType.SCREEN:
                if (!this.rl_properties["name"]){
                        throw new Error("Key 'name' is required in rl_properties");
                }
                break;
        }

    }

    //Function for checking existence of a particular property
    checkForKey(propertyName){
        if(!this.rl_properties[propertyName]) {
                throw new Error("Key '" + propertyName + "' is required in rl_properties");
            }
    }

}

//Context class
class RudderContext {
    constructor(){
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
        this.rl_build = "1.0.0";
        this.rl_name = "RudderLabs JavaScript SDK";
        this.rl_namespace = "com.rudderlabs.javascript";
        this.rl_version = "1.0.0";
    
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
        this.rl_title = null;
        this.rl_username = null;
    }

    //Setter methods to aid Builder pattern
    setAddress(address){
        this.rl_address = address;
        return this;    
    }

    setAge(age){
        this.rl_age = age;
        return this;
    }

    setBirthday(birthday){
        this.rl_birthday = birthday;
        return this;

    }

    setCompany(company) {
        this.rl_company = company;
        return this;
    }

    setCreatedAt(createAt){
        this.rl_createdat = createdAt;
        return this;
    }

    setDescription(description){
        this.rl_description = description;
        return this;
    }

    setEmail(email){
        this.rl_email = email;
        return this;
    }
    
    setFirstname(firstname){
        this.rl_firstname = firstname;
        return this;
    }

    setId(id){
        this.rl_id = id;
        return this;
    }

    setLastname(lastname){
        this.rl_lastname = lastname;
        return this;
    }

    setName(name){
        this.rl_name = name;
        return this;
    }

    setPhone(phone){
        this.rl_phone = phone;
        return this;
    }
    
    setTitle(title){
        this.rl_title = title;
        return this;
    }

    setUsername(username){
        this.rl_username = username;
        return this;
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
        this.rl_name = "RudderLabs JavaScript SDK";
        this.rl_version = "1.0.0";
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
var RudderClient = (function () {
 
    //Instance stores a reference to the Singleton
    var instance;

    //Private variables and methods
    //Rudder config
    var rudderConfig;

    //Event repository
    var eventRepository;

    //Track function
    //TO-DO: Add code for target-provided SDK integrations when implemented
    function track (rudderElement){
        if(rudderElement.rl_message){ //process only if valid message is there
            rudderElement.rl_message.validateFor(MessageType.TRACK);
            //validated, now set event type and add to flush queue
            rudderElement.rl_message.rl_type = MessageType.TRACK;
            //check if rl_category is populated under rl_properties, 
            //else use the rl_event value
            if (!rudderElement.rl_message.rl_properties["rl_category"]){
                rudderElement.rl_message.rl_properties["rl_category"] 
                = rudderElement.rl_message.rl_event;
            }
            eventRepository.flush(rudderElement);
        }

    }

    //Page function
    //TO-DO: Add code for target-provided SDK integrations when implemented
    function page (rudderElement){
        
        if(rudderElement.rl_message){ //process only if valid message is there
            rudderElement.rl_message.validateFor(MessageType.PAGE);
            //validated, now set event type and add to flush queue
            rudderElement.rl_message.rl_type = MessageType.PAGE;
            eventRepository.flush(rudderElement);
        }

    }

    //Screen call removed as it does not make sense in a web SDK


    //Identify function
    //TO-DO: Add code for target-provided SDK integrations when implemented
    function identify (rudderTraits) {
        var rudderElement 
        = new RudderElementBuilder().setEvent(MessageType.IDENTIFY).setUserId(rudderTraits.rl_id).build();
        rudderElement.updateTraits(rudderTraits);
        rudderElement.setType(MessageType.IDENTIFY);
        eventRepository.flush(rudderElement);
        
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

                this.rudderConfig = rudderConfig;

            }

            return instance;
        }

    }
   
})();



//Test code 
var client 
= RudderClient.getInstance("dummykey", RudderConfig.getDefaultConfig().setFlushQueueSize(1));

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
                setEvent(ECommerceEvents.ORDER_COMPLETED).
                setProperty(new CheckoutStartedEvent().
                setOrder(new ECommerceOrder().setOrderId("Dummy Order 4").
                addProduct(new ECommerceProduct().setName("Dummy Product 4")).
                addProduct(new ECommerceProduct().setName("Dummy Product 5"))).
                build().getPropertyMap()).
                build());
*/

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

/*
                
client.track(new RudderElementBuilder().
                setEvent(ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST).
                setProperty(new ProductAddedToWishlistEvent().
                setProduct(new ECommerceProduct().setName("Dummy Product 2")).
                setWishlist(new ECommerceWishList().setWishlistId("Dummy Wishlist 1").
                setWishlistName("Dummy Wishlist 1")).
                build().getPropertyMap()).
                build());    



*/




  
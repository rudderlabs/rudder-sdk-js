var RudderProperty = require("./RudderProperty");
var ECommerceEvents = require("./constants").ECommerceEvents;
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Class representing "Cart Viewed" event
class CartViewedEvent {
  constructor() {
    this.cartId = null;
    this.products = [];
  }

  addProducts(products) {
    if (!this.products) {
      this.products = products;
    } else {
      this.products.pushValues(...products);
    }
    return this; //keeping code aligned with builder pattern
  }

  addProduct(product) {
    if (!this.products) {
      this.products = [];
    }
    this.products.push(product);
    return this; //keeping code aligned with builder pattern
  }

  setCartId(cartId) {
    this.cartId = cartId;
    return this; //builder pattern
  }

  event() {
    return ECommerceEvents.CART_VIEWED;
  }

  build() {
    var eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
    eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
    return eventProperty;
  }
}

module.exports = {
  CartViewedEvent: CartViewedEvent
};

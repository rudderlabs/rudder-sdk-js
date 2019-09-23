var ShareEvent = require("./ShareEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;
var ECommerceParamNames = require("./constants").ECommerceParamNames;

class CartSharedEvent extends ShareEvent {
  constructor() {
    super();
    this.cart_id = "";
    this.products = [];
  }

  event() {
    return ECommerceEvents.CART_SHARED;
  }

  build() {
    var eventProperty = super.build();
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cart_id);
    eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
    return eventProperty;
  }

  //Setter methods in accordance with Builder pattern
  setCartId(cartId) {
    this.cart_id = cartId;
    return this;
  }

  addProduct(product) {
    if (!this.products) {
      //add array if null
      this.products = [];
    }
    this.products.push(product);
    return this;
  }
}

module.exports = {
  CartSharedEvent: CartSharedEvent
};

const RudderProperty = require("./RudderProperty");
const { ECommerceEvents } = require("./constants");
const { ECommerceParamNames } = require("./constants");

// Class representing "Cart Viewed" event
class CartViewedEvent {
  constructor() {
    this.cartId = null;
    this.products = [];
  }

  addProducts(products) {
    if (!this.products) {
      this.products = products;
    } else {
      this.products.push(...products);
    }
    return this; // keeping code aligned with builder pattern
  }

  addProduct(product) {
    if (!this.products) {
      this.products = [];
    }
    this.products.push(product);
    return this; // keeping code aligned with builder pattern
  }

  setCartId(cartId) {
    this.cartId = cartId;
    return this; // builder pattern
  }

  event() {
    return ECommerceEvents.CART_VIEWED;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
    eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
    return eventProperty;
  }
}

module.exports = {
  CartViewedEvent,
};

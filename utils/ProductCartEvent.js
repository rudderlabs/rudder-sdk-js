const RudderProperty = require("./RudderProperty");
const { ECommerceParamNames } = require("./constants");

// Parent class of "Product Added to Cart" and "Product Removed from Cart" events
class ProductCartEvent {
  constructor() {
    this.product = null;
    this.cartId = null;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.product);
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
    return eventProperty;
  }

  // Setter methods in accordance to Builder pattern

  setProduct(product) {
    this.product = product;
    return this;
  }

  setCartId(cartId) {
    this.cartId = cartId;
    return this;
  }
}

module.exports = {
  ProductCartEvent,
};

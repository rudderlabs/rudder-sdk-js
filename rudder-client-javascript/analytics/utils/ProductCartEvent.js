var RudderProperty = require("./RudderProperty");
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Parent class of "Product Added to Cart" and "Product Removed from Cart" events
class ProductCartEvent {
  constructor() {
    this.product = null;
    this.cartId = null;
  }

  build() {
    var eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.product);
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cartId);
    return eventProperty;
  }

  //Setter methods in accordance to Builder pattern

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
  ProductCartEvent: ProductCartEvent
};

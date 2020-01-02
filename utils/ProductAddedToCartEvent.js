var ProductCartEvent = require("./ProductCartEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing product addition to cart event
class ProductAddedToCartEvent extends ProductCartEvent {
  event() {
    return ECommerceEvents.PRODUCT_ADDED;
  }
}

module.exports = {
  ProductAddedToCartEvent: ProductAddedToCartEvent
};

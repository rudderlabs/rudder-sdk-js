const ProductCartEvent = require("./ProductCartEvent");
const { ECommerceEvents } = require("./constants");

// Class representing product addition to cart event
class ProductAddedToCartEvent extends ProductCartEvent {
  event() {
    return ECommerceEvents.PRODUCT_ADDED;
  }
}

module.exports = {
  ProductAddedToCartEvent,
};

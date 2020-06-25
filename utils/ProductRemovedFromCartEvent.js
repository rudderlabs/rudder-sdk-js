const ProductCartEvent = require("./ProductCartEvent");
const { ECommerceEvents } = require("./constants");

// Class for representing product removed event
class ProductRemovedFromCartEvent extends ProductCartEvent {
  event() {
    return ECommerceEvents.PRODUCT_REMOVED;
  }
}

module.exports = {
  ProductRemovedFromCartEvent,
};

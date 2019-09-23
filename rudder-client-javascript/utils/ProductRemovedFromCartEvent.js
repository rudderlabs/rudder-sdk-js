var ProductCartEvent = require("./ProductCartEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class for representing product removed event
class ProductRemovedFromCartEvent extends ProductCartEvent {
  event() {
    return ECommerceEvents.PRODUCT_REMOVED;
  }
}

module.exports = {
  ProductRemovedFromCartEvent: ProductRemovedFromCartEvent
};

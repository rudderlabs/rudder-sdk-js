var ECommerceEvents = require("./constants").ECommerceEvents;
var ProductEvent = require("./ProductEvent");

//Class representing "Product Clicked Event"
class ProductClickedEvent extends ProductEvent {
  event() {
    return ECommerceEvents.PRODUCT_CLICKED;
  }
}

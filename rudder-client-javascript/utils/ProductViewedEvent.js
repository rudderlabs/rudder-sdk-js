var ProductEvent = require("./ProductEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing "Product Viewed Event"
//Class representing "Product Clicked Event"
class ProductViewedEvent extends ProductEvent {
  event() {
    return ECommerceEvents.PRODUCT_VIEWED;
  }
}

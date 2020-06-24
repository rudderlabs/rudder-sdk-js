const ProductEvent = require("./ProductEvent");
const { ECommerceEvents } = require("./constants");

// Class representing "Product Viewed Event"
// Class representing "Product Clicked Event"
class ProductViewedEvent extends ProductEvent {
  event() {
    return ECommerceEvents.PRODUCT_VIEWED;
  }
}

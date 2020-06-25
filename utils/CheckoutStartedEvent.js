const OrderEvent = require("./OrderEvent");
const { ECommerceEvents } = require("./constants");

// Class representing "checkout started" event
class CheckoutStartedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STARTED;
  }
}

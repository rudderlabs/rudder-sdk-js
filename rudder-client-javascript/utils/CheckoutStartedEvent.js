var OrderEvent = require("./OrderEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing "checkout started" event
class CheckoutStartedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STARTED;
  }
}

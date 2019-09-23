var CheckoutEvent = require("./CheckoutEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//class representing "Checkout Step Viewed"
class CheckoutStepViewedEvent extends CheckoutEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STEP_VIEWED;
  }
}

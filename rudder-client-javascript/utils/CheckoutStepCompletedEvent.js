var CheckoutEvent = require("./CheckoutEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//class representing "Checkout Step Completed"
class CheckoutStepCompletedEvent extends CheckoutEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STEP_COMPLETED;
  }
}

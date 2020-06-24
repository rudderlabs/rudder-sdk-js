const CheckoutEvent = require("./CheckoutEvent");
const { ECommerceEvents } = require("./constants");

// class representing "Checkout Step Viewed"
class CheckoutStepViewedEvent extends CheckoutEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STEP_VIEWED;
  }
}

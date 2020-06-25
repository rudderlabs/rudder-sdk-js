const CheckoutEvent = require("./CheckoutEvent");
const { ECommerceEvents } = require("./constants");

// class representing "Checkout Step Completed"
class CheckoutStepCompletedEvent extends CheckoutEvent {
  event() {
    return ECommerceEvents.CHECKOUT_STEP_COMPLETED;
  }
}

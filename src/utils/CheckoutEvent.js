const RudderProperty = require("./RudderProperty");

// Parent class of "checkout step viewed" and "checkout step completed" events
class CheckoutEvent {
  constructor() {
    this.checkout = null;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.checkout);
    return eventProperty;
  }

  // Setter method in accordance with Builder pattern
  setCheckout(checkout) {
    this.checkout = checkout;
    return this;
  }
}

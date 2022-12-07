const RudderProperty = require("./RudderProperty");

// Parent class for order and checkout events
class OrderEvent {
  constructor() {
    this.order = null; // order details as part of the checkout
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.order);
    return eventProperty;
  }

  // Generic setter methods to enable builder pattern
  setOrder(order) {
    this.order = order;
    return this;
  }
}

module.exports = {
  OrderEvent,
};

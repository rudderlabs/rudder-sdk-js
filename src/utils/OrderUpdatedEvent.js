const OrderEvent = require("./OrderEvent");
const { ECommerceEvents } = require("./constants");

// Class representing order updated event
class OrderUpdatedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_UPDATED;
  }
}

module.exports = {
  OrderUpdatedEvent,
};

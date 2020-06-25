const OrderEvent = require("./OrderEvent");
const { ECommerceEvents } = require("./constants");
// Class representing order completed event
class OrderCompletedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_COMPLETED;
  }
}

module.exports = {
  OrderCompletedEvent,
};

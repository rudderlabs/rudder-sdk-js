const OrderEvent = require("./OrderEvent");
const { ECommerceEvents } = require("./constants");

// Class representing order refunded event
class OrderRefundedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_REFUNDED;
  }
}

module.exports = {
  OrderRefundedEvent,
};

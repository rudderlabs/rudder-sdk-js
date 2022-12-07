const OrderEvent = require("./OrderEvent");
const { ECommerceEvents } = require("./constants");

class OrderCancelledEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_CANCELLED;
  }
}

module.exports = {
  OrderCancelledEvent,
};

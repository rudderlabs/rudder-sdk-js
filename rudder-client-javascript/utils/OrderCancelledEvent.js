var OrderEvent = require("./OrderEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

class OrderCancelledEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_CANCELLED;
  }
}

module.exports = {
  OrderCancelledEvent: OrderCancelledEvent
};

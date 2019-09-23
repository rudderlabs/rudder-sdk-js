var OrderEvent = require("./OrderEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing order refunded event
class OrderRefundedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_REFUNDED;
  }
}

module.exports = {
  OrderRefundedEvent: OrderRefundedEvent
};

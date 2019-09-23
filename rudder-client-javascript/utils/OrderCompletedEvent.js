var OrderEvent = require("./OrderEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;
//Class representing order completed event
class OrderCompletedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_COMPLETED;
  }
}

module.exports = {
  OrderCompletedEvent: OrderCompletedEvent
};

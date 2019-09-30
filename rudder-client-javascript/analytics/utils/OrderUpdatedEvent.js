var OrderEvent = require("./OrderEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing order updated event
class OrderUpdatedEvent extends OrderEvent {
  event() {
    return ECommerceEvents.ORDER_UPDATED;
  }
}

module.exports = {
  OrderUpdatedEvent: OrderUpdatedEvent
};

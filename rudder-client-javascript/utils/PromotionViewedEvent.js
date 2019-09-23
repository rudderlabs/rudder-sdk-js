var PromotionEvent = require("./PromotionEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;
//Promotion Viewed Event class
class PromotionViewedEvent extends PromotionEvent {
  event() {
    return ECommerceEvents.PROMOTION_VIEWED;
  }
}

module.exports = {
  PromotionViewedEvent: PromotionViewedEvent
};

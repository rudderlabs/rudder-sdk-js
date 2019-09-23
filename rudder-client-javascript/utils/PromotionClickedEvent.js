var PromotionEvent = require("./PromotionEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

class PromotionClickedEvent extends PromotionEvent {
  event() {
    return ECommerceEvents.PROMOTION_CLICKED;
  }
}

module.exports = {
  PromotionClickedEvent: PromotionClickedEvent
};

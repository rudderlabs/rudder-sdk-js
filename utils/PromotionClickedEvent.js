const PromotionEvent = require("./PromotionEvent");
const { ECommerceEvents } = require("./constants");

class PromotionClickedEvent extends PromotionEvent {
  event() {
    return ECommerceEvents.PROMOTION_CLICKED;
  }
}

module.exports = {
  PromotionClickedEvent,
};

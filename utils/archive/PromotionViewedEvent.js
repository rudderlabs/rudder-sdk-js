// var PromotionEvent = require("./PromotionEvent");
// var ECommerceEvents = require("./constants").ECommerceEvents;
import PromotionEvent from "./PromotionEvent";
import { ECommerceEvents } from "./constants";
// Promotion Viewed Event class
class PromotionViewedEvent extends PromotionEvent {
  constructor() {
    super();
  }

  event() {
    return ECommerceEvents.PROMOTION_VIEWED;
  }
}

export default PromotionViewedEvent;

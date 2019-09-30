var CouponEvent = require("./CouponEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing coupon applied event
class CouponAppliedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_APPLIED;
  }
}

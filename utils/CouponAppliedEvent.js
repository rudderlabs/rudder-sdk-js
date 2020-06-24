const CouponEvent = require("./CouponEvent");
const { ECommerceEvents } = require("./constants");

// Class representing coupon applied event
class CouponAppliedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_APPLIED;
  }
}

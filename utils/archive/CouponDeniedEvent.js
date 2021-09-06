const CouponEvent = require("./CouponEvent");
const { ECommerceEvents } = require("./constants");

// class representing coupon denied event
class CouponDeniedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_DENIED;
  }
}

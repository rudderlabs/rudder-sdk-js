var CouponEvent = require("./CouponEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//class representing coupon denied event
class CouponDeniedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_DENIED;
  }
}

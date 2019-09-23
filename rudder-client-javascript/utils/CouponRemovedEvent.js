var CouponEvent = require("./CouponEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//class representing coupon removed event
class CouponRemovedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_REMOVED;
  }
}

module.exports = {
  CouponRemovedEvent: CouponRemovedEvent
};

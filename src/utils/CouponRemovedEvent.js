const CouponEvent = require("./CouponEvent");
const { ECommerceEvents } = require("./constants");

// class representing coupon removed event
class CouponRemovedEvent extends CouponEvent {
  event() {
    return ECommerceEvents.COUPON_REMOVED;
  }
}

module.exports = {
  CouponRemovedEvent,
};

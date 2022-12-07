const RudderProperty = require("./RudderProperty");

// Parent class for Coupon events
class CouponEvent {
  contructor() {
    this.coupon = null;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.coupon);
    return eventProperty;
  }

  // Setter method in accordance with Builder pattern
  setCoupon(coupon) {
    this.coupon = coupon;
    return this;
  }
}

module.exports = {
  CouponEvent,
};

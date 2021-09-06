// Class representing e-commerce coupon
class ECommerceCoupon {
  constructor() {
    this.order_id = "";
    this.cart_id = "";
    this.coupon_id = "";
  }

  // Generic setter methods in accordance with builder pattern
  setOrderId(orderId) {
    this.order_id = orderId;
    return this;
  }

  setCartId(cartId) {
    this.cart_id = cartId;
    return this;
  }

  setCouponId(couponId) {
    this.coupon_id = couponId;
    return this;
  }
}

module.exports = {
  ECommerceCoupon,
};

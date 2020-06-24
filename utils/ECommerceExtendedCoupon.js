const ECommerceCoupon = require("./ECommerceCoupon");

// Class representing e-commerce coupon with added coupon_name property
class ECommerceExtendedCoupon extends ECommerceCoupon {
  constructor() {
    super();
    this.coupon_name = "";
  }

  // Setter method in accordance to Builder pattern
  setCouponName(name) {
    this.coupon_name = name;
    return this;
  }
}

// Class representing e-commerce coupon for application or removal
class ECommerceAppliedOrRemovedCoupon extends ECommerceExtendedCoupon {
  constructor() {
    super();
    this.discount = 0;
  }

  // Setter method in accordance to Builder pattern
  setDiscount(discount) {
    this.discount = discount;
    return this;
  }
}

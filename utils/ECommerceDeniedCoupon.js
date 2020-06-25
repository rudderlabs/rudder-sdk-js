const ECommerceExtendedCoupon = require("./ECommerceExtendedCoupon");

// Class representing denied e-commerce coupon
class ECommerceDeniedCoupon extends ECommerceExtendedCoupon {
  constructor() {
    super();
    this.reason = "";
  }

  // Setter method in accordance to Builder pattern
  setReason(reason) {
    this.reason = reason;
    return this;
  }
}
// Class representing e-commerce wishlist
class ECommerceWishList {
  constructor() {
    this.wishlist_id = "";
    this.wishlist_name = "";
  }

  // Generic setters in accordance with builder pattern
  setWishlistId(wishlistId) {
    this.wishlist_id = wishlistId;
    return this;
  }

  setWishlistName(wishlistName) {
    this.wishlist_name = wishlistName;
    return this;
  }
}

module.exports = {
  ECommerceDeniedCoupon,
};

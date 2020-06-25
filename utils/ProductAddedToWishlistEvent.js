const ProductWishlistEvent = require("./ProductWishListEvent");
const { ECommerceEvents } = require("./constants");

// Class representing product added to wishlist event
class ProductAddedToWishlistEvent extends ProductWishlistEvent {
  event() {
    return ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST;
  }
}

module.exports = {
  ProductAddedToWishlistEvent,
};

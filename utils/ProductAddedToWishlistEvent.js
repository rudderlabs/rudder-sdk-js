var ProductWishlistEvent = require("./ProductWishListEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing product added to wishlist event
class ProductAddedToWishlistEvent extends ProductWishlistEvent {
  event() {
    return ECommerceEvents.PRODUCT_ADDED_TO_WISHLIST;
  }
}

module.exports = {
  ProductAddedToWishlistEvent: ProductAddedToWishlistEvent
};

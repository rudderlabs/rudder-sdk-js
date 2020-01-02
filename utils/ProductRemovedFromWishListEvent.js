var ProductWishlistEvent = require("./ProductWishListEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;

//Class representing product removed from wishlist
class ProductRemovedFromWishlistEvent extends ProductWishlistEvent {
  event() {
    return ECommerceEvents.PRODUCT_REMOVED_FROM_WISHLIST;
  }
}

module.exports = {
  ProductRemovedFromWishlistEvent: ProductRemovedFromWishlistEvent
};

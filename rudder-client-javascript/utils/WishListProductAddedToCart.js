var ProductWishlistEvent = require("./ProductWishListEvent");
var ECommerceEvents = require("./constants").ECommerceEvents;
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Class representing wishlist product added to cart event
class WishlistProductAddedToCartEvent extends ProductWishlistEvent {
  constructor() {
    super();
    this.cart_id = "";
  }

  event() {
    return ECommerceEvents.WISH_LIST_PRODUCT_ADDED_TO_CART;
  }

  //Need to add cart_id in build part
  build() {
    var eventProperty = super.build();
    eventProperty.setProperty(ECommerceParamNames.CART_ID, this.cart_id);
    return eventProperty;
  }

  //Setter method in accordance to Builder pattern
  setCartId(cartId) {
    this.cart_id = cartId;
    return this;
  }
}

module.exports = {
  WishlistProductAddedToCartEvent: WishlistProductAddedToCartEvent
};

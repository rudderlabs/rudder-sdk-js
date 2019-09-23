var RudderProperty = require("./RudderProperty");
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Parent class for Product-to-Wishlist events
class ProductWishlistEvent {
  constructor() {
    this.product = null;
    this.wishlist = null;
  }

  build() {
    var eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.product);
    eventProperty.setProperty(
      ECommerceParamNames.WISHLIST_ID,
      this.wishlist.wishlist_id
    );
    eventProperty.setProperty(
      ECommerceParamNames.WISHLIST_NAME,
      this.wishlist.wishlist_name
    );

    return eventProperty;
  }

  //Generic setter methods in alignment with builder pattern
  setProduct(product) {
    this.product = product;
    return this;
  }

  setWishlist(wishlist) {
    this.wishlist = wishlist;
    return this;
  }
}

module.exports = {
  ProductWishlistEvent: ProductWishlistEvent
};

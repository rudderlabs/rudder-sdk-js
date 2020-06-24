const RudderProperty = require("./RudderProperty");
const { ECommerceEvents } = require("./constants");

// Class representing Product Reviewed event
class ProductReviewedEvent {
  constructor() {
    this.product_id = "";
    this.review_id = "";
    this.review_body = "";
    this.rating = "";
  }

  event() {
    return ECommerceEvents.PRODUCT_REVIEWED;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this);
    return eventProperty;
  }

  // Setter methods in accordance with Builder pattern
  setProductId(productId) {
    this.product_id = productId;
    return this;
  }

  setReviewId(reviewId) {
    this.review_id = reviewId;
    return this;
  }

  setReviewBody(reviewBody) {
    this.review_body = reviewBody;
    return this;
  }

  setRating(rating) {
    this.rating = rating;
    return this;
  }
}

module.exports = {
  ProductReviewedEvent,
};

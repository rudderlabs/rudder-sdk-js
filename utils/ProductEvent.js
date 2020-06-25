const RudderProperty = require("./RudderProperty");

// Parent class of "Product Clicked" and "Product Viewed" events
class ProductEvent {
  constructor() {
    this.product = null;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.product);
    return eventProperty;
  }

  // Setters in accordance to Builder pattern
  setProduct(product) {
    this.product = product;
    return this;
  }
}

module.exports = {
  ProductEvent,
};

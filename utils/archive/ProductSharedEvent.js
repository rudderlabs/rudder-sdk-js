const ShareEvent = require("./ShareEvent");
const { ECommerceEvents } = require("./constants");

// Class representing product share
class ProductSharedEvent extends ShareEvent {
  constructor() {
    super();
    this.product = null;
  }

  build() {
    const eventProperty = super.build();
    eventProperty.setPropertyMap(this.product);
    return eventProperty;
  }

  event() {
    return ECommerceEvents.PRODUCT_SHARED;
  }

  // Setter method in accordance to Builder pattern
  setProduct(product) {
    this.product = product;
    return this;
  }
}

module.exports = {
  ProductSharedEvent,
};

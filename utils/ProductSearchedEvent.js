const RudderProperty = require("./RudderProperty");
const { ECommerceEvents } = require("./constants");
const { ECommerceParamNames } = require("./constants");

// Class for representing product searched event
class ProductSearchedEvent {
  constructor() {
    this.query = null;
  }

  event() {
    return ECommerceEvents.PRODUCTS_SEARCHED;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.QUERY, this.query);
    return eventProperty;
  }

  // Getter method in accordance with builder pattern
  setQuery(query) {
    this.query = query;
    return this;
  }
}

module.exports = {
  ProductSearchedEvent,
};

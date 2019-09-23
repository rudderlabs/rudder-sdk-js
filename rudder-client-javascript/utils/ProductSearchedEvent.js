var RudderProperty = require("./RudderProperty");
var ECommerceEvents = require("./constants").ECommerceEvents;
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Class for representing product searched event
class ProductSearchedEvent {
  constructor() {
    this.query = null;
  }

  event() {
    return ECommerceEvents.PRODUCTS_SEARCHED;
  }

  build() {
    var eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.QUERY, this.query);
    return eventProperty;
  }

  //Getter method in accordance with builder pattern
  setQuery(query) {
    this.query = query;
    return this;
  }
}

module.exports = {
  ProductSearchedEvent: ProductSearchedEvent
};

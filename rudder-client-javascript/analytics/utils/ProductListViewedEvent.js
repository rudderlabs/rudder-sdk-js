var RudderProperty = require("./RudderProperty");
var ECommerceEvents = require("./constants").ECommerceEvents;
var ECommerceParamNames = require("./constants").ECommerceParamNames;

//Class representing product list view
class ProductListViewedEvent {
  constructor() {
    this.listId = null;
    this.category = null;
    this.products = [];
  }

  //Setter methods in accordance to Builder pattern

  setListId(listId) {
    this.listId = listId;
    return this;
  }

  setCategory(category) {
    this.category = category;
    return this;
  }

  addProducts(products) {
    if (!this.products) {
      this.products = products;
    } else {
      this.products.pushValues(products);
    }
    return this;
  }

  addProduct(product) {
    if (!this.products) {
      this.products = [];
    }
    this.products.push(product);
    return this;
  }

  event() {
    return ECommerceEvents.PRODUCT_LIST_VIEWED;
  }

  build() {
    var eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.LIST_ID, this.listId);
    eventProperty.setProperty(ECommerceParamNames.CATEGORY, this.category);
    eventProperty.setProperty(ECommerceParamNames.PRODUCTS, this.products);
    return eventProperty;
  }
}

module.exports = {
  ProductListViewedEvent: ProductListViewedEvent
};

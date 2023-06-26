/* eslint-disable no-param-reassign */

// here we map the properties which give information about a singleproduct
const PRODUCT_EVENTS = ['product clicked', 'product viewed', 'product added'];
const ORDER_EVENTS = [
  'cart viewed',
  'checkout started',
  'order completed',
  'order cancelled',
  'order updated',
];

const productEvent = properties => {
  if (properties.price) {
    properties.adroll_conversion_value = properties.price;
    delete properties.price;
  }
  return properties;
};

// here we map the properties which give information about the order
// like order_id or revenue

const orderEvent = properties => {
  if (properties.orderId) {
    properties.order_id = properties.orderId;
    delete properties.orderId;
  }
  if (properties.revenue) {
    properties.adroll_conversion_value = properties.revenue;
    delete properties.revenue;
  } else {
    let productRevenue = 0;
    if (properties.products) {
      properties.products.forEach(product => {
        productRevenue += product.price;
      });
    }
    properties.adroll_conversion_value = productRevenue;
  }
  if (properties.currency) {
    properties.adroll_currency = properties.currency;
    delete properties.currency;
  }
  return properties;
};

export { PRODUCT_EVENTS, ORDER_EVENTS, productEvent, orderEvent };

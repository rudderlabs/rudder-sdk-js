/* eslint-disable no-param-reassign */
const productEvent = (properties) => {
  if (properties.price) {
    properties.adroll_conversion_value = properties.price;
    delete properties.price;
  }
  return properties;
};

const orderEvent = (properties) => {
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
      properties.products.forEach((product) => {
        productRevenue += product.price;
      });
    }
    properties.adroll_conversion_value = productRevenue;
  }
  return properties;
};

export { productEvent, orderEvent };

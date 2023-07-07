// here we map the properties which give information about a singleproduct
const PRODUCT_EVENTS = ['product clicked', 'product viewed', 'product added'];
const ORDER_EVENTS = [
  'cart viewed',
  'checkout started',
  'order completed',
  'order cancelled',
  'order updated',
];

const productEvent = (properties) => {
  const { price, ...props } = properties;

  if (price) {
    props.adroll_conversion_value = price;
  }

  return props;
};

// here we map the properties which give information about the order
// like order_id or revenue

const orderEvent = (properties) => {
  const { orderId, revenue, products, currency, ...props } = properties;

  if (orderId) {
    props.order_id = orderId;
  }

  if (revenue) {
    props.adroll_conversion_value = revenue;
  } else if (products && products.length > 0) {
    const productRevenue = products.reduce((total, product) => total + product.price, 0);
    props.adroll_conversion_value = productRevenue;
  }

  if (currency) {
    props.adroll_currency = currency;
  }

  return props;
};

export { PRODUCT_EVENTS, ORDER_EVENTS, productEvent, orderEvent };

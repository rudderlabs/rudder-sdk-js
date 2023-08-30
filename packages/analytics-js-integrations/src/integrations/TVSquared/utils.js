/**
 * Returns formatted revenue
 * @param {*} revenue
 * @returns
 */
const formatRevenue = revenue => parseFloat(revenue.toString().replace(/^[^\d.]*/, ''));

/**
 * Returns action object
 * @param {*} message
 * @param {*} metrics
 */
const getAction = (message, metrics) => {
  const { properties } = message;
  const {
    revenue,
    productType,
    category,
    order_id: orderId,
    promotion_id: promotionId,
  } = properties;

  const action = {
    rev: revenue ? formatRevenue(revenue) : '',
    prod: category || productType || '',
    id: orderId || '',
    promo: promotionId || '',
  };

  const customMetrics = metrics.filter(m => m.propertyName !== '');
  customMetrics.forEach(customMetric => {
    const key = customMetric.propertyName;
    const value = properties[key];
    if (value) {
      action[key] = value;
    }
  });
};

export { getAction, formatRevenue };

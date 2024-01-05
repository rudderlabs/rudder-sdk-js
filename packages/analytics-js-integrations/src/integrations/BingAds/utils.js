const EXCLUSION_KEYS = [
  'event',
  'category',
  'category_id',
  'currency',
  'total',
  'value',
  'revenue',
  'ecomm_category',
  'transaction_id',
  'order_id',
  'checkout_id',
  'ecomm_pagetype',
  'pagetype',
  'query',
  'products',
  'product_id',
  'sku',
  'event_action',
  'items',
];

const DEFAULT_PAGETYPE = 'other';

const buildCommonPayload = message => {
  const { event, properties = {} } = message;
  const { category, currency, total, value, revenue } = properties;
  const payload = {
    event_label: event,
    event_category: category,
    currency,
    revenue_value: total || value || revenue,
  };
  return payload;
};

const handleProductsArray = properties => {
  const productIds = [];
  const items = [];

  const products = Array.isArray(properties.products) ? properties.products : [properties];

  products.forEach(product => {
    const { product_id: pId, sku, price, quantity = 1 } = product;
    const productId = pId || sku;

    if (productId) {
      productIds.push(productId);
      const item = { id: productId, quantity };
      if (price && !Number.isNaN(price)) {
        item.price = price;
      }
      items.push(item);
    }
  });

  const payload = {};
  if (items.length > 0) {
    payload.ecomm_prodid = productIds;
    payload.items = items;
  }

  return payload;
};

const buildEcommPayload = message => {
  const { properties = {} } = message;
  const {
    category_id: categoryId,
    total,
    value,
    ecomm_category: ecommCategory,
    transaction_id: transactionId,
    order_id: orderId,
    checkout_id: checkoutId,
    ecomm_pagetype: ecommPageType,
    pagetype,
    query,
  } = properties;

  const ecommPayload = {
    ecomm_totalvalue: total || value,
    search_term: query,
    ecomm_query: query,
    ecomm_category: ecommCategory || categoryId,
    transaction_id: transactionId || orderId || checkoutId,
    ecomm_pagetype: ecommPageType || pagetype || DEFAULT_PAGETYPE,
  };
  const payload = handleProductsArray(properties);

  return { ...ecommPayload, ...payload };
};

export {
  buildCommonPayload,
  buildEcommPayload,
  handleProductsArray,
  EXCLUSION_KEYS,
  DEFAULT_PAGETYPE,
};
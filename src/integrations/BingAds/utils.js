/* eslint-disable camelcase */
import logger from '../../utils/logUtil';

const ECOMM_PAGE_TYPES = [
  'home',
  'category',
  'searchresults',
  'product',
  'cart',
  'purchase',
  'other',
];

const EXCLUSION_KEYS = [
  'event',
  'category',
  'currency',
  'total',
  'value',
  'revenue',
  'ecommCategory',
  'transaction_id',
  'order_id',
  'checkout_id',
  'ecommPageType',
  'pagetype',
  'query',
  'products',
  'product_id',
  'sku',
  'eventAction',
];

const allowedEcommPageType = (pageType) =>
  !!(pageType && ECOMM_PAGE_TYPES.includes(pageType.trim().toLowerCase()));

const buildCommonPayload = (message) => {
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

const handleProductsArray = (properties) => {
  const productIds = [];
  const items = [];
  let ecommTotalValue = 0;
  const { products } = properties;
  if (Array.isArray(products)) {
    products.forEach((product) => {
      if (product) {
        const { product_id, sku, price, quantity = 1 } = product;
        const productId = product_id || sku;
        if (productId) {
          productIds.push(productId);
          items.push({
            id: productId,
            quantity,
            price,
          });
          if (price) {
            ecommTotalValue += parseFloat(price) * parseInt(quantity, 10);
          }
        }
      }
    });
  }

  if (items.length === 0) {
    const { product_id, sku, price, quantity = 1 } = properties;
    const productId = product_id || sku;
    if (productId) {
      productIds.push(productId);
      items.push({
        id: productId,
        quantity,
        price,
      });
      if (price) {
        ecommTotalValue = parseFloat(price) * parseInt(quantity, 10);
      }
    }
  }

  const payload = {};
  if (items.length > 0) {
    payload.ecomm_prodid = productIds;
    payload.items = items;
    if (ecommTotalValue !== 0) {
      payload.ecomm_totalvalue = ecommTotalValue;
    }
  }
  return payload;
};

const buildEcommPayload = (message) => {
  const { properties = {} } = message;
  const {
    category,
    total,
    value,
    revenue,
    ecommCategory,
    transaction_id,
    order_id,
    checkout_id,
    ecommPageType,
    pagetype,
    query,
  } = properties;
  const ecommPayload = {
    ecomm_totalvalue: total || value || revenue,
    search_term: query,
    ecomm_query: query,
    ecomm_category: ecommCategory || category,
    transaction_id: transaction_id || order_id || checkout_id,
  };
  const pageType = ecommPageType || pagetype;

  if (allowedEcommPageType(pageType)) {
    ecommPayload.ecomm_pagetype = pageType;
  } else if (pageType) {
    logger.warn(
      `'${pageType}' is not a valid 'pagetype'. Hence, dropping this parameter. Valid values are: [${ECOMM_PAGE_TYPES.join(
        ', ',
      )}]`,
    );
  }

  const payload = handleProductsArray(properties);
  if (ecommPayload.ecomm_totalvalue) {
    // giving priority to total, value, revenue
    delete payload.ecomm_totalvalue;
  }
  return { ...ecommPayload, ...payload };
};

export {
  buildCommonPayload,
  buildEcommPayload,
  allowedEcommPageType,
  handleProductsArray,
  EXCLUSION_KEYS,
};

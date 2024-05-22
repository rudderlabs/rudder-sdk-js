import sha256 from 'crypto-js/sha256';
import get from 'get-value';
import { isDefinedAndNotNull } from '../../utils/commonUtils';

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

/**
 * Formats the email and hashes the email
 * Docs for formatting email
 * https://help.ads.microsoft.com/apex/index/3/en/60178#:~:text=do%20so%20manually.-,Format%20and%20hash%20the%20data,-Format%20the%20data
 * @param {*} emailString
 * @returns  hash of finalised email and if it is invalid returns undefined
 */
const formatAndHashEmailAddress = emailString => {
  // Remove whitespaces from the beginning and end of the email address and lower case it
  let email = emailString.trim().toLowerCase();

  // Remove everything between “+” and “@”
  email = email.replace(/\+[^@]+/g, '');

  // Remove any periods that come before “@”
  email = email.replace(/\./g, (match, offset) => {
    if (offset < email.indexOf('@')) {
      return '';
    }
    return match;
  });

  /* Make sure 
  1. email address contains “@” sign 
  2. there is a period after “@” 
  3. it doesn't start or end with a period
  */
  if (
    !email.includes('@') ||
    !/\.\w+$/.test(email) ||
    email.startsWith('.') ||
    email.endsWith('.')
  ) {
    return undefined;
  }

  // Remove any spaces
  email = email.replace(/\s/g, '');

  // Remove any accents (ex: à)
  email = email.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Calculate and return the SHA256 hash of the final email address
  return sha256(email).toString();
};

/**
 * Format and Hash PhoneNumber
 * @param {*} phoneNumber
 * @returnsformatted and hashed phone number
 */
function formatAndHashPhoneNumber(phoneNumber) {
  // Remove any non-digit characters
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the phone number starts with a '+' sign
  const formattedPhoneNumber = cleanedPhoneNumber.startsWith('+')
    ? cleanedPhoneNumber
    : `+${cleanedPhoneNumber}`;

  // Calculate and return the SHA256 hash of the formatted phone number
  return sha256(formattedPhoneNumber).toString();
}

/**
 * Constructing Pid Payload
 * @param {*} context
 */
const constructPidPayload = message => {
  const email = get(message, 'context.traits.email') || get(message, 'traits.email');
  const phone = get(message, 'context.traits.phone') || get(message, 'traits.phone');
  const pid = {};
  if (isDefinedAndNotNull(email)) {
    pid.em = formatAndHashEmailAddress(email);
  }
  if (isDefinedAndNotNull(phone)) {
    pid.ph = formatAndHashPhoneNumber(phone);
  }
  /* Docs: https://help.ads.microsoft.com/apex/index/3/en/60178
  Bing ads says if anyone one of the properties is not available 
  and one is available then we need to send empty string as variable name for the one that is missing
   */
  if (
    (isDefinedAndNotNull(email) && !isDefinedAndNotNull(phone)) ||
    (!isDefinedAndNotNull(email) && isDefinedAndNotNull(phone))
  ) {
    pid[''] = '';
  }

  // If both email and phone are not present or are not in correct format we won't be able to do enhance conversion return undefined
  if (!isDefinedAndNotNull(pid.em) && !isDefinedAndNotNull(pid.ph)) return undefined;
  return pid;
};
export {
  buildCommonPayload,
  buildEcommPayload,
  handleProductsArray,
  EXCLUSION_KEYS,
  DEFAULT_PAGETYPE,
  constructPidPayload,
};

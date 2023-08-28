import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import {
  isNotEmpty,
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
} from '../../utils/commonUtils';

const orderIdKey = 'properties.order_id';
const itemIdKey = 'properties.item_ids';
const productsKey = 'properties.products';
const productIdKey = 'properties.product_id';
const productIdNotPresentMessage = 'product_id is not present';

const eventSpecificPayloadMap = {
  'order completed': {
    itemIdsKey: productsKey,
    transactionIdKey: orderIdKey,
  },
  'checkout started': {
    itemIdsKey: productsKey,
    transactionIdKey: orderIdKey,
  },
  'product added': {
    itemIdsKey: productIdKey,
  },
  'payment info entered': {
    itemIdsKey: itemIdKey,
    transactionIdKey: 'properties.checkout_id',
  },
  'promotion clicked': {
    itemIdsKey: itemIdKey,
  },
  'promotion viewed': {
    itemIdsKey: itemIdKey,
  },
  'product added to wishlist': {
    itemIdsKey: productIdKey,
  },
  'product viewed': {
    itemIdsKey: productIdKey,
  },
  'product list viewed': {
    itemIdsKey: productsKey,
  },
  'products searched': {
    itemIdsKey: itemIdKey,
    searchStringKey: 'properties.query',
  },
};

const sendEvent = (event, payload) => {
  if (isNotEmpty(payload)) {
    window.snaptr('track', event, payload);
  } else {
    window.snaptr('track', event);
  }
};

const getCommonEventPayload = (message, deduplicationKey, enableDeduplication) => {
  let payload = {
    price: parseFloat(
      get(message, 'properties.price') ||
        get(message, 'properties.value') ||
        get(message, 'properties.revenue'),
    ),
    client_deduplication_id: get(message, 'properties.client_deduplication_id'),
    currency: get(message, 'properties.currency'),
    transaction_id:
      get(message, 'properties.transactionId') || get(message, 'properties.transaction_id'),
    item_category: get(message, 'properties.category'),
    description: get(message, 'properties.description'),
    search_string: get(message, 'properties.search_string'),
    number_items: parseInt(
      get(message, 'properties.number_items') || get(message, 'properties.quantity'),
      10,
    ),
    payment_info_available: parseInt(get(message, 'properties.payment_info_available'), 10),
    sign_up_method: get(message, 'properties.sign_up_method'),
    success: parseInt(get(message, 'properties.success'), 10),
  };
  if (payload.payment_info_available !== 0 && payload.payment_info_available !== 1) {
    payload.payment_info_available = null;
  }
  if (payload.success !== 0 && payload.success !== 1) {
    payload.success = null;
  }
  if (enableDeduplication) {
    payload.client_deduplication_id = get(message, `${deduplicationKey || 'messageId'}`);
  }

  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

const eventPayload = (message, deduplicationKey, enableDeduplication) => {
  let payload = getCommonEventPayload(message, deduplicationKey, enableDeduplication);
  payload.item_ids = get(message, itemIdKey);
  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

/**
 * Returns productIds
 * @param {*} message
 * @returns
 */
const getItemIds = message => {
  let itemIds = [];
  const products = get(message, productsKey);
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      const productId = element.product_id;
      if (productId) {
        itemIds.push(productId);
      } else {
        logger.debug(`product_id not present for product at index ${index}`);
      }
    });
  } else {
    itemIds = null;
  }
  return itemIds;
};

/**
 * Returns productId
 * @param {*} message
 * @returns
 */
const getItemId = message => {
  let itemIds = [];
  const productId = get(message, productIdKey);
  if (isDefinedAndNotNull(productId)) {
    itemIds.push(productId);
  } else {
    logger.debug(productIdNotPresentMessage);
    itemIds = null;
  }
  return itemIds;
};

/**
 * Returns ecom events payload
 * @param {*} event
 * @param {*} message
 * @param {*} deduplicationKey
 * @param {*} enableDeduplication
 * @returns
 */
const ecommEventPayload = (event, message, deduplicationKey, enableDeduplication) => {
  const eventName = event.toLowerCase().trim();
  const specificPayload = eventSpecificPayloadMap[eventName];
  let payload = getCommonEventPayload(message, deduplicationKey, enableDeduplication);

  if (specificPayload) {
    const { itemIdsKey, transactionIdKey, searchStringKey } = specificPayload;
    let itemIds = [];

    if (itemIdsKey === productsKey) {
      itemIds = getItemIds(message);
    } else if (itemIdsKey === productIdKey) {
      itemIds = getItemId(message);
    } else {
      itemIds = get(message, itemIdsKey);
    }

    payload = {
      ...payload,
      item_ids: itemIds,
    };

    if (transactionIdKey) {
      payload.transaction_id = get(message, transactionIdKey);
    }

    if (searchStringKey) {
      payload.search_string = get(message, searchStringKey);
    }
  }
  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

/*
 Here, We take user parameters in payload i.e. userEmail and userPhoneNumber and hashMethod, so if hashMethod is `sha256`,
 then we convert the userEmail and userPhoneNumber to user_hashed_email and user_hashed_phone_number respectively in `sha256` format.
 Otherwise if hashMethod not in `sha256` then we pass the userEmail and userPhoneNumber as user_email and user_phone_number respectively.
*/
const getUserEmailAndPhone = (hashMethod, userEmail, userPhoneNumber) => {
  const payload = {};
  if (hashMethod === 'sha256') {
    if (userEmail) {
      payload.user_hashed_email = sha256(userEmail).toString();
    }
    if (userPhoneNumber) {
      payload.user_hashed_phone_number = sha256(userPhoneNumber).toString();
    }
  } else {
    if (userEmail) {
      payload.user_email = userEmail;
    }
    if (userPhoneNumber) {
      payload.user_phone_number = userPhoneNumber;
    }
  }
  return payload;
};

export { sendEvent, ecommEventPayload, eventPayload, getUserEmailAndPhone };

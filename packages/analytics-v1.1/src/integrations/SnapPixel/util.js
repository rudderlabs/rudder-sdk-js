import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import logger from '../../utils/logUtil';
import {
  isDefinedAndNotNull,
  isNotEmpty,
  removeUndefinedAndNullValues,
} from '../../utils/commonUtils';

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
  payload.item_ids = get(message, 'properties.item_ids');
  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

const ecommEventPayload = (event, message, deduplicationKey, enableDeduplication) => {
  let payload = getCommonEventPayload(message, deduplicationKey, enableDeduplication);
  switch (event.toLowerCase().trim()) {
    case 'order completed': {
      let itemIds = [];
      const products = get(message, 'properties.products');
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          const pId = element.product_id;
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(`product_id not present for product at index ${index}`);
          }
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, 'properties.order_id'),
        item_ids: itemIds,
      };
      break;
    }
    case 'checkout started': {
      let itemIds = [];
      const products = get(message, 'properties.products');
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          const pId = element.product_id;
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(`product_id not present for product at index ${index}`);
          }
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, 'properties.order_id'),
        item_ids: itemIds,
      };
      break;
    }
    case 'product added': {
      let itemIds = [];
      const pId = get(message, 'properties.product_id');
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        logger.debug('product_id is not present');
        itemIds = null;
      }
      payload = {
        ...payload,
        item_ids: itemIds,
      };
      break;
    }
    case 'payment info entered':
      payload = {
        ...payload,
        transaction_id: get(message, 'properties.checkout_id'),
        item_ids: get(message, 'properties.item_ids'),
      };
      break;
    case 'promotion clicked':
      payload = {
        ...payload,
        item_ids: get(message, 'properties.item_ids'),
      };
      break;
    case 'promotion viewed':
      payload = {
        ...payload,
        item_ids: get(message, 'properties.item_ids'),
      };
      break;
    case 'product added to wishlist': {
      let itemIds = [];
      const pId = get(message, 'properties.product_id');
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        logger.debug('product_id is not present');
        itemIds = null;
      }
      payload = {
        ...payload,
        item_ids: itemIds,
      };
      break;
    }
    case 'product viewed': {
      let itemIds = [];
      const pId = get(message, 'properties.product_id');
      if (pId) {
        itemIds.push(pId);
      } else {
        logger.debug('product_id is not present');
        itemIds = null;
      }
      payload = {
        ...payload,
        item_ids: itemIds,
      };
      break;
    }
    case 'product list viewed': {
      let itemIds = [];
      const products = get(message, 'properties.products');
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          const pId = get(element, 'product_id');
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(`product_id not present for product at index ${index}`);
          }
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        item_ids: itemIds,
      };
      break;
    }
    case 'products searched':
      payload = {
        ...payload,
        search_string: get(message, 'properties.query'),
        item_ids: get(message, 'properties.item_ids'),
      };
      break;
    default:
      break;
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

import get from "get-value";
import logger from "../../utils/logUtil";
import {
  isDefinedAndNotNull,
  isNotEmpty,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";

const sendEvent = (event, payload) => {
  if (isNotEmpty(payload)) {
    window.snaptr("track", event, payload);
  } else {
    window.snaptr("track", event);
  }
};

const eventPayload = (message) => {
  let payload = {
    price: get(message, "properties.price"),
    currency: get(message, "properties.currency"),
    transaction_id: get(message, "properties.transaction_id"),
    item_ids: get(message, "properties.item_ids"),
    item_category: get(message, "properties.category"),
    description: get(message, "properties.description"),
    search_string: get(message, "properties.search_string"),
    number_items: get(message, "properties.number_items"),
    payment_info_available: get(message, "properties.payment_info_available"),
    sign_up_method: get(message, "properties.sign_up_method"),
    success: get(message, "properties.success"),
    client_deduplication_id: get(message, "properties.client_deduplication_id"),
  };

  if (
    payload.payment_info_available !== 0 &&
    payload.payment_info_available !== 1
  ) {
    payload.payment_info_available = null;
  }
  if (payload.success !== 0 && payload.success !== 1) {
    payload.success = null;
  }

  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

const ecommEventPayload = (event, message) => {
  let payload = {
    price: get(message, "properties.price"),
    currency: get(message, "properties.currency"),
    item_category: get(message, "properties.category"),
    description: get(message, "properties.description"),
    search_string: get(message, "properties.search_string"),
    number_items: get(message, "properties.number_items"),
    payment_info_available: get(message, "properties.payment_info_available"),
    sign_up_method: get(message, "properties.sign_up_method"),
    success: get(message, "properties.success"),
    transaction_id: get(message, "properties.transaction_id"),
  };

  switch (event.toLowerCase().trim()) {
    case "order completed": {
      let itemIds = [];
      const products = get(message, "properties.products");
      if (isDefinedAndNotNull(products)) {
        products.forEach((element, index) => {
          const pId = element.product_id;
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(
              `product_id not present for product at index ${index}`
            );
          }
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.order_id"),
        item_ids: itemIds,
      };
      break;
    }
    case "checkout started": {
      let itemIds = [];
      const products = get(message, "properties.products");
      if (isDefinedAndNotNull(products)) {
        products.forEach((element, index) => {
          const pId = element.product_id;
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(
              `product_id not present for product at index ${index}`
            );
          }
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.order_id"),
        item_ids: itemIds,
      };
      break;
    }
    case "product added": {
      let itemIds = [];
      const pId = get(message, "properties.product_id");
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        logger.debug("product_id is not present");
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transaction_id"),
        item_ids: itemIds,
      };
      break;
    }
    case "payment info entered":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.checkout_id"),
        item_ids: get(message, "properties.item_ids"),
      };
      break;
    case "promotion clicked":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transaction_id"),
        item_ids: get(message, "properties.item_ids"),
      };
      break;
    case "promotion viewed":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transaction_id"),
        item_ids: get(message, "properties.item_ids"),
      };
      break;
    case "product added to wishlist": {
      let itemIds = [];
      const pId = get(message, "properties.product_id");
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        logger.debug("product_id is not present");
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transaction_id"),
        item_ids: itemIds,
      };
      break;
    }
    case "product viewed": {
      const itemIds = [];
      itemIds.push(get(message, "properties.product_id"));
      payload = {
        ...payload,
        item_ids: itemIds,
      };
      break;
    }
    case "product list viewed": {
      let itemIds = [];
      const products = get(message, "properties.products");
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          const pId = get(element, "product_id");
          if (pId) {
            itemIds.push(pId);
          } else {
            logger.debug(
              `product_id not present for product at index ${index}`
            );
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
    case "products searched":
      payload = {
        ...payload,
        search_string: get(message, "properties.query"),
      };
      break;
    default:
      break;
  }

  if (
    payload.payment_info_available !== 0 &&
    payload.payment_info_available !== 1
  ) {
    payload.payment_info_available = null;
  }
  if (payload.success !== 0 && payload.success !== 1) {
    payload.success = null;
  }

  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

export { sendEvent, ecommEventPayload, eventPayload };

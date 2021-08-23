import get from "get-value";
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
    transaction_id: get(message, "properties.transactionId"),
    item_ids: get(message, "properties.itemIds"),
    item_category: get(message, "properties.category"),
    description: get(message, "properties.description"),
    search_string: get(message, "properties.searchString"),
    number_items: get(message, "properties.numberItems"),
    payment_info_available: get(message, "properties.paymentInfoAvailable"),
    sign_up_method: get(message, "properties.signUpMethod"),
    success: get(message, "properties.success"),
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
    search_string: get(message, "properties.searchString"),
    number_items: get(message, "properties.numberItems"),
    payment_info_available: get(message, "properties.paymentInfoAvailable"),
    sign_up_method: get(message, "properties.signUpMethod"),
    success: get(message, "properties.success"),
  };

  switch (event.toLowerCase()) {
    case "order completed": {
      let itemIds = [];
      const products = get(message, "properties.products");
      if (isDefinedAndNotNull(products)) {
        products.forEach((element) => {
          const pId = element.productId;
          itemIds.push(pId);
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.orderId"),
        item_ids: itemIds,
      };
      break;
    }
    case "checkout started": {
      let itemIds = [];
      const products = get(message, "properties.products");
      if (isDefinedAndNotNull(products)) {
        products.forEach((element) => {
          const pId = element.productId;
          itemIds.push(pId);
        });
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.orderId"),
        item_ids: itemIds,
      };
      break;
    }
    case "product added": {
      let itemIds = [];
      const pId = get(message, "properties.productId");
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transactionId"),
        item_ids: itemIds,
      };
      break;
    }
    case "payment info entered":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.checkoutId"),
        item_ids: get(message, "properties.itemIds"),
      };
      break;
    case "promotion clicked":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transactionId"),
        item_ids: get(message, "properties.itemIds"),
      };
      break;
    case "promotion viewed":
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transactionId"),
        item_ids: get(message, "properties.itemIds"),
      };
      break;
    case "product added to wishlist": {
      let itemIds = [];
      const pId = get(message, "properties.productId");
      if (isDefinedAndNotNull(pId)) {
        itemIds.push(pId);
      } else {
        itemIds = null;
      }
      payload = {
        ...payload,
        transaction_id: get(message, "properties.transactionId"),
        item_ids: itemIds,
      };
      break;
    }
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

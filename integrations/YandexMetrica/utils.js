import get from "get-value";
import logger from "../../utils/logUtil";

import { removeUndefinedAndNullValues } from "../utils/commonUtils";

const sendEvent = (container, payload) => {
  window[container].push(payload);
};

const eventMapping = {
  order_completed: "purchase",
  product_viewed: "detail",
  product_list_viewed: "detail",
  product_added: "add",
  product_removed: "remove",
};

const itemProperties = (properties) => {
  const productProperties = {
    id: properties.product_id || properties.sku,
    name: properties.name,
    brand: properties.brand,
    category: properties.category,
    coupon: properties.coupon,
    position: properties.position,
    price: parseFloat(properties.price),
    quantity: parseInt(properties.price, 10),
    variant: properties.variant,
  };
  return productProperties;
};
const populatePayload = (eventType, properties) => {
  const payload = {};
  const products = [];
  products.push(itemProperties(properties));
  payload.ecommerce = {
    ...payload.ecommerce,
    currencyCode: properties.currency,
    [eventType]: { products },
  };
  if (eventType === "purchase") {
    if (!properties.order_id) {
      logger.error("order_id is required for event type purchase");
    }
    const actionField = {
      id: properties.order_id,
      coupon: properties.revenue,
      goal_id: parseInt(properties.goal_id, 10),
      revenue: parseFloat(properties.revenue),
    };
    payload.ecommerce[eventType].actionField = actionField;
  }
  return payload;
};

const commonEventPayload = (eventType, properties) => {
  let responsePayload = {};
  if (!(properties.product_id || properties.name)) {
    logger.error(`None of product_id or name is present for the product`);
  } else {
    responsePayload = populatePayload(eventType, properties);
  }
  return removeUndefinedAndNullValues(responsePayload);
};

const ecommEventPayload = (event, message) => {
  let responsePayload = {};
  const trimmedEvent = event.trim().replace(/\s+/g, "_");
  switch (trimmedEvent) {
    case "order_completed": {
      const products = get(message, "properties.products");
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          if (!(element.product_id || element.name)) {
            logger.error(
              `None of product_id or name is present for product at index ${index}`
            );
          } else {
            responsePayload = populatePayload(
              eventMapping[trimmedEvent],
              element
            );
          }
        });
      } else {
        logger.error(`None of product_id or name is present`);
      }
      break;
    }
    case "product_added": {
      const { properties } = message;
      if (!(properties.product_id || properties.name)) {
        logger.error(`None of product_id or name is present for the product`);
      } else {
        responsePayload = populatePayload(
          eventMapping[trimmedEvent],
          properties
        );
      }
      break;
    }
    case "product_removed": {
      const { properties } = message;
      if (!(properties.product_id || properties.name)) {
        logger.error(`None of product_id or name is present for the product`);
      } else {
        responsePayload = populatePayload(
          eventMapping[trimmedEvent],
          properties
        );
      }
      break;
    }
    case "product viewed": {
      const { properties } = message;
      if (!(properties.product_id || properties.name)) {
        logger.error(`None of product_id or name is present for the product`);
      } else {
        responsePayload = populatePayload(
          eventMapping[trimmedEvent],
          properties
        );
      }
      break;
    }
    case "product list viewed": {
      const products = get(message, "properties.products");
      if (products && Array.isArray(products)) {
        products.forEach((element, index) => {
          if (!(element.product_id || element.name)) {
            logger.error(
              `None of product_id or name is present for product at index ${index}`
            );
          } else {
            responsePayload = populatePayload(
              eventMapping[trimmedEvent],
              element
            );
          }
        });
      } else {
        logger.error(`None of product_id or name is present`);
      }
      break;
    }
    default:
      break;
  }

  return removeUndefinedAndNullValues(responsePayload);
};

export { sendEvent, ecommEventPayload, commonEventPayload, eventMapping };

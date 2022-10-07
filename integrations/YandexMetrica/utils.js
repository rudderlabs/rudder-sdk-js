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
  return removeUndefinedAndNullValues(productProperties);
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
      coupon: properties.coupon,
      goal_id: parseInt(properties.goal_id, 10),
      revenue: parseFloat(properties.revenue),
    };
    payload.ecommerce[eventType].actionField = actionField;
  }
  return payload;
};

const ecommEventPayload = (eventType, properties) => {
  let responsePayload = {};
  const { products } = properties;
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      if (!(element.product_id || element.name)) {
        logger.error(
          `None of product_id or name is present for product at index ${index}`
        );
      } else {
        responsePayload = populatePayload(eventType, element);
      }
    });
  } else if (!(properties.product_id || properties.name)) {
    logger.error(`None of product_id or name is present for the product`);
  } else {
    responsePayload = populatePayload(eventType, properties);
  }
  return removeUndefinedAndNullValues(responsePayload);
};

export { sendEvent, ecommEventPayload, eventMapping };

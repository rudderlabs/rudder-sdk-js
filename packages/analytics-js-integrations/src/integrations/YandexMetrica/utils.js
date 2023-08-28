import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import {
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues,
} from '../../utils/commonUtils';

// This function is used for sending the track event to yandex.metrica
const sendEvent = (container, payload) => {
  window[container].push(payload);
};

// This object is defined to map the default rudder event to yandex.metrica event
const ecommerceEventMapping = {
  order_completed: 'purchase',
  product_viewed: 'detail',
  product_list_viewed: 'detail',
  product_added: 'add',
  product_removed: 'remove',
};

// This function is used to map the product properties
const itemProperties = properties => {
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

/**
 *This function is used to populate the payload with ecommerce object with each product's properties
 * @param {*} eventType
 * @param {*} properties
 * @param {*} products
 * @returns
 */

const populatePayload = (eventType, properties, products) => {
  const payload = {};
  products.push(itemProperties(properties));
  payload.ecommerce = {
    ...payload.ecommerce,
    currencyCode: properties.currency,
    [eventType]: { products },
  };
  return payload;
};

/**
 * Returns actionField
 * @param {*} properties
 * @param {*} goalId
 * @returns
 */
const getActionField = (properties, goalId) => {
  const { order_id: orderId, coupon, revenue } = properties;
  const actionField = {
    id: orderId,
    coupon,
    goal_id: goalId,
    revenue,
  };

  // converting the goal_id and revenue in actionField to int and float type
  actionField.goal_id = actionField.goal_id
    ? parseInt(actionField.goal_id, 10)
    : actionField.goal_id;
  actionField.revenue = actionField.revenue ? parseFloat(actionField.revenue) : actionField.revenue;

  return actionField;
};

/**
 * Returns response payload
 * @param {*} properties
 * @param {*} eventType
 * @returns
 */
const getResponsePayload = (properties, eventType) => {
  let responsePayload = {};
  const productsArray = [];
  const { products, product_id: productId, name } = properties;

  /**
   * checking for products array if available each of the product inside is used
   * populate the final payload else the product information inside the properties is used
   */
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      if (!(element.product_id || element.name)) {
        logger.error(`None of product_id or name is present for product at index ${index}`);
      } else {
        responsePayload = populatePayload(eventType, element, productsArray);
      }
    });
  } else if (!(productId || name)) {
    logger.error(`None of product_id or name is present for the product`);
  } else {
    responsePayload = populatePayload(eventType, properties, productsArray);
  }

  return responsePayload;
};

/**
 * This function is used to prepare and return the final payload to be sent
 * @param {*} eventType - This is the e-commerce event type of yandex.metrica
 * @param {*} properties - Properties passed in the track call
 * @param {*} goalId - goalId taken from UI
 * @returns the responsePayload to be sent to yandex.metrica
 */
const ecommEventPayload = (eventType, properties, goalId) => {
  const { order_id: orderId } = properties;

  const responsePayload = getResponsePayload(properties, eventType);

  // populating actionField object required for purchase event type
  if (eventType === 'purchase') {
    if (!orderId) {
      logger.error('order_id is required for event type purchase');
    }
    responsePayload.ecommerce[eventType].actionField = removeUndefinedAndNullAndEmptyValues(
      getActionField(properties, goalId),
    );
  }

  return removeUndefinedAndNullValues(responsePayload);
};

export { sendEvent, ecommEventPayload, ecommerceEventMapping };

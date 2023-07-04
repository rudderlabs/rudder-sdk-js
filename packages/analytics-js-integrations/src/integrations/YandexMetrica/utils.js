import logger from '@rudderstack/common/v1.1/utils/logUtil';
import {
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
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
 * This function is used to prepare and return the final payload to be sent
 * @param {*} eventType - This is the e-commerce event type of yandex.metrica
 * @param {*} properties - Properties passed in the track call
 * @param {*} goalId - goalId taken from UI
 * @returns the responsePayload to be sent to yandex.metrica
 */
const ecommEventPayload = (eventType, properties, goalId) => {
  let responsePayload = {};
  const { products } = properties;
  const productsArray = [];

  // checking for products array if available each of the product inside is used
  // populate the final payload else the product information inside the properties
  // is used
  if (products && Array.isArray(products)) {
    products.forEach((element, index) => {
      if (!(element.product_id || element.name)) {
        logger.error(`None of product_id or name is present for product at index ${index}`);
      } else {
        responsePayload = populatePayload(eventType, element, productsArray);
      }
    });
  } else if (!(properties.product_id || properties.name)) {
    logger.error(`None of product_id or name is present for the product`);
  } else {
    responsePayload = populatePayload(eventType, properties, productsArray);
  }
  // populating actionField object required for purchase event type
  if (eventType === 'purchase') {
    if (!properties.order_id) {
      logger.error('order_id is required for event type purchase');
    }
    const actionField = {
      id: properties.order_id,
      coupon: properties.coupon,
      goal_id: goalId,
      revenue: properties.revenue,
    };
    // converting the goal_id and revenue in actionField to int and float type
    actionField.goal_id = actionField.goal_id
      ? parseInt(actionField.goal_id, 10)
      : actionField.goal_id;
    actionField.revenue = actionField.revenue
      ? parseFloat(actionField.revenue)
      : actionField.revenue;
    responsePayload.ecommerce[eventType].actionField =
      removeUndefinedAndNullAndEmptyValues(actionField);
  }
  return removeUndefinedAndNullValues(responsePayload);
};

export { sendEvent, ecommEventPayload, ecommerceEventMapping };

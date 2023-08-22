import { LINE_ITEMS_CONFIG } from '@rudderstack/analytics-js-common/constants/integrations/Podsights/constants';
import { constructPayload } from '../../utils/utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';

/**
 * This function is used to build payload with line_items, it will search from
 * properties.products if it's an array, then it will mapped the required fields
 * and insert in line_items.
 * @param {*} properties
 * @param {*} CONFIG_EVENT
 * return payload
 */
const payloadBuilder = (properties, CONFIG_EVENT) => {
  const payload = constructPayload(properties, CONFIG_EVENT);
  // if line_items is present in message.properties
  if (payload.line_items) {
    return payload;
  }

  const lineItems = [];
  // mapping the line_items_payload from message.properties
  const lineItemsPayload = constructPayload(properties, LINE_ITEMS_CONFIG);
  // if products is an array of objects, then we'll build each line_items payload from products.
  const productList = properties?.products;
  if (productList && Array.isArray(productList)) {
    productList.forEach(product => {
      const productDetails = constructPayload(product, LINE_ITEMS_CONFIG);
      lineItems.push({
        ...lineItemsPayload,
        ...removeUndefinedAndNullValues(productDetails),
      });
    });
  } else {
    lineItems.push(lineItemsPayload);
  }
  return { ...payload, line_items: lineItems };
};

/**
 * This function is used to build payload in an array.
 * If properties.products is an array then it will take necessary fields
 * and build payload and returns it with an array.
 * @param {*} properties
 * @param {*} CONFIG_EVENT
 * return payloadList
 */
const payloadBuilderInList = (properties, CONFIG_EVENT) => {
  const payloadList = [];
  const productList = properties?.products;
  const productPayload = constructPayload(properties, CONFIG_EVENT);
  if (productList && Array.isArray(productList)) {
    productList.forEach(product => {
      const productDetails = constructPayload(product, CONFIG_EVENT);
      payloadList.push({
        ...productPayload,
        ...removeUndefinedAndNullValues(productDetails),
      });
    });
  } else {
    payloadList.push(productPayload);
  }
  return payloadList;
};

export { payloadBuilder, payloadBuilderInList };

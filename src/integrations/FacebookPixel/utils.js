import is from 'is';
import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import logger from '../../utils/logUtil';
import { isDefined } from '../../utils/commonUtils';

function getEventId(message) {
  return (
    get(message, 'traits.event_id') ||
    get(message, 'context.traits.event_id') ||
    get(message, 'properties.event_id') ||
    message.messageId
  );
}

/**
 * This method gets content category
 *
 * @param {*} category
 * @returns The content category as a string
 */
const getContentCategory = (category) => {
  let contentCategory = category;
  if (Array.isArray(contentCategory)) {
    contentCategory = contentCategory.map(String).join(',');
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    typeof contentCategory !== 'object'
  ) {
    contentCategory = String(contentCategory);
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    !Array.isArray(contentCategory) &&
    typeof contentCategory === 'object'
  ) {
    logger.error("'properties.category' must be either be a string or an array");
    return;
  }
  // eslint-disable-next-line consistent-return
  return contentCategory;
};

const getHashedStatus = (message, integrationName) => {
  const val = get(message, `integrations.${integrationName}.hashed`);
  return val;
};

const buildPayLoad = (
  rudderElement,
  configWhilistedProperties,
  configBlacklistedProperties,
  hashedPii,
) => {
  const dateFields = [
    'checkinDate',
    'checkoutDate',
    'departingArrivalDate',
    'departingDepartureDate',
    'returningArrivalDate',
    'returningDepartureDate',
    'travelEnd',
    'travelStart',
  ];
  const defaultPiiProperties = [
    'email',
    'firstName',
    'lastName',
    'gender',
    'city',
    'country',
    'phone',
    'state',
    'zip',
    'birthday',
  ];
  const whitelistPiiProperties = configWhilistedProperties || [];
  const blacklistPiiProperties = configBlacklistedProperties || [];

  /**
   * shouldPropBeHashedMap = {
   * <blacklisted_property_name>: <hash_required_boolean>,
   * }
   */

  const shouldPropBeHashedMap = blacklistPiiProperties.reduce((acc, currProp) => {
    acc[currProp.blacklistPiiProperties] = currProp.blacklistPiiHash;
    return acc;
  }, {});
  const whitelistPiiPropertiesNames = whitelistPiiProperties.map(
    (propObject) => propObject.whitelistPiiProperties,
  );

  const { properties } = rudderElement.message;

  const payload = Object.entries(properties).reduce((acc, [currPropName, currPropValue]) => {
    const isPropertyPii =
      defaultPiiProperties.includes(currPropName) ||
      Object.prototype.hasOwnProperty.call(shouldPropBeHashedMap, currPropName);

    const isProperyWhiteListed = whitelistPiiPropertiesNames.includes(currPropName);

    const isDateProp = dateFields.includes(currPropName) && is.date(currPropValue);

    if (isDateProp) {
      [acc[currPropName]] = currPropValue.toISOString().split('T');
    }

    if (shouldPropBeHashedMap[currPropName] && typeof currPropValue === 'string') {
      acc[currPropName] = hashedPii ? currPropValue.toString() : sha256(currPropValue).toString();
    } else if ((!isPropertyPii || isProperyWhiteListed) && !isDateProp) {
      acc[currPropName] = currPropValue;
    } else {
      logger.debug(
        `[Facebook Pixel] PII Property '${currPropValue}' is neither hashed nor whitelisted and will be ignored`,
      );
    }

    return acc;
  }, {});
  return payload;
};

const merge = (obj1, obj2) => {
  const res = {};

  // All properties of obj1
  Object.keys(obj1).forEach((propObj1) => {
    if (Object.prototype.hasOwnProperty.call(obj1, propObj1)) {
      res[propObj1] = obj1[propObj1];
    }
  });

  // Extra properties of obj2
  Object.keys(obj2).forEach((propObj2) => {
    if (
      Object.prototype.hasOwnProperty.call(obj2, propObj2) &&
      !Object.prototype.hasOwnProperty.call(res, propObj2)
    ) {
      res[propObj2] = obj2[propObj2];
    }
  });

  return res;
};

/**
 * Returns formatted revenue
 * @param {*} revenue
 * @returns
 */
const formatRevenue = (revenue) => {
  const parsedRevenue = parseFloat(revenue);
  const formattedRevenue = Number.isNaN(parsedRevenue) ? 0 : parseFloat(parsedRevenue.toFixed(2));

  if (Number.isNaN(formattedRevenue)) {
    logger.error('Revenue could not be converted to a number');
  }

  return formattedRevenue;
};

/**
 * Get the Facebook Content Type
 *
 * Can be `product`, `destination`, `flight` or `hotel`.
 *
 * This can be overridden within the message
 * `options.integrations.FACEBOOK_PIXEL.contentType`, or alternatively you can
 * set the "Map Categories to Facebook Content Types" setting within
 * RudderStack config and then set the corresponding commerce category in
 * `track()` properties.
 *
 * https://www.facebook.com/business/help/606577526529702?id=1205376682832142
 * @param {*} rudderElement
 * @param {*} defaultValue
 * @param {*} categoryToContent
 * @returns
 */
const getContentType = (rudderElement, defaultValue, categoryToContent) => {
  // Get the message-specific override if it exists in the options parameter of `track()`
  const contentTypeMessageOverride =
    rudderElement.message.integrations?.FACEBOOK_PIXEL?.contentType;
  if (contentTypeMessageOverride) return contentTypeMessageOverride;

  // Otherwise check if there is a replacement set for all Facebook Pixel
  // track calls of this category
  const { category } = rudderElement.message.properties;
  if (category) {
    const categoryMapping = categoryToContent?.find((i) => i.from === category);
    if (categoryMapping?.to) return categoryMapping.to;
  }

  // Otherwise return the default value
  return defaultValue;
};

/**
 * Returns contents, contentIds for products
 * @param {*} products
 * @param {*} quantity
 * @param {*} price
 * @returns
 */
const getProductsContentsAndContentIds = (products, quantity, price) => {
  const contents = products
    ? products
        .filter((product) => product)
        .map(({ product_id: prodId, sku, id, quantity: productQuantity, price: productPrice }) => {
          const productId = prodId || sku || id;
          return isDefined(productId)
            ? {
                id: productId,
                quantity: productQuantity || quantity || 1,
                item_price: productPrice || price,
              }
            : null;
        })
        .filter((content) => content !== null)
    : [];

  const contentIds = contents.map((content) => content.id);

  return { contents, contentIds };
};

/**
 * Returns contents, contentIds for single product
 * @param {*} prodId
 * @param {*} quantity
 * @param {*} price
 * @returns
 */
const getProductContentAndId = (prodId, quantity, price) => {
  const contents = [];
  const contentIds = [];

  if (prodId) {
    contentIds.push(prodId);
    contents.push({
      id: prodId,
      quantity,
      item_price: price,
    });
  }

  return { contents, contentIds };
};

/**
 * Returns product list viewed event params
 * @param {*} properties
 * @returns
 */
const getProductListViewedEventParams = (properties) => {
  const { products, category, quantity, price } = properties;

  const { contents, contentIds } = getProductsContentsAndContentIds(products, quantity, price);

  let contentType;
  if (contentIds.length > 0) {
    contentType = 'product';
  } else if (category) {
    contentIds.push(category);
    contents.push({
      id: category,
      quantity: 1,
    });
    contentType = 'product_group';
  }

  return { contentIds, contentType, contents };
};

/**
 * Helper functions object
 */
const eventHelpers = {
  getCategory: (category) => category || '',
  getCurrency: (currency) => currency || 'USD',
  getProdId: (productId, sku, id) => productId || sku || id,
  getProdName: (productName, name) => productName || name || '',
  getFormattedRevenue: (revValue, value) => revValue || formatRevenue(value),
  getEventName: (event) => (event === 'Product Viewed' ? 'ViewContent' : 'AddToCart'),
  getValue: (useValue, value, price) => (useValue ? value : formatRevenue(price)),
  isCustomEventNotMapped: (standardTo, legacyTo, event) =>
    !standardTo[event?.toLowerCase()] && !legacyTo[event?.toLowerCase()],
  validateRevenue: (revValue) => {
    if (!isDefined(revValue)) {
      logger.error("'properties.revenue' could not be converted to a number");
    }
  },
};

export {
  merge,
  getEventId,
  buildPayLoad,
  eventHelpers,
  formatRevenue,
  getContentType,
  getHashedStatus,
  getContentCategory,
  getProductContentAndId,
  getProductListViewedEventParams,
  getProductsContentsAndContentIds,
};

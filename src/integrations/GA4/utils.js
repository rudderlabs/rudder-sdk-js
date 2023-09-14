import {
  eventsConfig,
  itemsArrayParams,
  customParametersExclusion,
  rootLevelProductsSupportedEventsList,
} from './config';
import logger from '../../utils/logUtil';
import { isBlank, flattenJson } from '../../utils/commonUtils';
import { isEmptyObject, constructPayload, extractCustomFields } from '../../utils/utils';

/**
 * Extracts last word after . from string
 * properties.products -> products
 * @param {*} key
 * @returns
 */
const extractLastKey = (key) => key.split('.').pop();

/**
 * Validates weather to send userId property to GA4 or not
 * @param {*} integrations
 */
const shouldSendUserId = (integrations) => integrations?.GA4?.sendUserId ?? true;

/**
 * Reserved event names cannot be used
 * Ref - https://support.google.com/analytics/answer/13316687?hl=en#zippy=%2Cweb
 * @param {*} name
 */
const isReservedEventName = (event) => {
  const reservedEventNames = [
    'click',
    'error',
    'scroll',
    'form_start',
    'form_submit',
    'first_open',
    'first_visit',
    'app_remove',
    'video_start',
    'session_start',
    'view_complete',
    'file_download',
    'video_progress',
    'user_engagement',
    'in_app_purchase',
    'app_store_refund',
    'app_store_subscription_cancel',
    'app_store_subscription_renew',
  ];

  return reservedEventNames.includes(event);
};

/**
 * Validates and formats the event name
 * @param {*} eventName
 * @returns
 */
const formatAndValidateEventName = (eventName) => {
  if (!eventName || typeof eventName !== 'string') {
    logger.error('Event name is required and should be a string');
    return null;
  }

  /**
   * Trim and replace spaces with '_'
   * product searched -> product_searched
   */
  const trimmedEvent = eventName.trim().replace(/\s+/g, '_');

  // Reserved event names are not allowed
  if (isReservedEventName(trimmedEvent)) {
    logger.error(`Reserved event name ${trimmedEvent} is not allowed`);
    return null;
  }

  return trimmedEvent;
};

/**
 * Remove arrays and objects from transformed payload
 * @param {*} params
 * @returns
 */
const removeInvalidParams = (params) => {
  const validParams = {};

  if (typeof params === 'object' && !Array.isArray(params)) {
    const keys = Object.keys(params);
    keys.forEach((key) => {
      const value = params[key];
      if (key === 'items' || (typeof value !== 'object' && !isBlank(value))) {
        validParams[key] = value;
      }
    });
    return validParams;
  }
  return params;
};

/**
 * Returns custom parameters for ga4 event payload
 * @param {*} message
 * @param {*} keys
 * @param {*} exclusionFields
 * @returns
 */
const getCustomParameters = (message, keys, exclusionFields) => {
  let customParameters = {};
  customParameters = extractCustomFields(message, customParameters, keys, exclusionFields);
  // append in the params if any custom fields are passed after flattening the JSON
  if (!isEmptyObject(customParameters)) {
    customParameters = flattenJson(customParameters, '_', 'strict');
  }
  return customParameters;
};

/**
 * Returns exclusion fields list
 * @param {*} mapRootLevelPropertiesToGA4ItemsArray
 * @param {*} mapping
 * @param {*} event
 * @returns
 */
const getExclusionFields = (mapRootLevelPropertiesToGA4ItemsArray, mapping, event) => {
  // Exclude event properties which are already mapped
  let exclusionFields = mapping.reduce((exclusionList, element) => {
    const mappingSourceKeys = element.sourceKeys;

    if (typeof mappingSourceKeys === 'string') {
      exclusionList.push(extractLastKey(mappingSourceKeys));
    } else if (Array.isArray(mappingSourceKeys)) {
      mappingSourceKeys.forEach((item) => {
        if (typeof item === 'string') {
          exclusionList.push(extractLastKey(item));
        }
      });
    }

    return exclusionList;
  }, []);

  // We are mapping "products" to "items", so to remove redundancy we should not send products again
  exclusionFields.push('products');

  if (
    mapRootLevelPropertiesToGA4ItemsArray &&
    rootLevelProductsSupportedEventsList.includes(event)
  ) {
    // Exclude root-level properties (itemsArrayParams) which are already mapped
    exclusionFields = exclusionFields.concat(customParametersExclusion);
  }
  return exclusionFields;
};

/**
 * Creates and returns items array from products
 * @param {*} message
 * @param {*} isItemsRequired
 * @returns
 */
const getItemList = (message) => {
  const items = [];

  const { properties } = message;
  let products = properties?.products;
  let isObject = false;

  // Supporting products as an object
  if (typeof products === 'object' && !Array.isArray(products)) {
    isObject = true;
    products = [products];
  }

  if (Array.isArray(products)) {
    products.forEach((product, index) => {
      let item = constructPayload(product, itemsArrayParams);
      // take additional parameters apart from mapped one
      const itemCustomProperties = extractCustomFields(
        message,
        {},
        isObject ? ['properties.products'] : [`properties.products.${index}`],
        customParametersExclusion,
      );
      if (!isEmptyObject(itemCustomProperties)) {
        item = removeInvalidParams({
          ...item,
          ...flattenJson(itemCustomProperties, '_', 'strict'),
        });
      }

      if (!isEmptyObject(item)) {
        items.push(item);
      }
    });
  }
  return items;
};

/**
 * Creates and returns items array from properties
 * @param {*} message
 * @param {*} isItemsRequired
 * @returns
 */
const getItem = (message) => {
  const { properties } = message;
  const items = [];

  // Only prepare items array if properties exists and it should have at least one key
  if (properties && Object.keys(properties).length > 0) {
    const item = constructPayload(properties, itemsArrayParams);
    if (!isEmptyObject(item)) {
      items.push(item);
    }
  }

  return items;
};

/**
 * Returns items array for ga4 event payload
 * @param {*} message
 * @param {*} eventConfig
 * @returns
 */
const getItemsArray = (message, eventConfig) => {
  const { itemList, item } = eventConfig;
  let items = [];
  let mapRootLevelPropertiesToGA4ItemsArray = false;

  if (itemList && item) {
    items = getItemList(message);

    if (!(items && items.length > 0)) {
      mapRootLevelPropertiesToGA4ItemsArray = true;
      items = getItem(message);
    }
  } else if (item) {
    // item
    mapRootLevelPropertiesToGA4ItemsArray = true;
    items = getItem(message);
  } else if (itemList) {
    // itemList
    items = getItemList(message);
  }

  return { items, mapRootLevelPropertiesToGA4ItemsArray };
};

/**
 * Returns ga4 standard event payload
 * @param {*} message
 * @param {*} eventConfig
 * @returns
 */
const prepareStandardEventParams = (message, eventConfig) => {
  const { event, mapping } = eventConfig;
  let payload = constructPayload(message, mapping);

  // Validation for required params
  if (Array.isArray(mapping) && mapping.length > 0) {
    const hasMissingRequiredValue = mapping.some((mappingItem) => {
      if (!payload[mappingItem.destKey] && mappingItem.required) {
        logger.error(`Missing required value from ${JSON.stringify(mappingItem.sourceKeys)}`);
        return true;
      }
      return false;
    });

    if (hasMissingRequiredValue) {
      return null;
    }
  }

  const { items, mapRootLevelPropertiesToGA4ItemsArray } = getItemsArray(message, eventConfig);
  const exclusionFields = getExclusionFields(mapRootLevelPropertiesToGA4ItemsArray, mapping, event);
  const customParameters = getCustomParameters(message, ['properties'], exclusionFields);

  if (items.length > 0) {
    payload.items = items;
  }

  if (!isEmptyObject(customParameters)) {
    payload = { ...payload, ...customParameters };
  }

  return payload;
};

/**
 * Returns ga4 custom event payload
 * @param {*} message
 * @returns
 */
const prepareCustomEventParams = (message) => getCustomParameters(message, ['properties'], []);

/**
 * Returns ga4 track event name and transformed payload
 * @param {*} message
 * @param {*} eventName
 * @returns
 */
const prepareParamsAndEventName = (message, eventName) => {
  const eventConfig = eventsConfig[`${eventName.toUpperCase()}`];

  // Part 1: prepare params
  const params = eventConfig
    ? prepareStandardEventParams(message, eventConfig)
    : prepareCustomEventParams(message);

  // Handle the case where required params are not present in the payload
  if (!params) {
    return null;
  }

  const validatedParams = removeInvalidParams(params);

  // Part 2: prepare event name
  const event = eventConfig ? eventConfig.event : eventName;

  return { params: validatedParams, event };
};

export {
  getItem,
  getItemList,
  getItemsArray,
  extractLastKey,
  shouldSendUserId,
  getExclusionFields,
  isReservedEventName,
  getCustomParameters,
  removeInvalidParams,
  prepareParamsAndEventName,
  formatAndValidateEventName,
};

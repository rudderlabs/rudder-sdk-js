/* eslint-disable guard-for-in */
import _difference from 'lodash.difference';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/GA4/constants';
import {
  eventNamesConfigArray,
  itemParametersConfigArray,
  ITEM_PROP_EXCLUSION_LIST,
  EVENT_PROP_EXCLUSION_LIST,
} from './ECommerceEventConfig';
import { pageEventParametersConfigArray } from './PageEventConfig';
import { type } from '../../utils/utils';

/**
 * Check if event name is not one of the following reserved names
 * @param {*} name
 */
function isReservedName(name) {
  const reservedEventNames = [
    'ad_activeview',
    'ad_click',
    'ad_exposure',
    'ad_impression',
    'ad_query',
    'adunit_exposure',
    'app_clear_data',
    'app_install',
    'app_update',
    'app_remove',
    'error',
    'first_open',
    'first_visit',
    'in_app_purchase',
    'notification_dismiss',
    'notification_foreground',
    'notification_open',
    'notification_receive',
    'os_update',
    'screen_view',
    'session_start',
    'user_engagement',
  ];

  return reservedEventNames.includes(name);
}

/**
 * map rudder event name to ga4 ecomm event name and return array
 * @param {*} event
 */
function getDestinationEventName(event) {
  return eventNamesConfigArray.filter(p => p.src.includes(event.toLowerCase()));
}

/**
 * Create item array and add into destination parameters
 * If 'items' prop is present push new key value into it else create a new and push data
 * 'items' -> name of GA4 Ecommerce property name.
 * For now its hard coded, we can think of some better soln. later.
 * @param {*} dest
 * @param {*} key
 * @param {*} value
 */
function createItemProperty(dest, key, value) {
  const destinationProperties = dest;
  if (!destinationProperties.items) {
    destinationProperties.items = [];
    destinationProperties.items.push({ [key]: value });
  } else {
    destinationProperties.items[0][key] = value;
  }
  return destinationProperties;
}

/**
 * Check if your payload contains required parameters to map to ga4 ecomm
 * @param {*} includeRequiredParams this can be boolean or an array or required object
 * @param {*} key
 * @param {*} src
 */
function hasRequiredParameters(props, eventMappingObj) {
  const requiredParams = eventMappingObj.requiredParams || false;
  if (!requiredParams) return true;
  if (!Array.isArray(requiredParams)) {
    return !!props[requiredParams];
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const i in props.items) {
    // eslint-disable-next-line no-restricted-syntax
    for (const p in requiredParams) {
      if (!props.items[i][requiredParams[p]]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * screens custom variables from rootObj by excluding exclusionFields and adds
 * those to destination object
 * @param {*} rootObj
 * @param {*} destination
 * @param {*} exclusionFields
 * @returns
 */
function extractCustomVariables(rootObj, destination, exclusionFields) {
  const properties = destination;
  const mappingKeys = _difference(Object.keys(rootObj), exclusionFields);
  mappingKeys.forEach(mappingKey => {
    if (typeof rootObj[mappingKey] !== 'undefined') {
      properties[mappingKey] = rootObj[mappingKey];
    }
  });
  return properties;
}

/**
 *
 * @param {*} destinationProperties
 * @param {*} props
 * @param {*} contextOp "properties" or "products"
 * @returns decides the exclusion criteria for adding custom variables
 * in properties or product type objects and returns the final output.
 */
function addCustomVariables(destinationProperties, props, contextOp) {
  logger.debug('within addCustomVariables');
  if (contextOp === 'product') {
    return extractCustomVariables(props, destinationProperties, ITEM_PROP_EXCLUSION_LIST);
  }

  if (contextOp === 'properties') {
    return extractCustomVariables(props, destinationProperties, EVENT_PROP_EXCLUSION_LIST);
  }
  return destinationProperties;
}

/**
 * TO DO Future Improvement ::::
 * Here we only support mapping single level object mapping.
 * Implement using recursion to handle multi level prop mapping.
 * @param {*} props { product_id: 123456_abcdef, name: "chess-board", list_id: "ls_abcdef", category: games }
 * @param {*} destParameterConfig
 * Defined Parameter present GA4/utils.ts ex: [{ src: "category", dest: "item_list_name", inItems: true }]
 * @param {*} contextOp "properties" or "product"
 */
function getDestinationEventProperties(props, destParameterConfig, contextOp, hasItem = true) {
  let destinationProperties = {};
  Object.keys(props).forEach(key => {
    destParameterConfig.forEach(param => {
      if (key === param.src) {
        // handle case where the key needs to go inside items as well as top level params in GA4
        if (param.inItems && hasItem) {
          destinationProperties = createItemProperty(destinationProperties, param.dest, props[key]);
        }
        destinationProperties[param.dest] = props[key];
      }
    });
  });
  const propsWithCustomFields = addCustomVariables(destinationProperties, props, contextOp);
  return propsWithCustomFields;
}

/**
 * Map rudder products arrays payload to ga4 ecomm items array
 * @param {*} products
 * @param {*} item
 */
function getDestinationItemProperties(products, item) {
  const items = [];
  let obj = {};
  const contextOp = type(products) !== 'array' ? 'properties' : 'product';
  const finalProducts = type(products) !== 'array' ? [products] : products;
  const finalItemObj = item && type(item) === 'array' && item[0] ? item[0] : {};
  // get the dest keys from itemParameters config
  // append the already created item object keys (this is done to get the keys that are actually top level props in Rudder payload but GA expects them under items too)
  finalProducts.forEach(product => {
    obj = {
      ...getDestinationEventProperties(product, itemParametersConfigArray, contextOp, true),
      ...finalItemObj,
    };
    items.push(obj);
  });
  return items;
}

/**
 * Generate ga4 page_view events payload
 * @param {*} props
 */
function getPageViewProperty(props) {
  return getDestinationEventProperties(props, pageEventParametersConfigArray, 'properties');
}

/**
 * Validates weather to send userId property to GA4 or not
 * @param {*} integrations
 */
function sendUserIdToGA4(integrations) {
  const ga4IntgConfig = integrations[DISPLAY_NAME] || integrations[NAME];
  if (ga4IntgConfig) {
    if (Object.prototype.hasOwnProperty.call(ga4IntgConfig, 'sendUserId')) {
      return !!ga4IntgConfig.sendUserId;
    }
    return true;
  }
  return true;
}

export {
  isReservedName,
  sendUserIdToGA4,
  getPageViewProperty,
  hasRequiredParameters,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
};

import {
  eventNamesConfigArray,
  itemParametersConfigArray,
} from "./ECommerceEventConfig";

import { pageEventParametersConfigArray } from "./PageEventConfig";
import { type } from "../../utils/utils";
import logger from "../../utils/logUtil";

/**
 * Check if event name is not one of the following reserved names
 * @param {*} name
 */
function isReservedName(name) {
  const reservedEventNames = [
    "ad_activeview",
    "ad_click",
    "ad_exposure",
    "ad_impression",
    "ad_query",
    "adunit_exposure",
    "app_clear_data",
    "app_install",
    "app_update",
    "app_remove",
    "error",
    "first_open",
    "first_visit",
    "in_app_purchase",
    "notification_dismiss",
    "notification_foreground",
    "notification_open",
    "notification_receive",
    "os_update",
    "screen_view",
    "session_start",
    "user_engagement",
  ];

  return reservedEventNames.includes(name);
}

/**
 * map rudder event name to ga4 ecomm event name and return array
 * @param {*} event
 */
function getDestinationEventName(event) {
  return eventNamesConfigArray.filter((p) =>
    p.src.includes(event.toLowerCase())
  );
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
    if (props[requiredParams]) {
      return true;
    }
    return false;
  }
  for (const i in props.items) {
    for (const p in requiredParams) {
      if (!props.items[i][requiredParams[p]]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * TO DO Future Improvement ::::
 * Here we only support mapping single level object mapping.
 * Implement using recursion to handle multi level prop mapping.
 * @param {*} props { product_id: 123456_abcdef, name: "chess-board", list_id: "ls_abcdef", category: games }
 * @param {*} destParameterConfig
 * Defined Parameter present GA4/utils.js ex: [{ src: "category", dest: "item_list_name", inItems: true }]
 * @param {*} includeRequiredParams contains object of required parameter to be mapped from source payload
 * output: {
  "item_list_id": "ls_abcdef",
  "items": [
    {
      "item_id": "123456_abcdef",
      "item_name": "chess-board",
      "item_list_id": "ls_abc",
      "item_list_name": "games"
    }
  ],
  "item_list_name": "games"
}
*/
function getDestinationEventProperties(
  props,
  destParameterConfig,
  hasItem = true
) {
  let destinationProperties = {};
  Object.keys(props).forEach((key) => {
    destParameterConfig.forEach((param) => {
      if (key === param.src) {
        // handle case where the key needs to go inside items as well as top level params in GA4
        if (param.inItems && hasItem) {
          destinationProperties = createItemProperty(
            destinationProperties,
            param.dest,
            props[key]
          );
        }
        destinationProperties[param.dest] = props[key];
        // eslint-disable-next-line no-param-reassign
        delete props[key];
      }
    });
  });
  return destinationProperties;
}

/**
 * Map rudder products arrays payload to ga4 ecomm items array
 * @param {*} products
 * @param {*} item
 */
function getDestinationItemProperties(products, item) {
  const items = [];
  let obj = {};
  if (type(products) !== "array") {
    logger.debug("Event payload doesn't have products array");
  } else {
    // get the dest keys from itemParameters config
    // append the already created item object keys (this is done to get the keys that are actually top level props in Rudder payload but GA expects them under items too)
    products.forEach((p) => {
      obj = {
        ...getDestinationEventProperties(p, itemParametersConfigArray),
        ...((item && type(item) === "array" && item[0]) || {}),
      };
      items.push(obj);
    });
  }
  return items;
}

/**
 * Generate ga4 page_view events payload
 * @param {*} props
 */
function getPageViewProperty(props) {
  return getDestinationEventProperties(props, pageEventParametersConfigArray);
}

export {
  isReservedName,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
  getPageViewProperty,
  hasRequiredParameters,
};

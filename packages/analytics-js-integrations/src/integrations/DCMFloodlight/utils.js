/* eslint-disable no-lonely-if */
/* eslint-disable consistent-return */
import get from 'get-value';
import {
  DISPLAY_NAME,
  NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/DCMFloodlight/constants';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { GENERIC_FALSE_VALUES, GENERIC_TRUE_VALUES } from '../../utils/constants';
import {
  isDefinedAndNotNull,
  isNotEmpty,
  isDefinedNotNullNotEmpty,
  removeUndefinedAndNullValues,
} from '../../utils/commonUtils';

/**
 * transform webapp dynamicForm custom floodlight variable
 * [
      {
        "from": "property1",
        "to": "1"
      },
      {
        "from": "property2",
        "to": "2"
      }
  ]
 * into { property1: u1, property2: u2, ... }
 * Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
 * @param {*} customFloodlightVariable
 * @returns
 */
const transformCustomVariable = (customFloodlightVariable, message) => {
  const customVariable = {};
  const DENIED_CHARACTERS = ['"', '<', '>', '#'];
  customFloodlightVariable.forEach(item => {
    if (item && isNotEmpty(item.from) && isNotEmpty(item.to)) {
      // remove u if already there
      // first we consider taking custom variable from properties
      // if not found we will take it from traits
      let itemValue = get(message, `properties.${item.from.trim()}`);
      // this condition adds support for numeric 0
      if (!isDefinedAndNotNull(itemValue)) {
        const traits = message.traits || message.context?.traits;
        if (traits) {
          itemValue = traits[item.from.trim()];
        }
      }
      if (
        itemValue &&
        typeof itemValue === 'string' &&
        DENIED_CHARACTERS.some(key => itemValue.includes(key))
      ) {
        logger.info(`${DENIED_CHARACTERS} string variable is not acceptable`);
        itemValue = undefined;
      }
      // supported data types are number and string
      if (isDefinedAndNotNull(itemValue) && typeof itemValue !== 'boolean') {
        customVariable[`u${item.to.trim().replace(/u/g, '')}`] = encodeURIComponent(itemValue);
      }
    }
  });

  return customVariable;
};

/**
 * @param {*} payload {"a":1,"b":"xyz"}
 * @returns a=1;b=xyz
 */
const flattenPayload = payload => {
  let rawPayload = '';
  Object.entries(payload).forEach(([key, value]) => {
    if (key && isDefinedNotNullNotEmpty(value)) {
      rawPayload += `${key}=${value};`;
    }
  });
  return rawPayload.replace(/.$/, '');
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw Error(`[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`);
};

const calculateQuantity = products => {
  if (products && products.length > 0 && Array.isArray(products)) {
    return products.reduce((accumulator, product) => {
      if (product.quantity) {
        return accumulator + product.quantity;
      }
      return accumulator;
    }, 0);
  }
  return 0;
};

const isValidCountingMethod = (salesTag, countingMethod) => {
  // sales tag
  if (salesTag) {
    if (countingMethod === 'transactions' || countingMethod === 'items_sold') {
      return true;
    }
  }
  // counter tag
  else if (
    countingMethod === 'standard' ||
    countingMethod === 'unique' ||
    countingMethod === 'per_session'
  ) {
    return true;
  }

  return false;
};

/**
 * Function to build custom params using integrations object
 * {
  "integrations": {
    "All": true,
    "DCM_Floodlight": {
      "COPPA": "false",
      "GDPR": "1",
      "npa": true
    }
  }
}
 * @param {*} message
 * @param {*} integrationObj
 * @returns // {"tag_for_child_directed_treatment":0,"tfua":1,"npa":1}
 */
const buildCustomParamsUsingIntegrationsObject = (message, integrationObj) => {
  const customParams = {};
  // COPPA, GDPR, npa must be provided inside integration object
  let dcmFloodlightIntgConfig = message.integrations[DISPLAY_NAME] || message.integrations[NAME];
  if (!dcmFloodlightIntgConfig) {
    dcmFloodlightIntgConfig = integrationObj[DISPLAY_NAME] || integrationObj[NAME];
  }

  if (dcmFloodlightIntgConfig) {
    if (isDefinedNotNullNotEmpty(dcmFloodlightIntgConfig.COPPA)) {
      customParams.tag_for_child_directed_treatment = mapFlagValue(
        'COPPA',
        dcmFloodlightIntgConfig.COPPA,
      );
    }

    if (isDefinedNotNullNotEmpty(dcmFloodlightIntgConfig.GDPR)) {
      customParams.tfua = mapFlagValue('GDPR', dcmFloodlightIntgConfig.GDPR);
    }

    if (isDefinedNotNullNotEmpty(dcmFloodlightIntgConfig.npa)) {
      customParams.npa = mapFlagValue('npa', dcmFloodlightIntgConfig.npa);
    }
  }

  const matchId = get(message, 'properties.matchId');
  if (matchId) {
    customParams.match_id = matchId;
  }

  return customParams;
};

const buildGtagTrackPayload = (message, salesTag, countingMethod, integrationObj) => {
  // Ref - https://support.google.com/campaignmanager/answer/7554821?hl=en#zippy=%2Ccustom-fields
  // we can pass custom variables to DCM and any values passed in it will override its default value
  // Total 7 properties - ord, num, dc_lat, tag_for_child_directed_treatment, tfua, npa, match_id
  let dcCustomParams = {};
  let eventSnippetPayload = {};

  if (salesTag) {
    // sales tag
    dcCustomParams.ord = get(message, 'properties.orderId') || get(message, 'properties.order_id');

    eventSnippetPayload = {
      ...eventSnippetPayload,
      value: get(message, 'properties.revenue'),
      transaction_id: dcCustomParams.ord,
    };

    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-sales-tags
    // possible values for counting method :- transactions, items_sold
    if (countingMethod === 'items_sold') {
      let qty = get(message, 'properties.quantity');
      // sums quantity from products array or fallback to properties.quantity
      const products = get(message, 'properties.products');
      const quantities = calculateQuantity(products);
      if (quantities) {
        qty = quantities;
      }
      if (qty) {
        eventSnippetPayload.quantity = parseFloat(qty);
      }
    }
  } else {
    // counter tag
    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-counter-tags
    switch (countingMethod) {
      case 'standard':
        dcCustomParams.ord = get(message, 'properties.ord');
        break;
      case 'unique':
        dcCustomParams.num = get(message, 'properties.num');
        break;
      case 'per_session':
        dcCustomParams.ord = get(message, 'properties.sessionId');
        eventSnippetPayload.session_id = dcCustomParams.ord;
        break;
      default:
        break;
    }
  }

  dcCustomParams = {
    ...dcCustomParams,
    ...buildCustomParamsUsingIntegrationsObject(message, integrationObj),
  };

  const dcLat = get(message, 'context.device.adTrackingEnabled');
  const matchId = get(message, 'properties.matchId');

  if (isDefinedNotNullNotEmpty(dcLat)) {
    dcCustomParams.dc_lat = mapFlagValue('dc_lat', dcLat);
  }
  if (matchId) {
    dcCustomParams.match_id = matchId;
  }

  dcCustomParams = removeUndefinedAndNullValues(dcCustomParams);
  if (Object.keys(dcCustomParams).length > 0) {
    eventSnippetPayload.dc_custom_params = dcCustomParams;
  }
  return eventSnippetPayload;
};

const buildIframeTrackPayload = (message, salesTag, countingMethod, integrationObj) => {
  const randomNum = Math.random() * 10000000000000;
  // Ref - https://support.google.com/campaignmanager/answer/2823450?hl=en#zippy=%2Cother-parameters-for-iframe-and-image-tags:~:text=Other%20parameters%20for%20iFrame%20and%20image%20tags
  // we can pass custom params to DCM.
  // Total 9 params - ord, num, cost, qty, dc_lat, tag_for_child_directed_treatment, tfua, npa, match_id
  let customParams = {};

  if (salesTag) {
    // sales tag
    customParams.ord = get(message, 'properties.orderId') || get(message, 'properties.order_id');
    customParams.cost = get(message, 'properties.revenue');

    // Ref - https://support.google.com/campaignmanager/answer/2823450?hl=en#zippy=%2Chow-the-ord-parameter-is-displayed-for-each-counter-type%2Csales-activity-tags
    if (countingMethod === 'transactions') {
      customParams.qty = 1;
    } else {
      // counting method is item_sold
      let qty = get(message, 'properties.quantity');
      // sums quantity from products array or fallback to properties.quantity
      const products = get(message, 'properties.products');
      const quantities = calculateQuantity(products);
      if (quantities) {
        qty = quantities;
      }
      if (qty) {
        customParams.qty = parseFloat(qty);
      }
    }
  } else {
    // counter tag
    // Ref - https://support.google.com/campaignmanager/answer/2823450?hl=en#zippy=%2Ccounter-activity-tags%2Chow-the-ord-parameter-is-displayed-for-each-counter-type
    switch (countingMethod) {
      case 'standard':
        customParams.ord = get(message, 'properties.ord') || randomNum;
        break;
      case 'unique':
        customParams.ord = 1;
        customParams.num = get(message, 'properties.num') || randomNum;
        break;
      case 'per_session':
        customParams.ord = get(message, 'properties.sessionId');
        break;
      default:
        break;
    }
  }

  customParams = {
    ...customParams,
    ...buildCustomParamsUsingIntegrationsObject(message, integrationObj),
  };

  const dcLat = get(message, 'context.device.adTrackingEnabled');
  const matchId = get(message, 'properties.matchId');

  if (isDefinedNotNullNotEmpty(dcLat)) {
    customParams.dc_lat = mapFlagValue('dc_lat', dcLat);
  }
  if (matchId) {
    customParams.match_id = matchId;
  }

  return customParams;
};

export {
  transformCustomVariable,
  flattenPayload,
  mapFlagValue,
  buildGtagTrackPayload,
  buildIframeTrackPayload,
  isValidCountingMethod,
};

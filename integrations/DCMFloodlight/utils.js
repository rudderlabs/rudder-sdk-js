/* eslint-disable consistent-return */
import get from "get-value";
import {
  GENERIC_FALSE_VALUES,
  GENERIC_TRUE_VALUES,
} from "../../utils/constants";
import logger from "../../utils/logUtil";
import {
  isDefinedAndNotNull,
  isNotEmpty,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";

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
  const DENIED_CHARACTERS = ['"', "<", ">", "#"];
  customFloodlightVariable.forEach((item) => {
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
        typeof itemValue === "string" &&
        DENIED_CHARACTERS.some((key) => itemValue.includes(key))
      ) {
        logger.info(`${DENIED_CHARACTERS} string variable is not acceptable`);
        itemValue = undefined;
      }
      // supported data types are number and string
      if (isDefinedAndNotNull(itemValue) && typeof itemValue !== "boolean") {
        customVariable[`u${item.to.trim().replace(/u/g, "")}`] =
          encodeURIComponent(itemValue);
      }
    }
  });

  return customVariable;
};

/**
 * @param {*} payload {"a":1,"b":"xyz"}
 * @returns a=1;b=xyz
 */
const flattenPayload = (payload) => {
  let rawPayload = "";
  Object.entries(payload).forEach(([key, value]) => {
    if (key && isDefinedAndNotNull(value)) {
      rawPayload += `${key}=${value};`;
    }
  });
  return rawPayload.replace(/.$/, "");
};

// valid flag should be provided [1|true] or [0|false]
const mapFlagValue = (key, value) => {
  if (GENERIC_TRUE_VALUES.includes(value.toString())) {
    return 1;
  }
  if (GENERIC_FALSE_VALUES.includes(value.toString())) {
    return 0;
  }

  throw Error(
    `[DCM Floodlight]:: ${key}: valid parameters are [1|true] or [0|false]`
  );
};

const calculateQuantity = (products) => {
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

const buildGtagTrackPayload = (
  message,
  salesTag,
  countingMethod,
  integrationObj
) => {
  let dcCustomParams = {
    ord: get(message, "properties.ord"),
    dc_lat: get(message, "context.device.adTrackingEnabled"),
  };

  let eventSnippetPayload = {};
  if (salesTag) {
    // sales tag
    dcCustomParams.ord =
      get(message, "properties.orderId") || get(message, "properties.order_id");
    let qty = get(message, "properties.quantity");

    eventSnippetPayload = {
      ...eventSnippetPayload,
      value: get(message, "properties.revenue"),
      transaction_id: dcCustomParams.ord,
    };

    // sums quantity from products array or fallback to properties.quantity
    const products = get(message, "properties.products");
    const quantities = calculateQuantity(products);
    if (quantities) {
      qty = quantities;
    }

    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-sales-tags
    switch (countingMethod) {
      case "transactions":
        break;
      case "items_sold":
        if (qty) {
          eventSnippetPayload.quantity = parseFloat(qty);
        }
        break;
      default:
        logger.error("[DCM Floodlight] Sales Tag:: invalid counting method");
        return;
    }
  } else {
    // counter tag
    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-counter-tags
    switch (countingMethod) {
      case "standard":
        break;
      case "unique":
        dcCustomParams.num = get(message, "properties.num");
        break;
      case "per_session":
        dcCustomParams.ord = get(message, "properties.sessionId");
        eventSnippetPayload.session_id = dcCustomParams.ord;
        break;
      default:
        logger.error("[DCM Floodlight] Counter Tag:: invalid counting method");
        return;
    }
  }

  // COPPA, GDPR, npa must be provided inside integration object
  let { DCM_FLOODLIGHT } = message.integrations;
  if (!DCM_FLOODLIGHT) {
    ({ DCM_FLOODLIGHT } = integrationObj);
  }

  if (DCM_FLOODLIGHT) {
    if (isDefinedAndNotNull(DCM_FLOODLIGHT.COPPA)) {
      dcCustomParams.tag_for_child_directed_treatment = mapFlagValue(
        "COPPA",
        DCM_FLOODLIGHT.COPPA
      );
    }

    if (isDefinedAndNotNull(DCM_FLOODLIGHT.GDPR)) {
      dcCustomParams.tfua = mapFlagValue("GDPR", DCM_FLOODLIGHT.GDPR);
    }

    if (isDefinedAndNotNull(DCM_FLOODLIGHT.npa)) {
      dcCustomParams.npa = mapFlagValue("npa", DCM_FLOODLIGHT.npa);
    }
  }

  if (isDefinedAndNotNull(dcCustomParams.dc_lat)) {
    dcCustomParams.dc_lat = mapFlagValue("dc_lat", dcCustomParams.dc_lat);
  }

  const matchId = get(message, "properties.matchId");
  if (matchId) {
    dcCustomParams.match_id = matchId;
  }

  dcCustomParams = removeUndefinedAndNullValues(dcCustomParams);
  if (Object.keys(dcCustomParams).length > 0) {
    eventSnippetPayload.dc_custom_params = dcCustomParams;
  }
  return eventSnippetPayload;
};

const buildIframeTrackPayload = (
  message,
  salesTag,
  countingMethod,
  integrationObj
) => {
  const randomNum = Math.random() * 10000000000000;
  const customParams = {
    ord: get(message, "properties.ord") || randomNum,
    dc_lat: get(message, "context.device.adTrackingEnabled"),
  };

  if (salesTag) {
    // sales tag
    customParams.ord =
      get(message, "properties.orderId") || get(message, "properties.order_id");
    customParams.cost = get(message, "properties.revenue");
    let qty = get(message, "properties.quantity");

    // sums quantity from products array or fallback to properties.quantity
    const products = get(message, "properties.products");
    const quantities = calculateQuantity(products);
    if (quantities) {
      qty = quantities;
    }

    // Ref - https://support.google.com/campaignmanager/answer/2823450?hl=en#zippy=%2Chow-the-ord-parameter-is-displayed-for-each-counter-type%2Csales-activity-tags
    switch (countingMethod) {
      case "transactions":
        customParams.qty = 1;
        break;
      case "items_sold":
        if (qty) {
          customParams.qty = parseFloat(qty);
        }
        break;
      default:
        logger.error("[DCM Floodlight] Sales Tag:: invalid counting method");
        return;
    }
  } else {
    // counter tag
    // Ref - https://support.google.com/campaignmanager/answer/2823450?hl=en#zippy=%2Ccounter-activity-tags%2Chow-the-ord-parameter-is-displayed-for-each-counter-type
    switch (countingMethod) {
      case "standard":
        break;
      case "unique":
        customParams.ord = 1;
        customParams.num = get(message, "properties.num") || randomNum;
        break;
      case "per_session":
        customParams.ord = get(message, "properties.sessionId");
        if (!customParams.ord) {
          logger.error(
            "[DCM Floodlight] Counter Tag:: sessionId is missing from properties"
          );
          return;
        }
        break;
      default:
        logger.error("[DCM Floodlight] Counter Tag:: invalid counting method");
        return;
    }
  }

  // COPPA, GDPR, npa must be provided inside integration object
  let { DCM_FLOODLIGHT } = message.integrations;
  if (!DCM_FLOODLIGHT) {
    ({ DCM_FLOODLIGHT } = integrationObj);
  }

  if (DCM_FLOODLIGHT) {
    if (isDefinedAndNotNull(DCM_FLOODLIGHT.COPPA)) {
      customParams.tag_for_child_directed_treatment = mapFlagValue(
        "COPPA",
        DCM_FLOODLIGHT.COPPA
      );
    }

    if (isDefinedAndNotNull(DCM_FLOODLIGHT.GDPR)) {
      customParams.tfua = mapFlagValue("GDPR", DCM_FLOODLIGHT.GDPR);
    }

    if (isDefinedAndNotNull(DCM_FLOODLIGHT.npa)) {
      customParams.npa = mapFlagValue("npa", DCM_FLOODLIGHT.npa);
    }
  }

  if (isDefinedAndNotNull(customParams.dc_lat)) {
    customParams.dc_lat = mapFlagValue("dc_lat", customParams.dc_lat);
  }

  const matchId = get(message, "properties.matchId");
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
};

// import * as XMLHttpRequestNode from "Xmlhttprequest";
import { parse } from "component-url";
import get from "get-value";
import set from "set-value";
import logger from "./logUtil";
import { commonNames } from "../integrations/integration_cname";
import { clientToServerNames } from "../integrations/client_server_name";
import { CONFIG_URL, ReservedPropertyKeywords } from "./constants";
import Storage from "./storage";

/**
 *
 * Utility method for excluding null and empty values in JSON
 * @param {*} key
 * @param {*} value
 * @returns
 */
function replacer(key, value) {
  if (value === null || value === undefined) {
    return undefined;
  }
  return value;
}

/**
 * Utility method to remove '/' at the end of URL
 * @param {*} inURL
 */
function stripTrailingSlashes(inURL) {
  return inURL && inURL.endsWith("/") ? inURL.replace(/\/+$/, "") : inURL;
}

/**
 *
 * Utility function for UUID generation
 * @returns
 */
function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 *
 * Utility function to get current time (formatted) for including in sent_at field
 * @returns
 */
function getCurrentTimeFormatted() {
  const curDateTime = new Date().toISOString();
  // Keeping same as iso string
  /* let curDate = curDateTime.split("T")[0];
  let curTimeExceptMillis = curDateTime
    .split("T")[1]
    .split("Z")[0]
    .split(".")[0];
  let curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
  return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis; */
  return curDateTime;
}

/**
 *
 * Utility function to retrieve configuration JSON from server
 * @param {*} url
 * @param {*} wrappers
 * @param {*} isLoaded
 * @param {*} callback
 */
function getJSON(url, wrappers, isLoaded, callback) {
  // server-side integration, XHR is node module

  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, false);
  xhr.onload = function () {
    const { status } = xhr;
    if (status == 200) {
      // logger.debug("status 200");
      callback(null, xhr.responseText, wrappers, isLoaded);
    } else {
      callback(status);
    }
  };
  xhr.send();
}

/**
 *
 * Utility function to retrieve configuration JSON from server
 * @param {*} context
 * @param {*} url
 * @param {*} callback
 */
function getJSONTrimmed(context, url, writeKey, callback) {
  // server-side integration, XHR is node module
  const cb_ = callback.bind(context);

  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`
  );

  xhr.onload = function () {
    const { status } = xhr;
    if (status == 200) {
      // logger.debug("status 200 " + "calling callback");
      cb_(200, xhr.responseText);
    } else {
      handleError(
        new Error(`request failed with status: ${xhr.status} for url: ${url}`)
      );
      cb_(status);
    }
  };
  xhr.send();
}

function handleError(error, analyticsInstance) {
  let errorMessage = error.message ? error.message : undefined;
  let sampleAdBlockTest;
  try {
    if (error instanceof Event) {
      if (error.target && error.target.localName == "script") {
        errorMessage = `error in script loading:: src::  ${error.target.src} id:: ${error.target.id}`;
        if (analyticsInstance && error.target.src.includes("adsbygoogle")) {
          sampleAdBlockTest = true;
          analyticsInstance.page(
            "RudderJS-Initiated",
            "ad-block page request",
            { path: "/ad-blocked", title: errorMessage },
            analyticsInstance.sendAdblockPageOptions
          );
        }
      }
    }
    if (errorMessage && !sampleAdBlockTest) {
      logger.error("[Util] handleError:: ", errorMessage);
    }
  } catch (e) {
    logger.error("[Util] handleError:: ", e);
  }
}

function getDefaultPageProperties() {
  const canonicalUrl = getCanonicalUrl();
  const path = canonicalUrl
    ? parse(canonicalUrl).pathname
    : window.location.pathname;
  // const { referrer } = document;
  const { search } = window.location;
  const { title } = document;
  const url = getUrl(search);
  const tab_url = window.location.href;

  const referrer = getReferrer();
  const referring_domain = getReferringDomain(referrer);
  const initial_referrer = Storage.getInitialReferrer();
  const initial_referring_domain = Storage.getInitialReferringDomain();
  return {
    path,
    referrer,
    referring_domain,
    search,
    title,
    url,
    tab_url,
    initial_referrer,
    initial_referring_domain,
  };
}

function getReferrer() {
  return document.referrer || "$direct";
}

function getReferringDomain(referrer) {
  const split = referrer.split("/");
  if (split.length >= 3) {
    return split[2];
  }
  return "";
}

function getUrl(search) {
  const canonicalUrl = getCanonicalUrl();
  const url = canonicalUrl
    ? canonicalUrl.indexOf("?") > -1
      ? canonicalUrl
      : canonicalUrl + search
    : window.location.href;
  const hashIndex = url.indexOf("#");
  return hashIndex > -1 ? url.slice(0, hashIndex) : url;
}

function getCanonicalUrl() {
  const tags = document.getElementsByTagName("link");
  for (var i = 0, tag; (tag = tags[i]); i++) {
    if (tag.getAttribute("rel") === "canonical") {
      return tag.getAttribute("href");
    }
  }
}

function getCurrency(val) {
  if (!val) return;
  if (typeof val === "number") {
    return val;
  }
  if (typeof val !== "string") {
    return;
  }

  val = val.replace(/\$/g, "");
  val = parseFloat(val);

  if (!isNaN(val)) {
    return val;
  }
}

function getRevenue(properties, eventName) {
  let { revenue } = properties;
  const orderCompletedRegExp =
    /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = properties.total;
  }

  return getCurrency(revenue);
}

function transformNamesCore(integrationObject, namesObj) {
  Object.keys(integrationObject).forEach((key) => {
    if (integrationObject.hasOwnProperty(key)) {
      if (namesObj[key]) {
        integrationObject[namesObj[key]] = integrationObject[key];
      }
      if (key != "All") {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
        if (namesObj[key] != undefined && namesObj[key] != key) {
          delete integrationObject[key];
        }
      }
    }
  });
}

/**
 *
 *
 * @param {*} integrationObject
 */
function transformToRudderNames(integrationObject) {
  transformNamesCore(integrationObject, commonNames);
}

function transformToServerNames(integrationObject) {
  transformNamesCore(integrationObject, clientToServerNames);
}

/**
 *
 * @param {*} sdkSuppliedIntegrations
 * @param {*} configPlaneEnabledIntegrations
 */
function findAllEnabledDestinations(
  sdkSuppliedIntegrations,
  configPlaneEnabledIntegrations
) {
  const enabledList = [];
  if (
    !configPlaneEnabledIntegrations ||
    configPlaneEnabledIntegrations.length === 0
  ) {
    return enabledList;
  }
  let allValue = true;
  if (sdkSuppliedIntegrations.All !== undefined) {
    allValue = sdkSuppliedIntegrations.All;
  }
  const intgData = {};
  if (typeof configPlaneEnabledIntegrations[0] === "string") {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData[intg] = intg;
    });
  } else if (typeof configPlaneEnabledIntegrations[0] === "object") {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData[intg.name] = intg;
    });
  }

  Object.keys(intgData).forEach((intgName) => {
    if (!allValue) {
      // All false ==> check if intg true supplied
      if (
        sdkSuppliedIntegrations[intgName] != undefined &&
        sdkSuppliedIntegrations[intgName] == true
      ) {
        enabledList.push(intgData[intgName]);
      }
    } else {
      // All true ==> intg true by default
      let intgValue = true;
      // check if intg false supplied
      if (
        sdkSuppliedIntegrations[intgName] != undefined &&
        sdkSuppliedIntegrations[intgName] == false
      ) {
        intgValue = false;
      }
      if (intgValue) {
        enabledList.push(intgData[intgName]);
      }
    }
  });

  return enabledList;
}

/**
 * reject all null values from array/object
 * @param  {} obj
 * @param  {} fn
 */
function rejectArr(obj, fn) {
  fn = fn || compact;
  return type(obj) == "array" ? rejectarray(obj, fn) : rejectobject(obj, fn);
}

/**
 * particular case when rejecting an array
 * @param  {} arr
 * @param  {} fn
 */
var rejectarray = function (arr, fn) {
  const ret = [];

  for (let i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

/**
 * Rejecting null from any object other than arrays
 * @param  {} obj
 * @param  {} fn
 *
 */
var rejectobject = function (obj, fn) {
  const ret = {};

  for (const k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k];
    }
  }

  return ret;
};

function compact(value) {
  return value == null;
}

/**
 * check type of object incoming in the rejectArr function
 * @param  {} val
 */
function type(val) {
  switch (Object.prototype.toString.call(val)) {
    case "[object Function]":
      return "function";
    case "[object Date]":
      return "date";
    case "[object RegExp]":
      return "regexp";
    case "[object Arguments]":
      return "arguments";
    case "[object Array]":
      return "array";
  }

  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (val === Object(val)) return "object";

  return typeof val;
}

function getUserProvidedConfigUrl(configUrl) {
  let url = configUrl;
  if (url.indexOf("sourceConfig") === -1) {
    url = `${stripTrailingSlashes(url)}/sourceConfig/`;
  }
  url = url.slice(-1) === "/" ? url : `${url}/`;
  const defQueryParams = CONFIG_URL.split("?")[1];
  const urlSplitItems = url.split("?");
  if (urlSplitItems.length > 1 && urlSplitItems[1] !== defQueryParams) {
    url = `${urlSplitItems[0]}?${defQueryParams}`;
  } else {
    url = `${url}?${defQueryParams}`;
  }
  return url;
}
/**
 * Check if a reserved keyword is present in properties/traits
 * @param {*} properties
 * @param {*} reservedKeywords
 * @param {*} type
 */
function checkReservedKeywords(message, messageType) {
  //  properties, traits, contextualTraits are either undefined or object
  const { properties, traits } = message;
  if (properties) {
    Object.keys(properties).forEach((property) => {
      if (ReservedPropertyKeywords.indexOf(property.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in properties--> ${property} with ${messageType} call`
        );
      }
    });
  }
  if (traits) {
    Object.keys(traits).forEach((trait) => {
      if (ReservedPropertyKeywords.indexOf(trait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits--> ${trait} with ${messageType} call`
        );
      }
    });
  }
  const contextualTraits = message.context.traits;
  if (contextualTraits) {
    Object.keys(contextualTraits).forEach((contextTrait) => {
      if (ReservedPropertyKeywords.indexOf(contextTrait.toLowerCase()) >= 0) {
        logger.error(
          `Warning! : Reserved keyword used in traits --> ${contextTrait} with ${messageType} call`
        );
      }
    });
  }
}

/* ------- Start FlattenJson -----------
 * This function flatten given json object to single level.
 * So if there is nested object or array, all will appear in first level properties of an object.
 * Following is case we are handling in this function ::
 * condition 1: String
 * condition 2: Array
 * condition 3: Nested object
 */
function recurse(cur, prop, result) {
  const res = result;
  if (Object(cur) !== cur) {
    res[prop] = cur;
  } else if (Array.isArray(cur)) {
    const l = cur.length;
    for (let i = 0; i < l; i += 1)
      recurse(cur[i], prop ? `${prop}.${i}` : `${i}`, res);
    if (l === 0) res[prop] = [];
  } else {
    let isEmpty = true;
    Object.keys(cur).forEach((key) => {
      isEmpty = false;
      recurse(cur[key], prop ? `${prop}.${key}` : key, res);
    });
    if (isEmpty) res[prop] = {};
  }
  return res;
}

function flattenJsonPayload(data) {
  return recurse(data, "", {});
}
/* ------- End FlattenJson ----------- */
/**
 *
 * @param {*} message
 * @param {*} destination
 * @param {*} keys
 * @param {*} exclusionFields
 * Extract fields from message with exclusions
 * Pass the keys of message for extraction and
 * exclusion fields to exclude and the payload to map into
 * -----------------Example-------------------
 * extractCustomFields(message,payload,["traits", "context.traits", "properties"], "email",
 * ["firstName",
 * "lastName",
 * "phone",
 * "title",
 * "organization",
 * "city",
 * "region",
 * "country",
 * "zip",
 * "image",
 * "timezone"])
 * -------------------------------------------
 * The above call will map the fields other than the
 * exclusion list from the given keys to the destination payload
 *
 */

function extractCustomFields(message, destination, keys, exclusionFields) {
  keys.map((key) => {
    const messageContext = get(message, key);
    if (messageContext) {
      const objKeys = [];
      Object.keys(messageContext).map((k) => {
        if (exclusionFields.indexOf(k) < 0) {
          objKeys.push(k);
        }
      });
      objKeys.map((k) => {
        if (!(typeof messageContext[k] === "undefined")) {
          set(destination, k, get(messageContext, k));
        }
      });
    }
  });
  return destination;
}
/**
 *
 * @param {*} message
 *
 * Use get-value to retrieve defined traits from message traits
 */
function getDefinedTraits(message) {
  const traitsValue = {
    userId:
      get(message, "userId") ||
      get(message, "context.traits.userId") ||
      get(message, "anonymousId"),
    email:
      get(message, "context.traits.email") ||
      get(message, "context.traits.Email") ||
      get(message, "context.traits.E-mail"),
    phone:
      get(message, "context.traits.phone") ||
      get(message, "context.traits.Phone"),
    firstName:
      get(message, "context.traits.firstName") ||
      get(message, "context.traits.firstname") ||
      get(message, "context.traits.first_name"),
    lastName:
      get(message, "context.traits.lastName") ||
      get(message, "context.traits.lastname") ||
      get(message, "context.traits.last_name"),
    name:
      get(message, "context.traits.name") ||
      get(message, "context.traits.Name"),
    city:
      get(message, "context.traits.city") ||
      get(message, "context.traits.City"),
    country:
      get(message, "context.traits.country") ||
      get(message, "context.traits.Country"),
  };

  if (
    !get(traitsValue, "name") &&
    get(traitsValue, "firstName") &&
    get(traitsValue, "lastName")
  ) {
    set(
      traitsValue,
      "name",
      `${get(traitsValue, "firstName")} ${get(traitsValue, "lastName")}`
    );
  }
  return traitsValue;
}

/**
 * To check if a variable is storing object or not
 */
const isObject = (obj) => {
  return type(obj) === "object";
};

/**
 * To check if a variable is storing array or not
 */
const isArray = (obj) => {
  return type(obj) === "array";
};

const isDefined = (x) => x !== undefined;
const isNotNull = (x) => x !== null;
const isDefinedAndNotNull = (x) => isDefined(x) && isNotNull(x);

const getDataFromSource = (src, dest, key, properties) => {
  const data = {};
  if (isArray(src)) {
    for (let index = 0; index < src.length; index += 1) {
      if (src[index] === key.toLowerCase()) {
        data[dest] = properties[key].toString();
        if (data) {
          // return only if the value is valid.
          // else look for next possible source in precedence
          return data;
        }
      }
    }
  } else if (typeof src === "string")
    if (src === key.toLowerCase()) {
      data[dest] = properties[key].toString();
      // eslint-disable-next-line no-param-reassign
    }
  return data;
};

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getRevenue,
  getDefaultPageProperties,
  getUserProvidedConfigUrl,
  findAllEnabledDestinations,
  transformToRudderNames,
  transformToServerNames,
  handleError,
  rejectArr,
  type,
  flattenJsonPayload,
  checkReservedKeywords,
  getReferrer,
  getReferringDomain,
  extractCustomFields,
  getDefinedTraits,
  isObject,
  isArray,
  isDefinedAndNotNull,
  getDataFromSource,
  stripTrailingSlashes,
};

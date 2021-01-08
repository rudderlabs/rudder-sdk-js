// import * as XMLHttpRequestNode from "Xmlhttprequest";
import { parse } from "component-url";
import logger from "./logUtil";
import { commonNames } from "../integrations/integration_cname";
import { clientToServerNames } from "../integrations/client_server_name";
import { CONFIG_URL, ReservedPropertyKeywords } from "./constants";

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
 *
 * Utility function for UUID genration
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
      logger.debug("status 200");
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
  xhr.setRequestHeader("Authorization", `Basic ${btoa(`${writeKey}:`)}`);

  xhr.onload = function () {
    const { status } = xhr;
    if (status == 200) {
      logger.debug("status 200 " + "calling callback");
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
  const { referrer } = document;
  const { search } = window.location;
  const { title } = document;
  const url = getUrl(search);

  return {
    path,
    referrer,
    search,
    title,
    url,
  };
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
  const orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

  // it's always revenue, unless it's called during an order completion.
  if (!revenue && eventName && eventName.match(orderCompletedRegExp)) {
    revenue = properties.total;
  }

  return getCurrency(revenue);
}

/**
 *
 *
 * @param {*} integrationObject
 */
function tranformToRudderNames(integrationObject) {
  Object.keys(integrationObject).forEach((key) => {
    if (integrationObject.hasOwnProperty(key)) {
      if (commonNames[key]) {
        integrationObject[commonNames[key]] = integrationObject[key];
      }
      if (key != "All") {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
        if (commonNames[key] != undefined && commonNames[key] != key) {
          delete integrationObject[key];
        }
      }
    }
  });
}

function transformToServerNames(integrationObject) {
  Object.keys(integrationObject).forEach((key) => {
    if (integrationObject.hasOwnProperty(key)) {
      if (clientToServerNames[key]) {
        integrationObject[clientToServerNames[key]] = integrationObject[key];
      }
      if (key != "All") {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys
        if (
          clientToServerNames[key] != undefined &&
          clientToServerNames[key] != key
        ) {
          delete integrationObject[key];
        }
      }
    }
  });
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
    configPlaneEnabledIntegrations.length == 0
  ) {
    return enabledList;
  }
  let allValue = true;
  if (typeof configPlaneEnabledIntegrations[0] === "string") {
    if (sdkSuppliedIntegrations.All != undefined) {
      allValue = sdkSuppliedIntegrations.All;
    }
    configPlaneEnabledIntegrations.forEach((intg) => {
      if (!allValue) {
        // All false ==> check if intg true supplied
        if (
          sdkSuppliedIntegrations[intg] != undefined &&
          sdkSuppliedIntegrations[intg] == true
        ) {
          enabledList.push(intg);
        }
      } else {
        // All true ==> intg true by default
        let intgValue = true;
        // check if intg false supplied
        if (
          sdkSuppliedIntegrations[intg] != undefined &&
          sdkSuppliedIntegrations[intg] == false
        ) {
          intgValue = false;
        }
        if (intgValue) {
          enabledList.push(intg);
        }
      }
    });

    return enabledList;
  }

  if (typeof configPlaneEnabledIntegrations[0] === "object") {
    if (sdkSuppliedIntegrations.All != undefined) {
      allValue = sdkSuppliedIntegrations.All;
    }
    configPlaneEnabledIntegrations.forEach((intg) => {
      if (!allValue) {
        // All false ==> check if intg true supplied
        if (
          sdkSuppliedIntegrations[intg.name] != undefined &&
          sdkSuppliedIntegrations[intg.name] == true
        ) {
          enabledList.push(intg);
        }
      } else {
        // All true ==> intg true by default
        let intgValue = true;
        // check if intg false supplied
        if (
          sdkSuppliedIntegrations[intg.name] != undefined &&
          sdkSuppliedIntegrations[intg.name] == false
        ) {
          intgValue = false;
        }
        if (intgValue) {
          enabledList.push(intg);
        }
      }
    });

    return enabledList;
  }
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
  if (configUrl.indexOf("sourceConfig") == -1) {
    url = url.slice(-1) == "/" ? url.slice(0, -1) : url;
    url = `${url}/sourceConfig/`;
  }
  url = url.slice(-1) == "/" ? url : `${url}/`;
  if (url.indexOf("?") > -1) {
    if (url.split("?")[1] !== CONFIG_URL.split("?")[1]) {
      url = `${url.split("?")[0]}?${CONFIG_URL.split("?")[1]}`;
    }
  } else {
    url = `${url}?${CONFIG_URL.split("?")[1]}`;
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
  const contextualTraits = message.context.traits;
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
 * So if there is nested object or array, all will apear in first level properties of an object.
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
  tranformToRudderNames,
  transformToServerNames,
  handleError,
  rejectArr,
  type,
  flattenJsonPayload,
  checkReservedKeywords,
};

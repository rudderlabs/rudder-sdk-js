/* eslint-disable no-bitwise */
import { parse } from "component-url";
import get from "get-value";
import { LOAD_ORIGIN } from "../integrations/ScriptLoader";
import logger from "./logUtil";
import { commonNames } from "./integration_cname";
import { clientToServerNames } from "./client_server_name";
import { CONFIG_URL, RESERVED_KEYS } from "./constants";
import Storage from "./storage";


/**
 * This function is to send handled errors to Bugsnag if Bugsnag client is available
 * @param {Error} error Error instance from handled error
 */
 function notifyError(error) {
  if (window.rsBugsnagClient) {
    window.rsBugsnagClient.notify(error);
  }
}

function handleError(error, analyticsInstance) {
  let errorMessage = error.message;
  try {
    if (error instanceof Event) {
      // Discard all the non-script loading errors
      if (error.target && error.target.localName !== "script") return;

      // Discard errors of scripts that are not loaded by the SDK
      if (error.target.dataset && error.target.dataset.loader !== LOAD_ORIGIN)
        return;

      errorMessage = `error in script loading:: src::  ${error.target.src} id:: ${error.target.id}`;

      // SDK triggered ad-blocker script
      if (error.target.id === "ad-block") {
        analyticsInstance.page(
          "RudderJS-Initiated",
          "ad-block page request",
          { path: "/ad-blocked", title: errorMessage },
          analyticsInstance.sendAdblockPageOptions
        );
        // No need to proceed further for Ad-block errors
        return;
      }
    }

    errorMessage = `[handleError]:: "${errorMessage}"`;
    logger.error(errorMessage);
    let errorObj = error;
    if (!(error instanceof Error)) errorObj = new Error(errorMessage);
    notifyError(errorObj);
  } catch (err) {
    logger.error("[handleError] Exception:: ", err);
    notifyError(err);
  }
}

/**
 *
 * Utility method for excluding null and empty values in JSON
 * @param {*} key
 * @param {*} value
 * @returns
 */
function replacer(key, value) {
  if (value === null || value === undefined) {
    return;
  }
  return value;
}

/**
 * Utility method to remove '/' at the end of URL
 * @param {*} inURL
 */
function removeTrailingSlashes(inURL) {
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
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
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
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
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
  const cb = callback.bind(context);

  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.setRequestHeader(
    "Authorization",
    `Basic ${btoa(`${writeKey}:`)}`
    // `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`
  );

  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      // logger.debug("status 200 " + "calling callback");
      cb(200, xhr.responseText);
    } else {
      handleError(
        new Error(`request failed with status: ${xhr.status} for url: ${url}`)
      );
      cb(status);
    }
  };
  xhr.send();
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

function getCanonicalUrl() {
  const tags = document.getElementsByTagName("link");
  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i];
    if (!tag) break;
    if (tag.getAttribute("rel") === "canonical") {
      return tag.getAttribute("href");
    }
  }
}

/**
 * This function is to add breadcrumbs
 * @param {string} breadcrumb Message to add insight of an user's journey before the error occurred
 */
function leaveBreadcrumb(breadcrumb) {
  if (window.rsBugsnagClient) {
    window.rsBugsnagClient.leaveBreadcrumb(breadcrumb);
  }
}

function getUrl(search) {
  const canonicalUrl = getCanonicalUrl();
  let url = window.location.href;
  if (canonicalUrl) {
    url = canonicalUrl.indexOf("?") > -1 ? canonicalUrl : canonicalUrl + search;
  }
  const hashIndex = url.indexOf("#");
  return hashIndex > -1 ? url.slice(0, hashIndex) : url;
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
  // eslint-disable-next-line camelcase
  const tab_url = window.location.href;

  const referrer = getReferrer();
  // eslint-disable-next-line camelcase
  const referring_domain = getReferringDomain(referrer);
  // eslint-disable-next-line camelcase
  const initial_referrer = Storage.getInitialReferrer();
  // eslint-disable-next-line camelcase
  const initial_referring_domain = Storage.getInitialReferringDomain();
  return {
    path,
    referrer,
    // eslint-disable-next-line camelcase
    referring_domain,
    search,
    title,
    url,
    // eslint-disable-next-line camelcase
    tab_url,
    // eslint-disable-next-line camelcase
    initial_referrer,
    // eslint-disable-next-line camelcase
    initial_referring_domain,
  };
}

function transformNamesCore(integrationObject, namesObj) {
  Object.keys(integrationObject).forEach((key) => {
    if (integrationObject[key]) {
      if (namesObj[key]) {
        // eslint-disable-next-line no-param-reassign
        integrationObject[namesObj[key]] = integrationObject[key];
      }
      if (key !== "All") {
        // delete user supplied keys except All and if except those where
        // old keys are not present or old keys are same as transformed keys
        if (namesObj[key] !== undefined && namesObj[key] !== key) {
          // eslint-disable-next-line no-param-reassign
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
  const intgData = [];
  if (typeof configPlaneEnabledIntegrations[0] === "string") {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData.push({
        intgName: intg,
        intObj: intg,
      });
    });
  } else if (typeof configPlaneEnabledIntegrations[0] === "object") {
    configPlaneEnabledIntegrations.forEach((intg) => {
      intgData.push({
        intgName: intg.name,
        intObj: intg,
      });
    });
  }

  intgData.forEach(({ intgName, intObj }) => {
    if (!allValue) {
      // All false ==> check if intg true supplied
      if (
        sdkSuppliedIntegrations[intgName] != undefined &&
        sdkSuppliedIntegrations[intgName] == true
      ) {
        enabledList.push(intObj);
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
        enabledList.push(intObj);
      }
    }
  });

  return enabledList;
}

function getUserProvidedConfigUrl(configUrl, defConfigUrl) {
  let url = configUrl;
  if (url.indexOf("sourceConfig") === -1) {
    url = `${removeTrailingSlashes(url)}/sourceConfig/`;
  }
  url = url.slice(-1) === "/" ? url : `${url}/`;
  const defQueryParams = defConfigUrl.split("?")[1];
  const urlSplitItems = url.split("?");
  if (urlSplitItems.length > 1 && urlSplitItems[1] !== defQueryParams) {
    url = `${urlSplitItems[0]}?${defQueryParams}`;
  } else {
    url = `${url}?${defQueryParams}`;
  }
  return url;
}

/**
 * Check if a reserved keyword is present in the given object
 * @param {*} inpObj
 * @param {*} msgType
 */
function checkForReservedKeywords(inpObj, msgType) {
  if (inpObj) {
    Object.keys(inpObj).forEach((key) => {
      if (RESERVED_KEYS.includes(key.toLowerCase())) {
        logger.error(`Reserved keyword '${key}' is used in '${msgType}' call`);
      }
    });
  }
}

/**
 * Check if a reserved keyword is present in properties/traits
 * @param {*} message
 * @param {*} msgType
 */
function checkReservedKeywords(message, msgType) {
  // properties, traits, contextualTraits are either undefined or object
  const objArr = [message.properties, message.traits, message.context.traits];
  objArr.forEach((obj) => {
    checkForReservedKeywords(obj, msgType);
  });
}

const getConfigUrl = (writeKey) => {
  return CONFIG_URL.concat(CONFIG_URL.includes("?") ? "&" : "?").concat(
    writeKey ? `writeKey=${writeKey}` : ""
  );
};

const getSDKUrlInfo = () => {
  const scripts = document.getElementsByTagName("script");
  let sdkURL;
  let isStaging = false;
  for (let i = 0; i < scripts.length; i += 1) {
    const curScriptSrc = removeTrailingSlashes(scripts[i].getAttribute("src"));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(
        /^(https?:)?\/\/.*rudder-analytics(-staging)?(\.min)?\.js$/,
      );
      if (urlMatches) {
        sdkURL = curScriptSrc;
        isStaging = urlMatches[2] !== undefined;
        break;
      }
    }
  }
  return { sdkURL, isStaging };
};


export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getDefaultPageProperties,
  getUserProvidedConfigUrl,
  findAllEnabledDestinations,
  transformToRudderNames,
  transformToServerNames,
  handleError,
  checkReservedKeywords,
  getReferrer,
  getReferringDomain,
  commonNames,
  removeTrailingSlashes,
  getConfigUrl,
  getSDKUrlInfo,
  notifyError,
  leaveBreadcrumb,
  get,
};

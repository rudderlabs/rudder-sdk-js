//import * as XMLHttpRequestNode from "Xmlhttprequest";
import logger from "./logUtil";
import {commonNames} from "../integrations/integration_cname"
import {clientToServerNames} from "../integrations/client_server_name"

let XMLHttpRequestNode;
if (!process.browser) {
  XMLHttpRequestNode = require("Xmlhttprequest");
}

let btoaNode;
if (!process.browser) {
  btoaNode = require("btoa");
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
    return undefined;
  } else {
    return value;
  }
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
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;
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
  let curDateTime = new Date().toISOString();
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
  //server-side integration, XHR is node module

  if (process.browser) {
    var xhr = new XMLHttpRequest();
  } else {
    var xhr = new XMLHttpRequestNode.XMLHttpRequest();
  }
  xhr.open("GET", url, false);
  xhr.onload = function() {
    let status = xhr.status;
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
  //server-side integration, XHR is node module
  let cb_ = callback.bind(context);

  if (process.browser) {
    var xhr = new XMLHttpRequest();
  } else {
    var xhr = new XMLHttpRequestNode.XMLHttpRequest();
  }
  xhr.open("GET", url, true);
  if (process.browser) {
    xhr.setRequestHeader("Authorization", "Basic " + btoa(writeKey + ":"));
  } else {
    xhr.setRequestHeader("Authorization", "Basic " + btoaNode(writeKey + ":"));
  }

  xhr.onload = function() {
    let status = xhr.status;
    if (status == 200) {
      logger.debug("status 200 " + "calling callback");
      cb_(200, xhr.responseText);
    } else {
      handleError(
        new Error(
          "request failed with status: " + xhr.status + " for url: " + url
        )
      );
      cb_(status);
    }
  };
  xhr.send();
}

function handleError(error, analyticsInstance) {
  let errorMessage = error.message ? error.message : undefined;
  let sampleAdBlockTest = undefined
  try {
    if (error instanceof Event) {
      if (error.target && error.target.localName == "script") {
        errorMessage = "error in script loading:: src::  " + error.target.src + " id:: " + error.target.id;
        if(analyticsInstance && error.target.src.includes("adsbygoogle")) {
          sampleAdBlockTest = true
          analyticsInstance.page("RudderJS-Initiated", "ad-block page request", {path: "/ad-blocked", title: errorMessage}, analyticsInstance.sendAdblockPageOptions)
        }
      }
    }
    if (errorMessage && !sampleAdBlockTest) {
      logger.error("[Util] handleError:: ", errorMessage);
    }
  } catch (e) {
    logger.error("[Util] handleError:: ", e)
  }
  
}

function getDefaultPageProperties() {
  let canonicalUrl = getCanonicalUrl();
  let path = canonicalUrl ? canonicalUrl.pathname : window.location.pathname;
  let referrer = document.referrer;
  let search = window.location.search;
  let title = document.title;
  let url = getUrl(search);

  return {
    path: path,
    referrer: referrer,
    search: search,
    title: title,
    url: url
  };
}

function getUrl(search) {
  let canonicalUrl = getCanonicalUrl();
  let url = canonicalUrl
    ? canonicalUrl.indexOf("?") > -1
      ? canonicalUrl
      : canonicalUrl + search
    : window.location.href;
  let hashIndex = url.indexOf("#");
  return hashIndex > -1 ? url.slice(0, hashIndex) : url;
}

function getCanonicalUrl() {
  var tags = document.getElementsByTagName("link");
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
  var revenue = properties.revenue;
  var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

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
  Object.keys(integrationObject).forEach(key => {
    if(integrationObject.hasOwnProperty(key)) {
      if(commonNames[key]) {
        integrationObject[commonNames[key]] = integrationObject[key]
      }
      if(key != "All") {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys 
        if(commonNames[key] != undefined && commonNames[key] != key) {
          delete integrationObject[key]
        }
      }
      
    }
  })
}

function transformToServerNames(integrationObject) {
  Object.keys(integrationObject).forEach(key => {
    if(integrationObject.hasOwnProperty(key)) {
      if(clientToServerNames[key]) {
        integrationObject[clientToServerNames[key]] = integrationObject[key]
      }
      if(key != "All") {
        // delete user supplied keys except All and if except those where oldkeys are not present or oldkeys are same as transformed keys 
        if(clientToServerNames[key] != undefined && clientToServerNames[key] != key) {
          delete integrationObject[key]
        }
      }
      
    }
  })
}

/**
 * 
 * @param {*} sdkSuppliedIntegrations 
 * @param {*} configPlaneEnabledIntegrations 
 */
function findAllEnabledDestinations(sdkSuppliedIntegrations, configPlaneEnabledIntegrations) {
  let enabledList = []
  if(!configPlaneEnabledIntegrations || configPlaneEnabledIntegrations.length == 0) {
    return enabledList
  }
  let allValue = true
  if(typeof configPlaneEnabledIntegrations[0] == "string") {
    if(sdkSuppliedIntegrations["All"] != undefined) {
      allValue = sdkSuppliedIntegrations["All"]
    }
    configPlaneEnabledIntegrations.forEach(intg => {
      if(!allValue) {
        // All false ==> check if intg true supplied
        if(sdkSuppliedIntegrations[intg]!= undefined && sdkSuppliedIntegrations[intg] == true) {
          enabledList.push(intg)
        }
      } else {
        // All true ==> intg true by default
        let intgValue = true
        // check if intg false supplied
        if(sdkSuppliedIntegrations[intg] != undefined && sdkSuppliedIntegrations[intg] == false) {
          intgValue = false
        }
        if(intgValue) {
          enabledList.push(intg)
        }
      }
    })

    return enabledList
  }

  if(typeof configPlaneEnabledIntegrations[0] == "object") {
    if(sdkSuppliedIntegrations["All"] != undefined) {
      allValue = sdkSuppliedIntegrations["All"]
    }
    configPlaneEnabledIntegrations.forEach(intg => {
      if(!allValue) {
        // All false ==> check if intg true supplied
        if(sdkSuppliedIntegrations[intg.name]!= undefined && sdkSuppliedIntegrations[intg.name] == true) {
          enabledList.push(intg)
        }
      } else {
        // All true ==> intg true by default
        let intgValue = true
        // check if intg false supplied
        if(sdkSuppliedIntegrations[intg.name] != undefined && sdkSuppliedIntegrations[intg.name] == false) {
          intgValue = false
        }
        if(intgValue) {
          enabledList.push(intg)
        }
      }
    })

    return enabledList
  }

}
function rejectArr(obj, fn) {
  fn = fn || compact;
  return "array" == type(obj) ? rejectarray(obj, fn) : rejectobject(obj, fn);
}

var rejectarray = function (arr, fn) {
  var ret = [];

  for (var i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

var rejectobject = function (obj, fn) {
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k];
    }
  }

  return ret;
};

function compact(value) {
  return null == value;
}

function type(val) {
  switch (toString.call(val)) {
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

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getRevenue,
  getDefaultPageProperties,
  findAllEnabledDestinations,
  tranformToRudderNames,
  transformToServerNames,
  handleError,
  rejectArr
};

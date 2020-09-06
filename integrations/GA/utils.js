// import * as XMLHttpRequestNode from "Xmlhttprequest";
import logger from "../../utils/logUtil";

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

  var xhr = new XMLHttpRequest();
  
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

  var xhr = new XMLHttpRequest();
  
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
  handleError,
  rejectArr,
};

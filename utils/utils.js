//import * as XMLHttpRequestNode from "Xmlhttprequest";
import logger from "./logUtil";

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

function handleError(error) {
  let errorMessage = error.message ? error.message : undefined;
  if (error instanceof Event) {
    if (error.target && error.target.localName == "script") {
      errorMessage = "error in script loading: " + error.target.id;
    }
  }
  if (errorMessage) {
    logger.error("[Util] handleError:: ", errorMessage);
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

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON,
  getRevenue,
  getDefaultPageProperties,
  handleError
};

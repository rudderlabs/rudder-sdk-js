import * as XMLHttpRequestNode from "Xmlhttprequest";

/**
 *
 * Utility method for excluding null and empty values in JSON
 * @param {*} key
 * @param {*} value
 * @returns
 */
function replacer(key, value) {
  if (!value || value === "") {
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
    var xhr = new XMLHttpRequestNode();
  } else {
    var xhr = new XMLHttpRequestNode.XMLHttpRequest();
  }
  xhr.open("GET", url, false);
  xhr.onload = function() {
    let status = xhr.status;
    if (status == 200) {
      console.log("status 200");
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
    var xhr = new XMLHttpRequestNode();
  } else {
    var xhr = new XMLHttpRequestNode.XMLHttpRequest();
  }
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", "Basic " + btoa(writeKey + ":"));
  xhr.onload = function() {
    let status = xhr.status;
    if (status == 200) {
      console.log("status 200 " + "calling callback");
      cb_(200, xhr.responseText);
    } else {
      cb_(status);
    }
  };
  xhr.send();
}

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON
};

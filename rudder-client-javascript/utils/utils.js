//Utility method for excluding null and empty values in JSON
function replacer(key, value) {
  if (!value || value == "") {
    return undefined;
  } else {
    return value;
  }
}
//Utility function for UUID genration
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

//Utility function to get current time (formatted) for including in sent_at field
function getCurrentTimeFormatted() {
  let curDateTime = new Date().toISOString();
  let curDate = curDateTime.split("T")[0];
  let curTimeExceptMillis = curDateTime
    .split("T")[1]
    .split("Z")[0]
    .split(".")[0];
  let curTimeMillis = curDateTime.split("Z")[0].split(".")[1];
  return curDate + " " + curTimeExceptMillis + "+" + curTimeMillis;
}

//Utility function to retrieve configuration JSON from server
function getJSON(url, wrappers, isLoaded, callback) {
  //server-side integration, XHR is node module

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.onload = function() {
    let status = xhr.status;
    if (status == 200) {
      console.log("status 200");
      callback(null, xhr.responseText, wrappers, isLoaded);
    } else {
      callback(status);
    }
    console.log("in onload");
  };
  console.log("before send");
  xhr.send();
  console.log("after send");
}

//Utility function to retrieve configuration JSON from server
function getJSONTrimmed(context, url, callback) {
  //server-side integration, XHR is node module
  let cb_ = callback.bind(context);
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function() {
    let status = xhr.status;
    if (status == 200) {
      console.log("status 200");
      cb_(200, xhr.responseText);
    } else {
      cb_(status);
    }
    console.log("in response process");
  };
  console.log("before send");
  xhr.send();
  console.log("after send");
}

export {
  replacer,
  generateUUID,
  getCurrentTimeFormatted,
  getJSONTrimmed,
  getJSON
};

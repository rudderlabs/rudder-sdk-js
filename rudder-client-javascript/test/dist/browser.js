var analytics = (function (exports) {
  'use strict';

  function getJSONTrimmed(url, callback) {
    //server-side integration, XHR is node module
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
      var status = xhr.status;

      if (status == 200) {
        console.log("status 200");
        callback(200, xhr.responseText);
      } else {
        callback(status);
      }

      console.log("in response process");
    };

    console.log("before send");
    xhr.send();
    console.log("after send");
  }

  const CONFIG_URL = "https://api.rudderlabs.com";
  /* module.exports = {
    MessageType: MessageType,
    ECommerceParamNames: ECommerceParamNames,
    ECommerceEvents: ECommerceEvents,
    RudderIntegrationPlatform: RudderIntegrationPlatform,
    BASE_URL: BASE_URL,
    CONFIG_URL: CONFIG_URL,
    FLUSH_QUEUE_SIZE: FLUSH_QUEUE_SIZE
  }; */

  class test {
    constructor() {
      this.prop1 = "val1";
      this.prop2 = "val2";
      this.ready = false;
    }

    page() {
      //if (this.ready) {
      console.log("args ", ...arguments);
      console.log("page called " + this.prop1); //}
    }

    track() {
      //if (this.ready) {
      console.log("track called " + this.prop2); //}
    }

    load(writeKey) {
      console.log("inside load " + this.prop1);
      getJSONTrimmed(CONFIG_URL + "/source-config?write_key=" + writeKey, (status, response) => {
        console.log("from callback " + this.prop1);
        console.log(response);
        this.ready = true;
      });
      /* setTimeout(() => {
        this.ready = true;
      }, 5000); */
    }

  }

  let instance = new test();

  {
    console.log("is present? " + !!window.analytics);
    let methodArg = window.analytics[0];
    instance[methodArg[0]](methodArg[1]);
    let methodArgNext = window.analytics[1];
    instance[methodArgNext[0]]("test args 1", "test args 2");
  }

  let page = instance.page.bind(instance);
  let track = instance.track.bind(instance);
  let load = instance.load.bind(instance);

  exports.load = load;
  exports.page = page;
  exports.track = track;

  return exports;

}({}));

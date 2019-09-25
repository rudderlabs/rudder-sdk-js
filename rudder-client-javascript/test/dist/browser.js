var analytics = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function getJSONTrimmed(context, url, callback) {
    //server-side integration, XHR is node module
    let cb = callback.bind(context);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
      var status = xhr.status;

      if (status == 200) {
        console.log("status 200");
        cb(200, xhr.responseText);
      } else {
        cb(status);
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

  function ScriptLoader(id, src) {
    console.log("in script loader=== " + id); //if (document.getElementById(id)) {
    //console.log("id not found==");

    var js = document.createElement("script");
    js.src = src;
    js.type = "text/javascript";
    js.id = id;
    var e = document.getElementsByTagName("script")[0];
    console.log("==script==", e);
    e.parentNode.insertBefore(js, e); //}
  } //('hubspot-integration', '//HubSpot.js');

  var HubSpot =
  /*#__PURE__*/
  function () {
    function HubSpot(hubId) {
      _classCallCheck(this, HubSpot);

      this.hubId = hubId;
    }

    _createClass(HubSpot, [{
      key: "init",
      value: function init() {
        var hubspotJs = "http://js.hs-scripts.com/" + this.hubId + ".js";
        ScriptLoader("hubspot-integration", hubspotJs);
        console.log("===in init===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        console.log("in HubspotAnalyticsManager identify");
        var traits = rudderElement.rl_message.rl_context.rl_traits;
        var traitsValue = {};

        for (var k in traits) {
          if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
            var hubspotkey = k.startsWith("rl_") ? k.substring(3, k.length) : k;
            traitsValue[hubspotkey] = traits[k];
          }
        }

        if (traitsValue["address"]) {
          var address = traitsValue["address"]; //traitsValue.delete(address)

          delete traitsValue["address"];

          for (var _k in address) {
            if (!!Object.getOwnPropertyDescriptor(address, _k) && address[_k]) {
              var _hubspotkey = _k.startsWith("rl_") ? _k.substring(3, _k.length) : _k;

              _hubspotkey = _hubspotkey == "street" ? "address" : _hubspotkey;
              traitsValue[_hubspotkey] = address[_k];
            }
          }
        }

        var userProperties = rudderElement.rl_message.rl_context.rl_user_properties;

        for (var _k2 in userProperties) {
          if (!!Object.getOwnPropertyDescriptor(userProperties, _k2) && userProperties[_k2]) {
            var _hubspotkey2 = _k2.startsWith("rl_") ? _k2.substring(3, _k2.length) : _k2;

            traitsValue[_hubspotkey2] = userProperties[_k2];
          }
        }

        console.log(traitsValue);

        if (typeof window !== undefined) {
          var _hsq = window._hsq = window._hsq || [];

          _hsq.push(["identify", traitsValue]);
        }
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
        console.log("in HubspotAnalyticsManager track");

        var _hsq = window._hsq = window._hsq || [];

        var eventValue = {};
        eventValue["id"] = rudderElement.rl_message.rl_event;

        if (rudderElement.rl_message.rl_properties && rudderElement.rl_message.rl_properties.revenue) {
          console.log("revenue: " + rudderElement.rl_message.rl_properties.revenue);
          eventValue["value"] = rudderElement.rl_message.rl_properties.revenue;
        }

        _hsq.push(["trackEvent", eventValue]);
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        console.log("in HubspotAnalyticsManager page");

        var _hsq = window._hsq = window._hsq || [];

        console.log("path: " + rudderElement.rl_message.rl_properties.path);

        _hsq.push(["setPath", rudderElement.rl_message.rl_properties.path]);

        _hsq.push(["trackPageView"]);
      }
    }, {
      key: "loaded",
      value: function loaded() {
        return !!(window._hsq && window._hsq.push !== Array.prototype.push);
      }
    }]);

    return HubSpot;
  }();

  //import nodeCode from "./node";
  var index =  {
    HubSpot
  } ;

  var integrations = {
    HS: index.HubSpot
  };

  function init(intgArray, configArray) {
    console.log("supported intgs ", integrations);
    var i = 0;
    intgArray.forEach(function (intg) {
      console.log("--name--", intg);
      var intgClass = integrations[intg];
      console.log("--class-- ", intgClass);

      if (intg === "HS") {
        var hubId = configArray[i].hubId;
        console.log("==hubId== " + hubId);
        hubId = "6405167";
        var intgInstance = new intgClass(hubId);
        intgInstance.init();
      }
    });
  }

  var test =
  /*#__PURE__*/
  function () {
    function test() {
      _classCallCheck(this, test);

      this.prop1 = "val1";
      this.prop2 = "val2";
      this.ready = false;
      this.clientIntegrations = [];
      this.configArray = [];
    }

    _createClass(test, [{
      key: "processResponse",
      value: function processResponse(status, response) {
        console.log("from callback " + this.prop1);
        console.log(response);
        response = JSON.parse(response);
        response.source.destinations.forEach(function (destination, index) {
          console.log("Destination " + index + " Enabled? " + destination.enabled + " Type: " + destination.destinationDefinition.name + " Use Native SDK? " + destination.config.useNativeSDK);

          if (destination.enabled && destination.config.useNativeSDK) {
            this.clientIntegrations.push(destination.destinationDefinition.name);
            this.configArray.push(destination.config);
          }
        }, this);
        init(this.clientIntegrations, this.configArray);
      }
    }, {
      key: "page",
      value: function page() {
        var _console;

        //if (this.ready) {
        (_console = console).log.apply(_console, ["args "].concat(Array.prototype.slice.call(arguments)));

        console.log("page called " + this.prop1); //}
      }
    }, {
      key: "track",
      value: function track() {
        //if (this.ready) {
        console.log("track called " + this.prop2); //}
      }
    }, {
      key: "load",
      value: function load(writeKey) {
        console.log("inside load " + this.prop1);
        getJSONTrimmed(this, CONFIG_URL + "/source-config?write_key=" + writeKey, this.processResponse);
        /* setTimeout(() => {
          this.ready = true;
        }, 5000); */
      }
    }]);

    return test;
  }();

  var instance = new test();

  {
    console.log("is present? " + !!window.analytics);
    var methodArg = window.analytics ? window.analytics[0] : [];

    if (methodArg.length > 0) {
      instance[methodArg[0]](methodArg[1]);
      instance[methodArgNext[0]]("test args 1", "test args 2");
    }

    var methodArgNext = window.analytics ? window.analytics[1] : [];

    if (methodArgNext.length > 0) {
      instance[methodArg[0]](methodArg[1]);
    }
  }

  var page = instance.page.bind(instance);
  var track = instance.track.bind(instance);
  var load = instance.load.bind(instance);

  exports.load = load;
  exports.page = page;
  exports.track = track;

  return exports;

}({}));

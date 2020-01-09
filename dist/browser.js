var rudderanalytics = (function (exports) {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

<<<<<<< HEAD
=======
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

>>>>>>> update dist files
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var LOG_LEVEL_INFO = 1,
      LOG_LEVEL_DEBUG = 2,
      LOG_LEVEL_WARN = 3,
      LOG_LEVEL_ERROR = 4,
      LOG_LEVEL = LOG_LEVEL_ERROR;
  var logger = {
    setLogLevel: function setLogLevel(logLevel) {
      switch (logLevel.toUpperCase()) {
        case 'INFO':
          LOG_LEVEL = LOG_LEVEL_INFO;
          return;

        case 'DEBUG':
          LOG_LEVEL = LOG_LEVEL_DEBUG;
          return;

        case 'WARN':
          LOG_LEVEL = LOG_LEVEL_WARN;
          return;
      }
    },
    info: function info() {
      if (LOG_LEVEL <= LOG_LEVEL_INFO) {
        var _console;

        (_console = console).info.apply(_console, arguments);
      }
    },
    debug: function debug() {
      if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
        var _console2;

        (_console2 = console).debug.apply(_console2, arguments);
      }
    },
    warn: function warn() {
      if (LOG_LEVEL <= LOG_LEVEL_WARN) {
        var _console3;

        (_console3 = console).warn.apply(_console3, arguments);
      }
    },
    error: function error() {
      if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
        var _console4;

        (_console4 = console).error.apply(_console4, arguments);
      }
    }
  };

  //import * as XMLHttpRequestNode from "Xmlhttprequest";
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
    var d = new Date().getTime();

    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
    });
  }
  /**
   *
   * Utility function to get current time (formatted) for including in sent_at field
   * @returns
   */


  function getCurrentTimeFormatted() {
    var curDateTime = new Date().toISOString(); // Keeping same as iso string

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
   * @param {*} context
   * @param {*} url
   * @param {*} callback
   */


  function getJSONTrimmed(context, url, writeKey, callback) {
    //server-side integration, XHR is node module
    var cb_ = callback.bind(context);

    if (true) {
      var xhr = new XMLHttpRequest();
    } else {
      var xhr;
    }

    xhr.open("GET", url, true);

    {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(writeKey + ":"));
    }

    xhr.onload = function () {
      var status = xhr.status;

      if (status == 200) {
        logger.debug("status 200 " + "calling callback");
        cb_(200, xhr.responseText);
      } else {
        handleError(new Error("request failed with status: " + xhr.status + " for url: " + url));
        cb_(status);
      }
    };

    xhr.send();
  }

  function handleError(error) {
    var errorMessage = error.message ? error.message : undefined;

    if (error instanceof Event) {
      if (error.target && error.target.localName == "script") {
        errorMessage = "error in script loading: " + error.target.id;
      }
    }

    if (errorMessage) {
      //console.log("%c"+errorMessage, 'color: blue');
      //console.error(errorMessage);
      logger.error(errorMessage);
    }
  }

  function getDefaultPageProperties() {
    var canonicalUrl = getCanonicalUrl();
    var path = canonicalUrl ? canonicalUrl.pathname : window.location.pathname;
    var referrer = document.referrer;
    var search = window.location.search;
    var title = document.title;
    var url = getUrl(search);
    return {
      path: path,
      referrer: referrer,
      search: search,
      title: title,
      url: url
    };
  }

  function getUrl(search) {
    var canonicalUrl = getCanonicalUrl();
    var url = canonicalUrl ? canonicalUrl.indexOf('?') > -1 ? canonicalUrl : canonicalUrl + search : window.location.href;
    var hashIndex = url.indexOf('#');
    return hashIndex > -1 ? url.slice(0, hashIndex) : url;
  }

  function getCanonicalUrl() {
    var tags = document.getElementsByTagName('link');

    for (var i = 0, tag; tag = tags[i]; i++) {
      if (tag.getAttribute('rel') === 'canonical') {
        return tag.getAttribute('href');
      }
    }
  }

  //Message Type enumeration
  var MessageType = {
    TRACK: "track",
    PAGE: "page",
    //SCREEN: "screen",
    IDENTIFY: "identify"
  }; //ECommerce Parameter Names Enumeration

  var ECommerceEvents = {
    PRODUCTS_SEARCHED: "Products Searched",
    PRODUCT_LIST_VIEWED: "Product List Viewed",
    PRODUCT_LIST_FILTERED: "Product List Filtered",
    PROMOTION_VIEWED: "Promotion Viewed",
    PROMOTION_CLICKED: "Promotion Clicked",
    PRODUCT_CLICKED: "Product Clicked",
    PRODUCT_VIEWED: "Product Viewed",
    PRODUCT_ADDED: "Product Added",
    PRODUCT_REMOVED: "Product Removed",
    CART_VIEWED: "Cart Viewed",
    CHECKOUT_STARTED: "Checkout Started",
    CHECKOUT_STEP_VIEWED: "Checkout Step Viewed",
    CHECKOUT_STEP_COMPLETED: "Checkout Step Completed",
    PAYMENT_INFO_ENTERED: "Payment Info Entered",
    ORDER_UPDATED: "Order Updated",
    ORDER_COMPLETED: "Order Completed",
    ORDER_REFUNDED: "Order Refunded",
    ORDER_CANCELLED: "Order Cancelled",
    COUPON_ENTERED: "Coupon Entered",
    COUPON_APPLIED: "Coupon Applied",
    COUPON_DENIED: "Coupon Denied",
    COUPON_REMOVED: "Coupon Removed",
    PRODUCT_ADDED_TO_WISHLIST: "Product Added to Wishlist",
    PRODUCT_REMOVED_FROM_WISHLIST: "Product Removed from Wishlist",
    WISH_LIST_PRODUCT_ADDED_TO_CART: "Wishlist Product Added to Cart",
    PRODUCT_SHARED: "Product Shared",
    CART_SHARED: "Cart Shared",
    PRODUCT_REVIEWED: "Product Reviewed"
  }; //Enumeration for integrations supported
  var BASE_URL = "http://18.222.145.124:5000/dump"; //"https://rudderlabs.com";

  var CONFIG_URL = "http://localhost:5000/sourceConfig"; //"https://api.rudderlabs.com/workspaceConfig";
  var MAX_WAIT_FOR_INTEGRATION_LOAD = 10000;
  var INTEGRATION_LOAD_CHECK_INTERVAL = 1000;
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
    logger.debug("in script loader=== " + id);
    var js = document.createElement("script");
    js.src = src;
    js.type = "text/javascript";
    js.id = id;
    var e = document.getElementsByTagName("script")[0];
    logger.debug("==script==", e);
    e.parentNode.insertBefore(js, e);
  }

  var HubSpot =
  /*#__PURE__*/
  function () {
    function HubSpot(config) {
      _classCallCheck(this, HubSpot);

      this.hubId = config.hubID; //6405167

      this.name = "HS";
    }

    _createClass(HubSpot, [{
      key: "init",
      value: function init() {
        var hubspotJs = "http://js.hs-scripts.com/" + this.hubId + ".js";
        ScriptLoader("hubspot-integration", hubspotJs);
        logger.debug("===in init HS===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        logger.debug("in HubspotAnalyticsManager identify");
        var traits = rudderElement.message.context.traits;
        var traitsValue = {};

        for (var k in traits) {
          if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
            var hubspotkey = k; //k.startsWith("rl_") ? k.substring(3, k.length) : k;

            if (toString.call(traits[k]) == '[object Date]') {
              traitsValue[hubspotkey] = traits[k].getTime();
            } else {
              traitsValue[hubspotkey] = traits[k];
            }
          }
        }
        /* if (traitsValue["address"]) {
          let address = traitsValue["address"];
          //traitsValue.delete(address)
          delete traitsValue["address"];
          for (let k in address) {
            if (!!Object.getOwnPropertyDescriptor(address, k) && address[k]) {
              let hubspotkey = k;//k.startsWith("rl_") ? k.substring(3, k.length) : k;
              hubspotkey = hubspotkey == "street" ? "address" : hubspotkey;
              traitsValue[hubspotkey] = address[k];
            }
          }
        } */


        var userProperties = rudderElement.message.context.user_properties;

        for (var _k in userProperties) {
          if (!!Object.getOwnPropertyDescriptor(userProperties, _k) && userProperties[_k]) {
            var _hubspotkey = _k; //k.startsWith("rl_") ? k.substring(3, k.length) : k;

            traitsValue[_hubspotkey] = userProperties[_k];
          }
        }

        logger.debug(traitsValue);

        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined) {
          var _hsq = window._hsq = window._hsq || [];

          _hsq.push(["identify", traitsValue]);
        }
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
        logger.debug("in HubspotAnalyticsManager track");

        var _hsq = window._hsq = window._hsq || [];

        var eventValue = {};
        eventValue["id"] = rudderElement.message.event;

        if (rudderElement.message.properties && (rudderElement.message.properties.revenue || rudderElement.message.properties.value)) {
          eventValue["value"] = rudderElement.message.properties.revenue || rudderElement.message.properties.value;
        }

        _hsq.push(["trackEvent", eventValue]);
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        logger.debug("in HubspotAnalyticsManager page");

        var _hsq = window._hsq = window._hsq || []; //logger.debug("path: " + rudderElement.message.properties.path);
        //_hsq.push(["setPath", rudderElement.message.properties.path]);

        /* _hsq.push(["identify",{
            email: "testtrackpage@email.com"
        }]); */


        if (rudderElement.message.properties && rudderElement.message.properties.path) {
          _hsq.push(["setPath", rudderElement.message.properties.path]);
        }

        _hsq.push(["trackPageView"]);
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
        logger.debug("in hubspot isLoaded");
        return !!(window._hsq && window._hsq.push !== Array.prototype.push);
      }
    }]);

    return HubSpot;
  }();

  var index =  HubSpot ;

  var GA =
  /*#__PURE__*/
  function () {
    function GA(config) {
      _classCallCheck(this, GA);

      this.trackingID = config.trackingID; //UA-149602794-1

      this.name = "GA";
    }

    _createClass(GA, [{
      key: "init",
      value: function init() {
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
          }, i[r].l = 1 * new Date();
          a = s.createElement(o), m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); //window.ga_debug = {trace: true};


        ga('create', this.trackingID, 'auto');
        ga('send', 'pageview');
        logger.debug("===in init GA===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        ga('set', 'userId', rudderElement.message.anonymous_id);
        logger.debug("in GoogleAnalyticsManager identify");
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
        var eventCategory = rudderElement.message.event;
        var eventAction = rudderElement.message.event;
        var eventLabel = rudderElement.message.event;
        var eventValue = "";

        if (rudderElement.message.properties) {
          eventValue = rudderElement.message.properties.value ? rudderElement.message.properties.value : rudderElement.message.properties.revenue;
        }

        var payLoad = {
          hitType: 'event',
          eventCategory: eventCategory,
          eventAction: eventAction,
          eventLabel: eventLabel,
          eventValue: eventValue
        };
        ga('send', 'event', payLoad);
        logger.debug("in GoogleAnalyticsManager track");
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        logger.debug("in GoogleAnalyticsManager page");
        var path = rudderElement.properties && rudderElement.properties.path ? rudderElement.properties.path : undefined;

        if (path) {
          ga('set', 'page', path);
        }

        ga('send', 'pageview');
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
        logger.debug("in GA isLoaded");
        return !!window.gaplugins;
      }
    }]);

    return GA;
  }();

  var index$1 =  GA ;

  var Hotjar =
  /*#__PURE__*/
  function () {
    function Hotjar(config) {
      _classCallCheck(this, Hotjar);

      this.siteId = config.siteID; //1549611

      this.name = "HOTJAR";
    }

    _createClass(Hotjar, [{
      key: "init",
      value: function init() {
        window.hotjarSiteId = this.siteId;

        (function (h, o, t, j, a, r) {
          h.hj = h.hj || function () {
            (h.hj.q = h.hj.q || []).push(arguments);
          };

          h._hjSettings = {
            hjid: h.hotjarSiteId,
            hjsv: 6
          };
          a = o.getElementsByTagName("head")[0];
          r = o.createElement("script");
          r.async = 1;
          r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
          a.appendChild(r);
        })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

        logger.debug("===in init Hotjar===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        logger.error("method not supported");
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
        logger.error("method not supported");
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        logger.error("method not supported");
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
        logger.error("method not supported");
      }
    }]);

    return Hotjar;
  }();

  var index$2 =  Hotjar ;

  var GoogleAds =
  /*#__PURE__*/
  function () {
    function GoogleAds(config) {
      _classCallCheck(this, GoogleAds);

      //this.accountId = config.accountId;//AW-696901813
      this.conversionId = config.conversionID;
      this.pageLoadConversions = config.pageLoadConversions;
      this.clickEventConversions = config.clickEventConversions;
      this.name = "GOOGLEADS";
    }

    _createClass(GoogleAds, [{
      key: "init",
      value: function init() {
        var sourceUrl = "https://www.googletagmanager.com/gtag/js?id=" + this.conversionId;

        (function (id, src, document) {
          logger.debug("in script loader=== " + id);
          var js = document.createElement("script");
          js.src = src;
          js.async = 1;
          js.type = "text/javascript";
          js.id = id;
          var e = document.getElementsByTagName("head")[0];
          logger.debug("==script==", e);
          e.appendChild(js);
        })('googleAds-integration', sourceUrl, document);

        window.dataLayer = window.dataLayer || [];

        window.gtag = function () {
          window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', this.conversionId);
        logger.debug("===in init Google Ads===");
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
        logger.error("method not supported");
      } //https://developers.google.com/gtagjs/reference/event

    }, {
      key: "track",
      value: function track(rudderElement) {
        logger.debug("in GoogleAdsAnalyticsManager track");
        var conversionData = this.getConversionData(this.clickEventConversions, rudderElement.message.event);

        if (conversionData['conversionLabel']) {
          var conversionLabel = conversionData['conversionLabel'];
          var eventName = conversionData['eventName'];
          var sendToValue = this.conversionId + "/" + conversionLabel;
          var properties = {};

          if (rudderElement.properties) {
            properties['value'] = rudderElement.properties['revenue'];
            properties['currency'] = rudderElement.properties['currency'];
            properties['transaction_id'] = rudderElement.properties['order_id'];
          }

          properties['send_to'] = sendToValue;
          window.gtag('event', eventName, properties);
        }
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
        logger.debug("in GoogleAdsAnalyticsManager page");
        var conversionData = this.getConversionData(this.pageLoadConversions, rudderElement.message.name);

        if (conversionData['conversionLabel']) {
          var conversionLabel = conversionData['conversionLabel'];
          var eventName = conversionData['eventName'];
          window.gtag('event', eventName, {
            'send_to': this.conversionId + "/" + conversionLabel
          });
        }
      }
    }, {
      key: "getConversionData",
      value: function getConversionData(eventTypeConversions, eventName) {
        var conversionData = {};

        if (eventTypeConversions) {
          eventTypeConversions.forEach(function (eventTypeConversion) {
            if (eventTypeConversion.name.toLowerCase() === eventName.toLowerCase()) {
              //rudderElement["message"]["name"]
              conversionData['conversionLabel'] = eventTypeConversion.conversionLabel;
              conversionData['eventName'] = eventTypeConversion.name;
              return;
            }
          });
        }

        return conversionData;
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
        return window.dataLayer.push !== Array.prototype.push;
      }
    }]);

    return GoogleAds;
  }();

  var index$3 =  GoogleAds ;

<<<<<<< HEAD
  var VWO =
  /*#__PURE__*/
  function () {
    function VWO(config) {
      _classCallCheck(this, VWO);

      this.accountId = config.accountId; //1549611

      this.settingsTolerance = config.settingsTolerance;
      this.isSPA = config.isSPA;
      this.libraryTolerance = config.libraryTolerance;
      this.useExistingJquery = config.useExistingJquery;
      this.sendExperimentTrack = config.sendExperimentTrack;
      this.sendExperimentIdentify = config.sendExperimentIdentify;
      this.name = "VWO";
      logger.debug("Config ", config);
    }

    _createClass(VWO, [{
      key: "init",
      value: function init() {
        logger.debug("===in init VWO===");
        var account_id = this.accountId;
        var settings_tolerance = this.settingsTolerance;
        var _library_tolerance = this.libraryTolerance;
        var _use_existing_jquery = this.useExistingJquery;
        var isSPA = this.isSPA;

        window._vwo_code = function () {
          var f = false;
          var d = document;
          return {
            use_existing_jquery: function use_existing_jquery() {
              return _use_existing_jquery;
            },
            library_tolerance: function library_tolerance() {
              return _library_tolerance;
            },
            finish: function finish() {
              if (!f) {
                f = true;
                var a = d.getElementById("_vis_opt_path_hides");
                if (a) a.parentNode.removeChild(a);
              }
            },
            finished: function finished() {
              return f;
            },
            load: function load(a) {
              var b = d.createElement("script");
              b.src = a;
              b.type = "text/javascript";
              b.innerText;

              b.onerror = function () {
                _vwo_code.finish();
              };

              d.getElementsByTagName("head")[0].appendChild(b);
            },
            init: function init() {
              var settings_timer = setTimeout("_vwo_code.finish()", settings_tolerance);
              var a = d.createElement("style"),
                  b = "body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}",
                  h = d.getElementsByTagName("head")[0];
              a.setAttribute("id", "_vis_opt_path_hides");
              a.setAttribute("type", "text/css");
              if (a.styleSheet) a.styleSheet.cssText = b;else a.appendChild(d.createTextNode(b));
              h.appendChild(a);
              this.load("//dev.visualwebsiteoptimizer.com/j.php?a=" + account_id + "&u=" + encodeURIComponent(d.URL) + "&r=" + Math.random() + "&f=" + +isSPA);
              return settings_timer;
            }
          };
        }();

        window._vwo_settings_timer = window._vwo_code.init(); //Send track or iddentify when

        if (this.sendExperimentTrack || this.experimentViewedIdentify) {
          this.experimentViewed();
        }
      }
    }, {
      key: "experimentViewed",
      value: function experimentViewed() {
        window.VWO = window.VWO || [];
        var self = this;
        window.VWO.push(["onVariationApplied", function (data) {
          if (!data) {
            return;
          }

          logger.debug("Variation Applied");
          var expId = data[1],
              variationId = data[2];
          logger.debug("experiment id:", expId, "Variation Name:", _vwo_exp[expId].comb_n[variationId]);

          if (typeof _vwo_exp[expId].comb_n[variationId] !== "undefined" && ["VISUAL_AB", "VISUAL", "SPLIT_URL", "SURVEY"].indexOf(_vwo_exp[expId].type) > -1) {
            try {
              if (self.sendExperimentTrack) {
                logger.debug("Tracking...");
                window.rudderanalytics.track("Experiment Viewed", {
                  experimentId: expId,
                  variationName: _vwo_exp[expId].comb_n[variationId]
                });
              }
            } catch (error) {
              logger.error(error);
            }

            try {
              if (self.sendExperimentIdentify) {
                logger.debug("Identifying...");
                window.rudderanalytics.identify(_defineProperty({}, "Experiment: ".concat(expId), _vwo_exp[expId].comb_n[variationId]));
              }
            } catch (error) {
              logger.error(error);
            }
          }
        }]);
=======
  var GoogleTagManager =
  /*#__PURE__*/
  function () {
    function GoogleTagManager(config) {
      _classCallCheck(this, GoogleTagManager);

      this.containerID = config.containerID;
      this.name = "GOOGLETAGMANAGER";
    }

    _createClass(GoogleTagManager, [{
      key: "init",
      value: function init() {
        logger.debug("===in init GoogleTagManager===");

        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
            "gtm.start": new Date().getTime(),
            event: "gtm.js"
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
          j.async = true;
          j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", this.containerID);
>>>>>>> update dist files
      }
    }, {
      key: "identify",
      value: function identify(rudderElement) {
<<<<<<< HEAD
        logger.debug("method not supported");
=======
        logger.error("method not supported");
>>>>>>> update dist files
      }
    }, {
      key: "track",
      value: function track(rudderElement) {
<<<<<<< HEAD
        var eventName = rudderElement.message.event;

        if (eventName === "Order Completed") {
          var total = rudderElement.message.properties ? rudderElement.message.properties.total || rudderElement.message.properties.revenue : 0;
          logger.debug("Revenue", total);
          window.VWO = window.VWO || [];
          window.VWO.push(["track.revenueConversion", total]);
        }
=======
        logger.debug("===in track GoogleTagManager===");
        var rudderMessage = rudderElement.message;

        var props = _objectSpread2({
          event: rudderMessage.event,
          userId: rudderMessage.userId,
          anonymousId: rudderMessage.anonymousId
        }, rudderMessage.properties);

        this.sendToGTMDatalayer(props);
>>>>>>> update dist files
      }
    }, {
      key: "page",
      value: function page(rudderElement) {
<<<<<<< HEAD
        logger.debug("method not supported");
=======
        logger.debug("===in page GoogleTagManager===");
        var rudderMessage = rudderElement.message;
        var pageName = rudderMessage.name;
        var pageCategory = rudderMessage.properties ? rudderMessage.properties.category : undefined;
        var eventName;

        if (pageName) {
          eventName = "Viewed " + pageName + " page";
        }

        if (pageCategory && pageName) {
          eventName = "Viewed " + pageCategory + " " + pageName + " page";
        }

        var props = _objectSpread2({
          event: eventName,
          userId: rudderMessage.userId,
          anonymousId: rudderMessage.anonymousId
        }, rudderMessage.properties);

        this.sendToGTMDatalayer(props);
>>>>>>> update dist files
      }
    }, {
      key: "isLoaded",
      value: function isLoaded() {
<<<<<<< HEAD
        return !!window._vwo_code;
      }
    }]);

    return VWO;
=======
        return !!(window.dataLayer && Array.prototype.push !== window.dataLayer.push);
      }
    }, {
      key: "sendToGTMDatalayer",
      value: function sendToGTMDatalayer(props) {
        window.dataLayer.push(props);
      }
    }]);

    return GoogleTagManager;
>>>>>>> update dist files
  }();

  var integrations = {
    HS: index,
    GA: index$1,
    HOTJAR: index$2,
    GOOGLEADS: index$3,
<<<<<<< HEAD
    VWO: VWO
=======
    GTM: GoogleTagManager
>>>>>>> update dist files
  };

  //Application class
  var RudderApp = function RudderApp() {
    _classCallCheck(this, RudderApp);

    this.build = "1.0.0";
    this.name = "RudderLabs JavaScript SDK";
    this.namespace = "com.rudderlabs.javascript";
    this.version = "1.0.5";
  };

  //Library information class
  var RudderLibraryInfo = function RudderLibraryInfo() {
    _classCallCheck(this, RudderLibraryInfo);

    this.name = "RudderLabs JavaScript SDK";
    this.version = "1.0.5";
  }; //Operating System information class


  var RudderOSInfo = function RudderOSInfo() {
    _classCallCheck(this, RudderOSInfo);

    this.name = "";
    this.version = "";
  }; //Screen information class


  var RudderScreenInfo = function RudderScreenInfo() {
    _classCallCheck(this, RudderScreenInfo);

    this.density = 0;
    this.width = 0;
    this.height = 0;
  }; //Device information class

  var RudderContext = function RudderContext() {
    _classCallCheck(this, RudderContext);

    this.app = new RudderApp();
    this.traits = null;
    this.library = new RudderLibraryInfo(); //this.os = null;

    var os = new RudderOSInfo();
    os.version = ""; //skipping version for simplicity now

    var screen = new RudderScreenInfo(); //Depending on environment within which the code is executing, screen
    //dimensions can be set
    //User agent and locale can be retrieved only for browser
    //For server-side integration, same needs to be set by calling program

    {
      //running within browser
      screen.width = window.width;
      screen.height = window.height;
      screen.density = window.devicePixelRatio;
      this.userAgent = navigator.userAgent; //property name differs based on browser version

      this.locale = navigator.language || navigator.browserLanguage;
    }

    this.ip = "0.0.0.0";
    this.os = os;
    this.screen = screen;
    this.device = null;
    this.network = null;
  };

  var RudderMessage =
  /*#__PURE__*/
  function () {
    function RudderMessage() {
      _classCallCheck(this, RudderMessage);

      this.channel = "web";
      this.context = new RudderContext();
      this.type = null;
      this.action = null;
      this.messageId = generateUUID().toString();
      this.originalTimestamp = new Date().toISOString();
      this.anonymousId = null;
      this.userId = null;
      this.event = null;
      this.properties = {};
      this.integrations = {}; //By default, all integrations will be set as enabled from client
      //Decision to route to specific destinations will be taken at server end

      this.integrations["All"] = true;
    } //Get property


    _createClass(RudderMessage, [{
      key: "getProperty",
      value: function getProperty(key) {
        return this.properties[key];
      } //Add property

    }, {
      key: "addProperty",
      value: function addProperty(key, value) {
        this.properties[key] = value;
      } //Validate whether this message is semantically valid for the type mentioned

    }, {
      key: "validateFor",
      value: function validateFor(messageType) {
        //First check that properties is populated
        if (!this.properties) {
          throw new Error("Key properties is required");
        } //Event type specific checks


        switch (messageType) {
          case MessageType.TRACK:
            //check if event is present
            if (!this.event) {
              throw new Error("Key event is required for track event");
            } //Next make specific checks for e-commerce events


            if (this.event in Object.values(ECommerceEvents)) {
              switch (this.event) {
                case ECommerceEvents.CHECKOUT_STEP_VIEWED:
                case ECommerceEvents.CHECKOUT_STEP_COMPLETED:
                case ECommerceEvents.PAYMENT_INFO_ENTERED:
                  this.checkForKey("checkout_id");
                  this.checkForKey("step");
                  break;

                case ECommerceEvents.PROMOTION_VIEWED:
                case ECommerceEvents.PROMOTION_CLICKED:
                  this.checkForKey("promotion_id");
                  break;

                case ECommerceEvents.ORDER_REFUNDED:
                  this.checkForKey("order_id");
                  break;

                default:
              }
            } else if (!this.properties["category"]) {
              //if category is not there, set to event
              this.properties["category"] = this.event;
            }

            break;

          case MessageType.PAGE:
            break;

          case MessageType.SCREEN:
            if (!this.properties["name"]) {
              throw new Error("Key 'name' is required in properties");
            }

            break;
        }
      } //Function for checking existence of a particular property

    }, {
      key: "checkForKey",
      value: function checkForKey(propertyName) {
        if (!this.properties[propertyName]) {
          throw new Error("Key '" + propertyName + "' is required in properties");
        }
      }
    }]);

    return RudderMessage;
  }();

  var RudderElement =
  /*#__PURE__*/
  function () {
    function RudderElement() {
      _classCallCheck(this, RudderElement);

      this.message = new RudderMessage();
    } //Setters that in turn set the field values for the contained object


    _createClass(RudderElement, [{
      key: "setType",
      value: function setType(type) {
        this.message.type = type;
      }
    }, {
      key: "setProperty",
      value: function setProperty(rudderProperty) {
        this.message.properties = rudderProperty;
      }
    }, {
      key: "setUserProperty",
      value: function setUserProperty(rudderUserProperty) {
        this.message.user_properties = rudderUserProperty;
      }
    }, {
      key: "setUserId",
      value: function setUserId(userId) {
        this.message.userId = userId;
      }
    }, {
      key: "setEventName",
      value: function setEventName(eventName) {
        this.message.event = eventName;
      }
    }, {
      key: "updateTraits",
      value: function updateTraits(traits) {
        this.message.context.traits = traits;
      }
    }, {
      key: "getElementContent",
      value: function getElementContent() {
        return this.message;
      }
    }]);

    return RudderElement;
  }();

  var RudderElementBuilder =
  /*#__PURE__*/
  function () {
    function RudderElementBuilder() {
      _classCallCheck(this, RudderElementBuilder);

      this.rudderProperty = null;
      this.rudderUserProperty = null;
      this.event = null;
      this.userId = null;
      this.channel = null;
      this.type = null;
    } //Set the property


    _createClass(RudderElementBuilder, [{
      key: "setProperty",
      value: function setProperty(inputRudderProperty) {
        this.rudderProperty = inputRudderProperty;
        return this;
      } //Build and set the property object

    }, {
      key: "setPropertyBuilder",
      value: function setPropertyBuilder(rudderPropertyBuilder) {
        this.rudderProperty = rudderPropertyBuilder.build();
        return this;
      }
    }, {
      key: "setUserProperty",
      value: function setUserProperty(inputRudderUserProperty) {
        this.rudderUserProperty = inputRudderUserProperty;
        return this;
      }
    }, {
      key: "setUserPropertyBuilder",
      value: function setUserPropertyBuilder(rudderUserPropertyBuilder) {
        this.rudderUserProperty = rudderUserPropertyBuilder.build();
        return this;
      } //Setter methods for all variables. Instance is returned for each call in
      //accordance with the Builder pattern

    }, {
      key: "setEvent",
      value: function setEvent(event) {
        this.event = event;
        return this;
      }
    }, {
      key: "setUserId",
      value: function setUserId(userId) {
        this.userId = userId;
        return this;
      }
    }, {
      key: "setChannel",
      value: function setChannel(channel) {
        this.channel = channel;
        return this;
      }
    }, {
      key: "setType",
      value: function setType(eventType) {
        this.type = eventType;
        return this;
      }
    }, {
      key: "build",
      value: function build() {
        var element = new RudderElement();
        element.setUserId(this.userId);
        element.setType(this.type);
        element.setEventName(this.event);
        element.setProperty(this.rudderProperty);
        element.setUserProperty(this.rudderUserProperty);
        return element;
      }
    }]);

    return RudderElementBuilder;
  }();

  /**
   * toString ref.
   */

  var toString$1 = Object.prototype.toString;

  /**
   * Return the type of `val`.
   *
   * @param {Mixed} val
   * @return {String}
   * @api public
   */

  var componentType = function(val){
    switch (toString$1.call(val)) {
      case '[object Date]': return 'date';
      case '[object RegExp]': return 'regexp';
      case '[object Arguments]': return 'arguments';
      case '[object Array]': return 'array';
      case '[object Error]': return 'error';
    }

    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (val !== val) return 'nan';
    if (val && val.nodeType === 1) return 'element';

    if (isBuffer(val)) return 'buffer';

    val = val.valueOf
      ? val.valueOf()
      : Object.prototype.valueOf.apply(val);

    return typeof val;
  };

  // code borrowed from https://github.com/feross/is-buffer/blob/master/index.js
  function isBuffer(obj) {
    return !!(obj != null &&
      (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
        (obj.constructor &&
        typeof obj.constructor.isBuffer === 'function' &&
        obj.constructor.isBuffer(obj))
      ))
  }

  /*
   * Module dependencies.
   */



  /**
   * Deeply clone an object.
   *
   * @param {*} obj Any object.
   */

  var clone = function clone(obj) {
    var t = componentType(obj);

    if (t === 'object') {
      var copy = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = clone(obj[key]);
        }
      }
      return copy;
    }

    if (t === 'array') {
      var copy = new Array(obj.length);
      for (var i = 0, l = obj.length; i < l; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    if (t === 'regexp') {
      // from millermedeiros/amd-utils - MIT
      var flags = '';
      flags += obj.multiline ? 'm' : '';
      flags += obj.global ? 'g' : '';
      flags += obj.ignoreCase ? 'i' : '';
      return new RegExp(obj.source, flags);
    }

    if (t === 'date') {
      return new Date(obj.getTime());
    }

    // string, number, boolean, etc.
    return obj;
  };

  /*
   * Exports.
   */

  var clone_1 = clone;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} options
   * @return {String|Number}
   * @api public
   */

  var ms = function(val, options){
    options = options || {};
    if ('string' == typeof val) return parse(val);
    return options.long
      ? long(val)
      : short(val);
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = '' + str;
    if (str.length > 10000) return;
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
    if (!match) return;
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function short(ms) {
    if (ms >= d) return Math.round(ms / d) + 'd';
    if (ms >= h) return Math.round(ms / h) + 'h';
    if (ms >= m) return Math.round(ms / m) + 'm';
    if (ms >= s) return Math.round(ms / s) + 's';
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function long(ms) {
    return plural(ms, d, 'day')
      || plural(ms, h, 'hour')
      || plural(ms, m, 'minute')
      || plural(ms, s, 'second')
      || ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, n, name) {
    if (ms < n) return;
    if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
    return Math.ceil(ms / n) + ' ' + name + 's';
  }

  var debug_1 = createCommonjsModule(function (module, exports) {
  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = ms;

  /**
   * The currently active debug mode names, and names to skip.
   */

  exports.names = [];
  exports.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lowercased letter, i.e. "n".
   */

  exports.formatters = {};

  /**
   * Previously assigned color.
   */

  var prevColor = 0;

  /**
   * Previous log timestamp.
   */

  var prevTime;

  /**
   * Select a color.
   *
   * @return {Number}
   * @api private
   */

  function selectColor() {
    return exports.colors[prevColor++ % exports.colors.length];
  }

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */

  function debug(namespace) {

    // define the `disabled` version
    function disabled() {
    }
    disabled.enabled = false;

    // define the `enabled` version
    function enabled() {

      var self = enabled;

      // set `diff` timestamp
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      // add the `color` if not set
      if (null == self.useColors) self.useColors = exports.useColors();
      if (null == self.color && self.useColors) self.color = selectColor();

      var args = Array.prototype.slice.call(arguments);

      args[0] = exports.coerce(args[0]);

      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %o
        args = ['%o'].concat(args);
      }

      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);

          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      if ('function' === typeof exports.formatArgs) {
        args = exports.formatArgs.apply(self, args);
      }
      var logFn = enabled.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }
    enabled.enabled = true;

    var fn = exports.enabled(namespace) ? enabled : disabled;

    fn.namespace = namespace;

    return fn;
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */

  function enable(namespaces) {
    exports.save(namespaces);

    var split = (namespaces || '').split(/[\s,]+/);
    var len = split.length;

    for (var i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }

  /**
   * Disable debug output.
   *
   * @api public
   */

  function disable() {
    exports.enable('');
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  function enabled(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
  });
  var debug_2 = debug_1.coerce;
  var debug_3 = debug_1.disable;
  var debug_4 = debug_1.enable;
  var debug_5 = debug_1.enabled;
  var debug_6 = debug_1.humanize;
  var debug_7 = debug_1.names;
  var debug_8 = debug_1.skips;
  var debug_9 = debug_1.formatters;

  var browser = createCommonjsModule(function (module, exports) {
  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug_1;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome
                 && 'undefined' != typeof chrome.storage
                    ? chrome.storage.local
                    : localstorage();

  /**
   * Colors.
   */

  exports.colors = [
    'lightseagreen',
    'forestgreen',
    'goldenrod',
    'dodgerblue',
    'darkorchid',
    'crimson'
  ];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  function useColors() {
    // is webkit? http://stackoverflow.com/a/16459606/376773
    return ('WebkitAppearance' in document.documentElement.style) ||
      // is firebug? http://stackoverflow.com/a/398120/376773
      (window.console && (console.firebug || (console.exception && console.table))) ||
      // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
  }

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  exports.formatters.j = function(v) {
    return JSON.stringify(v);
  };


  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs() {
    var args = arguments;
    var useColors = this.useColors;

    args[0] = (useColors ? '%c' : '')
      + this.namespace
      + (useColors ? ' %c' : ' ')
      + args[0]
      + (useColors ? '%c ' : ' ')
      + '+' + exports.humanize(this.diff);

    if (!useColors) return args;

    var c = 'color: ' + this.color;
    args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-z%]/g, function(match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
    return args;
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */

  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === typeof console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch(e) {}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch(e) {}
    return r;
  }

  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */

  exports.enable(load());

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage(){
    try {
      return window.localStorage;
    } catch (e) {}
  }
  });
  var browser_1 = browser.log;
  var browser_2 = browser.formatArgs;
  var browser_3 = browser.save;
  var browser_4 = browser.load;
  var browser_5 = browser.useColors;
  var browser_6 = browser.storage;
  var browser_7 = browser.colors;

  /**
   * Module dependencies.
   */

  var debug = browser('cookie');

  /**
   * Set or get cookie `name` with `value` and `options` object.
   *
   * @param {String} name
   * @param {String} value
   * @param {Object} options
   * @return {Mixed}
   * @api public
   */

  var componentCookie = function(name, value, options){
    switch (arguments.length) {
      case 3:
      case 2:
        return set(name, value, options);
      case 1:
        return get(name);
      default:
        return all();
    }
  };

  /**
   * Set cookie `name` to `value`.
   *
   * @param {String} name
   * @param {String} value
   * @param {Object} options
   * @api private
   */

  function set(name, value, options) {
    options = options || {};
    var str = encode(name) + '=' + encode(value);

    if (null == value) options.maxage = -1;

    if (options.maxage) {
      options.expires = new Date(+new Date + options.maxage);
    }

    if (options.path) str += '; path=' + options.path;
    if (options.domain) str += '; domain=' + options.domain;
    if (options.expires) str += '; expires=' + options.expires.toUTCString();
    if (options.secure) str += '; secure';

    document.cookie = str;
  }

  /**
   * Return all cookies.
   *
   * @return {Object}
   * @api private
   */

  function all() {
    var str;
    try {
      str = document.cookie;
    } catch (err) {
      if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(err.stack || err);
      }
      return {};
    }
    return parse$1(str);
  }

  /**
   * Get cookie `name`.
   *
   * @param {String} name
   * @return {String}
   * @api private
   */

  function get(name) {
    return all()[name];
  }

  /**
   * Parse cookie `str`.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  function parse$1(str) {
    var obj = {};
    var pairs = str.split(/ *; */);
    var pair;
    if ('' == pairs[0]) return obj;
    for (var i = 0; i < pairs.length; ++i) {
      pair = pairs[i].split('=');
      obj[decode(pair[0])] = decode(pair[1]);
    }
    return obj;
  }

  /**
   * Encode.
   */

  function encode(value){
    try {
      return encodeURIComponent(value);
    } catch (e) {
      debug('error `encode(%o)` - %o', value, e);
    }
  }

  /**
   * Decode.
   */

  function decode(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      debug('error `decode(%o)` - %o', value, e);
    }
  }

  var max = Math.max;

  /**
   * Produce a new array composed of all but the first `n` elements of an input `collection`.
   *
   * @name drop
   * @api public
   * @param {number} count The number of elements to drop.
   * @param {Array} collection The collection to iterate over.
   * @return {Array} A new array containing all but the first element from `collection`.
   * @example
   * drop(0, [1, 2, 3]); // => [1, 2, 3]
   * drop(1, [1, 2, 3]); // => [2, 3]
   * drop(2, [1, 2, 3]); // => [3]
   * drop(3, [1, 2, 3]); // => []
   * drop(4, [1, 2, 3]); // => []
   */
  var drop = function drop(count, collection) {
    var length = collection ? collection.length : 0;

    if (!length) {
      return [];
    }

    // Preallocating an array *significantly* boosts performance when dealing with
    // `arguments` objects on v8. For a summary, see:
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var toDrop = max(Number(count) || 0, 0);
    var resultsLength = max(length - toDrop, 0);
    var results = new Array(resultsLength);

    for (var i = 0; i < resultsLength; i += 1) {
      results[i] = collection[i + toDrop];
    }

    return results;
  };

  /*
   * Exports.
   */

  var drop_1 = drop;

  var max$1 = Math.max;

  /**
   * Produce a new array by passing each value in the input `collection` through a transformative
   * `iterator` function. The `iterator` function is passed three arguments:
   * `(value, index, collection)`.
   *
   * @name rest
   * @api public
   * @param {Array} collection The collection to iterate over.
   * @return {Array} A new array containing all but the first element from `collection`.
   * @example
   * rest([1, 2, 3]); // => [2, 3]
   */
  var rest = function rest(collection) {
    if (collection == null || !collection.length) {
      return [];
    }

    // Preallocating an array *significantly* boosts performance when dealing with
    // `arguments` objects on v8. For a summary, see:
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var results = new Array(max$1(collection.length - 2, 0));

    for (var i = 1; i < collection.length; i += 1) {
      results[i - 1] = collection[i];
    }

    return results;
  };

  /*
   * Exports.
   */

  var rest_1 = rest;

  /*
   * Module dependencies.
   */




  var has = Object.prototype.hasOwnProperty;
  var objToString = Object.prototype.toString;

  /**
   * Returns `true` if a value is an object, otherwise `false`.
   *
   * @name isObject
   * @api private
   * @param {*} val The value to test.
   * @return {boolean}
   */
  // TODO: Move to a library
  var isObject = function isObject(value) {
    return Boolean(value) && typeof value === 'object';
  };

  /**
   * Returns `true` if a value is a plain object, otherwise `false`.
   *
   * @name isPlainObject
   * @api private
   * @param {*} val The value to test.
   * @return {boolean}
   */
  // TODO: Move to a library
  var isPlainObject = function isPlainObject(value) {
    return Boolean(value) && objToString.call(value) === '[object Object]';
  };

  /**
   * Assigns a key-value pair to a target object when the value assigned is owned,
   * and where target[key] is undefined.
   *
   * @name shallowCombiner
   * @api private
   * @param {Object} target
   * @param {Object} source
   * @param {*} value
   * @param {string} key
   */
  var shallowCombiner = function shallowCombiner(target, source, value, key) {
    if (has.call(source, key) && target[key] === undefined) {
      target[key] = value;
    }
    return source;
  };

  /**
   * Assigns a key-value pair to a target object when the value assigned is owned,
   * and where target[key] is undefined; also merges objects recursively.
   *
   * @name deepCombiner
   * @api private
   * @param {Object} target
   * @param {Object} source
   * @param {*} value
   * @param {string} key
   * @return {Object}
   */
  var deepCombiner = function(target, source, value, key) {
    if (has.call(source, key)) {
      if (isPlainObject(target[key]) && isPlainObject(value)) {
          target[key] = defaultsDeep(target[key], value);
      } else if (target[key] === undefined) {
          target[key] = value;
      }
    }

    return source;
  };

  /**
   * TODO: Document
   *
   * @name defaultsWith
   * @api private
   * @param {Function} combiner
   * @param {Object} target
   * @param {...Object} sources
   * @return {Object} Return the input `target`.
   */
  var defaultsWith = function(combiner, target /*, ...sources */) {
    if (!isObject(target)) {
      return target;
    }

    combiner = combiner || shallowCombiner;
    var sources = drop_1(2, arguments);

    for (var i = 0; i < sources.length; i += 1) {
      for (var key in sources[i]) {
        combiner(target, sources[i], sources[i][key], key);
      }
    }

    return target;
  };

  /**
   * Copies owned, enumerable properties from a source object(s) to a target
   * object when the value of that property on the source object is `undefined`.
   * Recurses on objects.
   *
   * @name defaultsDeep
   * @api public
   * @param {Object} target
   * @param {...Object} sources
   * @return {Object} The input `target`.
   */
  var defaultsDeep = function defaultsDeep(target /*, sources */) {
    // TODO: Replace with `partial` call?
    return defaultsWith.apply(null, [deepCombiner, target].concat(rest_1(arguments)));
  };

  /**
   * Copies owned, enumerable properties from a source object(s) to a target
   * object when the value of that property on the source object is `undefined`.
   *
   * @name defaults
   * @api public
   * @param {Object} target
   * @param {...Object} sources
   * @return {Object}
   * @example
   * var a = { a: 1 };
   * var b = { a: 2, b: 2 };
   *
   * defaults(a, b);
   * console.log(a); //=> { a: 1, b: 2 }
   */
  var defaults = function(target /*, ...sources */) {
    // TODO: Replace with `partial` call?
    return defaultsWith.apply(null, [null, target].concat(rest_1(arguments)));
  };

  /*
   * Exports.
   */

  var defaults_1 = defaults;
  var deep = defaultsDeep;
  defaults_1.deep = deep;

  var json3 = createCommonjsModule(function (module, exports) {
  (function () {
    // Detect the `define` function exposed by asynchronous module loaders. The
    // strict `define` check is necessary for compatibility with `r.js`.
    var isLoader = typeof undefined === "function" && undefined.amd;

    // A set of types used to distinguish objects from primitives.
    var objectTypes = {
      "function": true,
      "object": true
    };

    // Detect the `exports` object exposed by CommonJS implementations.
    var freeExports =  exports && !exports.nodeType && exports;

    // Use the `global` object exposed by Node (including Browserify via
    // `insert-module-globals`), Narwhal, and Ringo as the default context,
    // and the `window` object in browsers. Rhino exports a `global` function
    // instead.
    var root = objectTypes[typeof window] && window || this,
        freeGlobal = freeExports && objectTypes['object'] && module && !module.nodeType && typeof commonjsGlobal == "object" && commonjsGlobal;

    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
      root = freeGlobal;
    }

    // Public: Initializes JSON 3 using the given `context` object, attaching the
    // `stringify` and `parse` functions to the specified `exports` object.
    function runInContext(context, exports) {
      context || (context = root.Object());
      exports || (exports = root.Object());

      // Native constructor aliases.
      var Number = context.Number || root.Number,
          String = context.String || root.String,
          Object = context.Object || root.Object,
          Date = context.Date || root.Date,
          SyntaxError = context.SyntaxError || root.SyntaxError,
          TypeError = context.TypeError || root.TypeError,
          Math = context.Math || root.Math,
          nativeJSON = context.JSON || root.JSON;

      // Delegate to the native `stringify` and `parse` implementations.
      if (typeof nativeJSON == "object" && nativeJSON) {
        exports.stringify = nativeJSON.stringify;
        exports.parse = nativeJSON.parse;
      }

      // Convenience aliases.
      var objectProto = Object.prototype,
          getClass = objectProto.toString,
          isProperty = objectProto.hasOwnProperty,
          undefined$1;

      // Internal: Contains `try...catch` logic used by other functions.
      // This prevents other functions from being deoptimized.
      function attempt(func, errorFunc) {
        try {
          func();
        } catch (exception) {
          if (errorFunc) {
            errorFunc();
          }
        }
      }

      // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
      var isExtended = new Date(-3509827334573292);
      attempt(function () {
        // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
        // results for certain dates in Opera >= 10.53.
        isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
          isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
      });

      // Internal: Determines whether the native `JSON.stringify` and `parse`
      // implementations are spec-compliant. Based on work by Ken Snyder.
      function has(name) {
        if (has[name] != null) {
          // Return cached feature test result.
          return has[name];
        }
        var isSupported;
        if (name == "bug-string-char-index") {
          // IE <= 7 doesn't support accessing string characters using square
          // bracket notation. IE 8 only supports this for primitives.
          isSupported = "a"[0] != "a";
        } else if (name == "json") {
          // Indicates whether both `JSON.stringify` and `JSON.parse` are
          // supported.
          isSupported = has("json-stringify") && has("date-serialization") && has("json-parse");
        } else if (name == "date-serialization") {
          // Indicates whether `Date`s can be serialized accurately by `JSON.stringify`.
          isSupported = has("json-stringify") && isExtended;
          if (isSupported) {
            var stringify = exports.stringify;
            attempt(function () {
              isSupported =
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            });
          }
        } else {
          var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
          // Test `JSON.stringify`.
          if (name == "json-stringify") {
            var stringify = exports.stringify, stringifySupported = typeof stringify == "function";
            if (stringifySupported) {
              // A test function object with a custom `toJSON` method.
              (value = function () {
                return 1;
              }).toJSON = value;
              attempt(function () {
                stringifySupported =
                  // Firefox 3.1b1 and b2 serialize string, number, and boolean
                  // primitives as object literals.
                  stringify(0) === "0" &&
                  // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                  // literals.
                  stringify(new Number()) === "0" &&
                  stringify(new String()) == '""' &&
                  // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                  // does not define a canonical JSON representation (this applies to
                  // objects with `toJSON` properties as well, *unless* they are nested
                  // within an object or array).
                  stringify(getClass) === undefined$1 &&
                  // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                  // FF 3.1b3 pass this test.
                  stringify(undefined$1) === undefined$1 &&
                  // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                  // respectively, if the value is omitted entirely.
                  stringify() === undefined$1 &&
                  // FF 3.1b1, 2 throw an error if the given value is not a number,
                  // string, array, object, Boolean, or `null` literal. This applies to
                  // objects with custom `toJSON` methods as well, unless they are nested
                  // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                  // methods entirely.
                  stringify(value) === "1" &&
                  stringify([value]) == "[1]" &&
                  // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                  // `"[null]"`.
                  stringify([undefined$1]) == "[null]" &&
                  // YUI 3.0.0b1 fails to serialize `null` literals.
                  stringify(null) == "null" &&
                  // FF 3.1b1, 2 halts serialization if an array contains a function:
                  // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                  // elides non-JSON values from objects and arrays, unless they
                  // define custom `toJSON` methods.
                  stringify([undefined$1, getClass, null]) == "[null,null,null]" &&
                  // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                  // where character escape codes are expected (e.g., `\b` => `\u0008`).
                  stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                  // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                  stringify(null, value) === "1" &&
                  stringify([1, 2], null, 1) == "[\n 1,\n 2\n]";
              }, function () {
                stringifySupported = false;
              });
            }
            isSupported = stringifySupported;
          }
          // Test `JSON.parse`.
          if (name == "json-parse") {
            var parse = exports.parse, parseSupported;
            if (typeof parse == "function") {
              attempt(function () {
                // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                // Conforming implementations should also coerce the initial argument to
                // a string prior to parsing.
                if (parse("0") === 0 && !parse(false)) {
                  // Simple parsing test.
                  value = parse(serialized);
                  parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                  if (parseSupported) {
                    attempt(function () {
                      // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                      parseSupported = !parse('"\t"');
                    });
                    if (parseSupported) {
                      attempt(function () {
                        // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                        // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                        // certain octal literals.
                        parseSupported = parse("01") !== 1;
                      });
                    }
                    if (parseSupported) {
                      attempt(function () {
                        // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                        // points. These environments, along with FF 3.1b1 and 2,
                        // also allow trailing commas in JSON objects and arrays.
                        parseSupported = parse("1.") !== 1;
                      });
                    }
                  }
                }
              }, function () {
                parseSupported = false;
              });
            }
            isSupported = parseSupported;
          }
        }
        return has[name] = !!isSupported;
      }
      has["bug-string-char-index"] = has["date-serialization"] = has["json"] = has["json-stringify"] = has["json-parse"] = null;

      if (!has("json")) {
        // Common `[[Class]]` name aliases.
        var functionClass = "[object Function]",
            dateClass = "[object Date]",
            numberClass = "[object Number]",
            stringClass = "[object String]",
            arrayClass = "[object Array]",
            booleanClass = "[object Boolean]";

        // Detect incomplete support for accessing string characters by index.
        var charIndexBuggy = has("bug-string-char-index");

        // Internal: Normalizes the `for...in` iteration algorithm across
        // environments. Each enumerated key is yielded to a `callback` function.
        var forOwn = function (object, callback) {
          var size = 0, Properties, dontEnums, property;

          // Tests for bugs in the current environment's `for...in` algorithm. The
          // `valueOf` property inherits the non-enumerable flag from
          // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
          (Properties = function () {
            this.valueOf = 0;
          }).prototype.valueOf = 0;

          // Iterate over a new instance of the `Properties` class.
          dontEnums = new Properties();
          for (property in dontEnums) {
            // Ignore all properties inherited from `Object.prototype`.
            if (isProperty.call(dontEnums, property)) {
              size++;
            }
          }
          Properties = dontEnums = null;

          // Normalize the iteration algorithm.
          if (!size) {
            // A list of non-enumerable properties inherited from `Object.prototype`.
            dontEnums = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
            // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
            // properties.
            forOwn = function (object, callback) {
              var isFunction = getClass.call(object) == functionClass, property, length;
              var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
              for (property in object) {
                // Gecko <= 1.0 enumerates the `prototype` property of functions under
                // certain conditions; IE does not.
                if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                  callback(property);
                }
              }
              // Manually invoke the callback for each non-enumerable property.
              for (length = dontEnums.length; property = dontEnums[--length];) {
                if (hasProperty.call(object, property)) {
                  callback(property);
                }
              }
            };
          } else {
            // No bugs detected; use the standard `for...in` algorithm.
            forOwn = function (object, callback) {
              var isFunction = getClass.call(object) == functionClass, property, isConstructor;
              for (property in object) {
                if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                  callback(property);
                }
              }
              // Manually invoke the callback for the `constructor` property due to
              // cross-environment inconsistencies.
              if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                callback(property);
              }
            };
          }
          return forOwn(object, callback);
        };

        // Public: Serializes a JavaScript `value` as a JSON string. The optional
        // `filter` argument may specify either a function that alters how object and
        // array members are serialized, or an array of strings and numbers that
        // indicates which properties should be serialized. The optional `width`
        // argument may be either a string or number that specifies the indentation
        // level of the output.
        if (!has("json-stringify") && !has("date-serialization")) {
          // Internal: A map of control characters and their escaped equivalents.
          var Escapes = {
            92: "\\\\",
            34: '\\"',
            8: "\\b",
            12: "\\f",
            10: "\\n",
            13: "\\r",
            9: "\\t"
          };

          // Internal: Converts `value` into a zero-padded string such that its
          // length is at least equal to `width`. The `width` must be <= 6.
          var leadingZeroes = "000000";
          var toPaddedString = function (width, value) {
            // The `|| 0` expression is necessary to work around a bug in
            // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
            return (leadingZeroes + (value || 0)).slice(-width);
          };

          // Internal: Serializes a date object.
          var serializeDate = function (value) {
            var getData, year, month, date, time, hours, minutes, seconds, milliseconds;
            // Define additional utility methods if the `Date` methods are buggy.
            if (!isExtended) {
              var floor = Math.floor;
              // A mapping between the months of the year and the number of days between
              // January 1st and the first of the respective month.
              var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
              // Internal: Calculates the number of days between the Unix epoch and the
              // first day of the given month.
              var getDay = function (year, month) {
                return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
              };
              getData = function (value) {
                // Manually compute the year, month, date, hours, minutes,
                // seconds, and milliseconds if the `getUTC*` methods are
                // buggy. Adapted from @Yaffle's `date-shim` project.
                date = floor(value / 864e5);
                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                date = 1 + date - getDay(year, month);
                // The `time` value specifies the time within the day (see ES
                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                // to compute `A modulo B`, as the `%` operator does not
                // correspond to the `modulo` operation for negative numbers.
                time = (value % 864e5 + 864e5) % 864e5;
                // The hours, minutes, seconds, and milliseconds are obtained by
                // decomposing the time within the day. See section 15.9.1.10.
                hours = floor(time / 36e5) % 24;
                minutes = floor(time / 6e4) % 60;
                seconds = floor(time / 1e3) % 60;
                milliseconds = time % 1e3;
              };
            } else {
              getData = function (value) {
                year = value.getUTCFullYear();
                month = value.getUTCMonth();
                date = value.getUTCDate();
                hours = value.getUTCHours();
                minutes = value.getUTCMinutes();
                seconds = value.getUTCSeconds();
                milliseconds = value.getUTCMilliseconds();
              };
            }
            serializeDate = function (value) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                getData(value);
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                // Months, dates, hours, minutes, and seconds should have two
                // digits; milliseconds should have three.
                "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                // Milliseconds are optional in ES 5.0, but required in 5.1.
                "." + toPaddedString(3, milliseconds) + "Z";
                year = month = date = hours = minutes = seconds = milliseconds = null;
              } else {
                value = null;
              }
              return value;
            };
            return serializeDate(value);
          };

          // For environments with `JSON.stringify` but buggy date serialization,
          // we override the native `Date#toJSON` implementation with a
          // spec-compliant one.
          if (has("json-stringify") && !has("date-serialization")) {
            // Internal: the `Date#toJSON` implementation used to override the native one.
            function dateToJSON (key) {
              return serializeDate(this);
            }

            // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
            var nativeStringify = exports.stringify;
            exports.stringify = function (source, filter, width) {
              var nativeToJSON = Date.prototype.toJSON;
              Date.prototype.toJSON = dateToJSON;
              var result = nativeStringify(source, filter, width);
              Date.prototype.toJSON = nativeToJSON;
              return result;
            };
          } else {
            // Internal: Double-quotes a string `value`, replacing all ASCII control
            // characters (characters with code unit values between 0 and 31) with
            // their escaped equivalents. This is an implementation of the
            // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
            var unicodePrefix = "\\u00";
            var escapeChar = function (character) {
              var charCode = character.charCodeAt(0), escaped = Escapes[charCode];
              if (escaped) {
                return escaped;
              }
              return unicodePrefix + toPaddedString(2, charCode.toString(16));
            };
            var reEscape = /[\x00-\x1f\x22\x5c]/g;
            var quote = function (value) {
              reEscape.lastIndex = 0;
              return '"' +
                (
                  reEscape.test(value)
                    ? value.replace(reEscape, escapeChar)
                    : value
                ) +
                '"';
            };

            // Internal: Recursively serializes an object. Implements the
            // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
            var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
              var value, type, className, results, element, index, length, prefix, result;
              attempt(function () {
                // Necessary for host object support.
                value = object[property];
              });
              if (typeof value == "object" && value) {
                if (value.getUTCFullYear && getClass.call(value) == dateClass && value.toJSON === Date.prototype.toJSON) {
                  value = serializeDate(value);
                } else if (typeof value.toJSON == "function") {
                  value = value.toJSON(property);
                }
              }
              if (callback) {
                // If a replacement function was provided, call it to obtain the value
                // for serialization.
                value = callback.call(object, property, value);
              }
              // Exit early if value is `undefined` or `null`.
              if (value == undefined$1) {
                return value === undefined$1 ? value : "null";
              }
              type = typeof value;
              // Only call `getClass` if the value is an object.
              if (type == "object") {
                className = getClass.call(value);
              }
              switch (className || type) {
                case "boolean":
                case booleanClass:
                  // Booleans are represented literally.
                  return "" + value;
                case "number":
                case numberClass:
                  // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                  // `"null"`.
                  return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                case "string":
                case stringClass:
                  // Strings are double-quoted and escaped.
                  return quote("" + value);
              }
              // Recursively serialize objects and arrays.
              if (typeof value == "object") {
                // Check for cyclic structures. This is a linear search; performance
                // is inversely proportional to the number of unique nested objects.
                for (length = stack.length; length--;) {
                  if (stack[length] === value) {
                    // Cyclic structures cannot be serialized by `JSON.stringify`.
                    throw TypeError();
                  }
                }
                // Add the object to the stack of traversed objects.
                stack.push(value);
                results = [];
                // Save the current indentation level and indent one additional level.
                prefix = indentation;
                indentation += whitespace;
                if (className == arrayClass) {
                  // Recursively serialize array elements.
                  for (index = 0, length = value.length; index < length; index++) {
                    element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                    results.push(element === undefined$1 ? "null" : element);
                  }
                  result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                } else {
                  // Recursively serialize object members. Members are selected from
                  // either a user-specified list of property names, or the object
                  // itself.
                  forOwn(properties || value, function (property) {
                    var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                    if (element !== undefined$1) {
                      // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                      // is not the empty string, let `member` {quote(property) + ":"}
                      // be the concatenation of `member` and the `space` character."
                      // The "`space` character" refers to the literal space
                      // character, not the `space` {width} argument provided to
                      // `JSON.stringify`.
                      results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                    }
                  });
                  result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                }
                // Remove the object from the traversed object stack.
                stack.pop();
                return result;
              }
            };

            // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
            exports.stringify = function (source, filter, width) {
              var whitespace, callback, properties, className;
              if (objectTypes[typeof filter] && filter) {
                className = getClass.call(filter);
                if (className == functionClass) {
                  callback = filter;
                } else if (className == arrayClass) {
                  // Convert the property names array into a makeshift set.
                  properties = {};
                  for (var index = 0, length = filter.length, value; index < length;) {
                    value = filter[index++];
                    className = getClass.call(value);
                    if (className == "[object String]" || className == "[object Number]") {
                      properties[value] = 1;
                    }
                  }
                }
              }
              if (width) {
                className = getClass.call(width);
                if (className == numberClass) {
                  // Convert the `width` to an integer and create a string containing
                  // `width` number of space characters.
                  if ((width -= width % 1) > 0) {
                    if (width > 10) {
                      width = 10;
                    }
                    for (whitespace = ""; whitespace.length < width;) {
                      whitespace += " ";
                    }
                  }
                } else if (className == stringClass) {
                  whitespace = width.length <= 10 ? width : width.slice(0, 10);
                }
              }
              // Opera <= 7.54u2 discards the values associated with empty string keys
              // (`""`) only if they are used directly within an object member list
              // (e.g., `!("" in { "": 1})`).
              return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
            };
          }
        }

        // Public: Parses a JSON source string.
        if (!has("json-parse")) {
          var fromCharCode = String.fromCharCode;

          // Internal: A map of escaped control characters and their unescaped
          // equivalents.
          var Unescapes = {
            92: "\\",
            34: '"',
            47: "/",
            98: "\b",
            116: "\t",
            110: "\n",
            102: "\f",
            114: "\r"
          };

          // Internal: Stores the parser state.
          var Index, Source;

          // Internal: Resets the parser state and throws a `SyntaxError`.
          var abort = function () {
            Index = Source = null;
            throw SyntaxError();
          };

          // Internal: Returns the next token, or `"$"` if the parser has reached
          // the end of the source string. A token may be a string, number, `null`
          // literal, or Boolean literal.
          var lex = function () {
            var source = Source, length = source.length, value, begin, position, isSigned, charCode;
            while (Index < length) {
              charCode = source.charCodeAt(Index);
              switch (charCode) {
                case 9: case 10: case 13: case 32:
                  // Skip whitespace tokens, including tabs, carriage returns, line
                  // feeds, and space characters.
                  Index++;
                  break;
                case 123: case 125: case 91: case 93: case 58: case 44:
                  // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                  // the current position.
                  value = charIndexBuggy ? source.charAt(Index) : source[Index];
                  Index++;
                  return value;
                case 34:
                  // `"` delimits a JSON string; advance to the next character and
                  // begin parsing the string. String tokens are prefixed with the
                  // sentinel `@` character to distinguish them from punctuators and
                  // end-of-string tokens.
                  for (value = "@", Index++; Index < length;) {
                    charCode = source.charCodeAt(Index);
                    if (charCode < 32) {
                      // Unescaped ASCII control characters (those with a code unit
                      // less than the space character) are not permitted.
                      abort();
                    } else if (charCode == 92) {
                      // A reverse solidus (`\`) marks the beginning of an escaped
                      // control character (including `"`, `\`, and `/`) or Unicode
                      // escape sequence.
                      charCode = source.charCodeAt(++Index);
                      switch (charCode) {
                        case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                          // Revive escaped control characters.
                          value += Unescapes[charCode];
                          Index++;
                          break;
                        case 117:
                          // `\u` marks the beginning of a Unicode escape sequence.
                          // Advance to the first character and validate the
                          // four-digit code point.
                          begin = ++Index;
                          for (position = Index + 4; Index < position; Index++) {
                            charCode = source.charCodeAt(Index);
                            // A valid sequence comprises four hexdigits (case-
                            // insensitive) that form a single hexadecimal value.
                            if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                              // Invalid Unicode escape sequence.
                              abort();
                            }
                          }
                          // Revive the escaped character.
                          value += fromCharCode("0x" + source.slice(begin, Index));
                          break;
                        default:
                          // Invalid escape sequence.
                          abort();
                      }
                    } else {
                      if (charCode == 34) {
                        // An unescaped double-quote character marks the end of the
                        // string.
                        break;
                      }
                      charCode = source.charCodeAt(Index);
                      begin = Index;
                      // Optimize for the common case where a string is valid.
                      while (charCode >= 32 && charCode != 92 && charCode != 34) {
                        charCode = source.charCodeAt(++Index);
                      }
                      // Append the string as-is.
                      value += source.slice(begin, Index);
                    }
                  }
                  if (source.charCodeAt(Index) == 34) {
                    // Advance to the next character and return the revived string.
                    Index++;
                    return value;
                  }
                  // Unterminated string.
                  abort();
                default:
                  // Parse numbers and literals.
                  begin = Index;
                  // Advance past the negative sign, if one is specified.
                  if (charCode == 45) {
                    isSigned = true;
                    charCode = source.charCodeAt(++Index);
                  }
                  // Parse an integer or floating-point value.
                  if (charCode >= 48 && charCode <= 57) {
                    // Leading zeroes are interpreted as octal literals.
                    if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                      // Illegal octal literal.
                      abort();
                    }
                    isSigned = false;
                    // Parse the integer component.
                    for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                    // Floats cannot contain a leading decimal point; however, this
                    // case is already accounted for by the parser.
                    if (source.charCodeAt(Index) == 46) {
                      position = ++Index;
                      // Parse the decimal component.
                      for (; position < length; position++) {
                        charCode = source.charCodeAt(position);
                        if (charCode < 48 || charCode > 57) {
                          break;
                        }
                      }
                      if (position == Index) {
                        // Illegal trailing decimal.
                        abort();
                      }
                      Index = position;
                    }
                    // Parse exponents. The `e` denoting the exponent is
                    // case-insensitive.
                    charCode = source.charCodeAt(Index);
                    if (charCode == 101 || charCode == 69) {
                      charCode = source.charCodeAt(++Index);
                      // Skip past the sign following the exponent, if one is
                      // specified.
                      if (charCode == 43 || charCode == 45) {
                        Index++;
                      }
                      // Parse the exponential component.
                      for (position = Index; position < length; position++) {
                        charCode = source.charCodeAt(position);
                        if (charCode < 48 || charCode > 57) {
                          break;
                        }
                      }
                      if (position == Index) {
                        // Illegal empty exponent.
                        abort();
                      }
                      Index = position;
                    }
                    // Coerce the parsed value to a JavaScript number.
                    return +source.slice(begin, Index);
                  }
                  // A negative sign may only precede numbers.
                  if (isSigned) {
                    abort();
                  }
                  // `true`, `false`, and `null` literals.
                  var temp = source.slice(Index, Index + 4);
                  if (temp == "true") {
                    Index += 4;
                    return true;
                  } else if (temp == "fals" && source.charCodeAt(Index + 4 ) == 101) {
                    Index += 5;
                    return false;
                  } else if (temp == "null") {
                    Index += 4;
                    return null;
                  }
                  // Unrecognized token.
                  abort();
              }
            }
            // Return the sentinel `$` character if the parser has reached the end
            // of the source string.
            return "$";
          };

          // Internal: Parses a JSON `value` token.
          var get = function (value) {
            var results, hasMembers;
            if (value == "$") {
              // Unexpected end of input.
              abort();
            }
            if (typeof value == "string") {
              if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                // Remove the sentinel `@` character.
                return value.slice(1);
              }
              // Parse object and array literals.
              if (value == "[") {
                // Parses a JSON array, returning a new JavaScript array.
                results = [];
                for (;;) {
                  value = lex();
                  // A closing square bracket marks the end of the array literal.
                  if (value == "]") {
                    break;
                  }
                  // If the array literal contains elements, the current token
                  // should be a comma separating the previous element from the
                  // next.
                  if (hasMembers) {
                    if (value == ",") {
                      value = lex();
                      if (value == "]") {
                        // Unexpected trailing `,` in array literal.
                        abort();
                      }
                    } else {
                      // A `,` must separate each array element.
                      abort();
                    }
                  } else {
                    hasMembers = true;
                  }
                  // Elisions and leading commas are not permitted.
                  if (value == ",") {
                    abort();
                  }
                  results.push(get(value));
                }
                return results;
              } else if (value == "{") {
                // Parses a JSON object, returning a new JavaScript object.
                results = {};
                for (;;) {
                  value = lex();
                  // A closing curly brace marks the end of the object literal.
                  if (value == "}") {
                    break;
                  }
                  // If the object literal contains members, the current token
                  // should be a comma separator.
                  if (hasMembers) {
                    if (value == ",") {
                      value = lex();
                      if (value == "}") {
                        // Unexpected trailing `,` in object literal.
                        abort();
                      }
                    } else {
                      // A `,` must separate each object member.
                      abort();
                    }
                  } else {
                    hasMembers = true;
                  }
                  // Leading commas are not permitted, object property names must be
                  // double-quoted strings, and a `:` must separate each property
                  // name and value.
                  if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                    abort();
                  }
                  results[value.slice(1)] = get(lex());
                }
                return results;
              }
              // Unexpected token encountered.
              abort();
            }
            return value;
          };

          // Internal: Updates a traversed object member.
          var update = function (source, property, callback) {
            var element = walk(source, property, callback);
            if (element === undefined$1) {
              delete source[property];
            } else {
              source[property] = element;
            }
          };

          // Internal: Recursively traverses a parsed JSON object, invoking the
          // `callback` function for each value. This is an implementation of the
          // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
          var walk = function (source, property, callback) {
            var value = source[property], length;
            if (typeof value == "object" && value) {
              // `forOwn` can't be used to traverse an array in Opera <= 8.54
              // because its `Object#hasOwnProperty` implementation returns `false`
              // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
              if (getClass.call(value) == arrayClass) {
                for (length = value.length; length--;) {
                  update(getClass, forOwn, value, length, callback);
                }
              } else {
                forOwn(value, function (property) {
                  update(value, property, callback);
                });
              }
            }
            return callback.call(source, property, value);
          };

          // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
          exports.parse = function (source, callback) {
            var result, value;
            Index = 0;
            Source = "" + source;
            result = get(lex());
            // If a JSON string contains multiple tokens, it is invalid.
            if (lex() != "$") {
              abort();
            }
            // Reset the parser state.
            Index = Source = null;
            return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
          };
        }
      }

      exports.runInContext = runInContext;
      return exports;
    }

    if (freeExports && !isLoader) {
      // Export for CommonJS environments.
      runInContext(root, freeExports);
    } else {
      // Export for web browsers and JavaScript engines.
      var nativeJSON = root.JSON,
          previousJSON = root.JSON3,
          isRestored = false;

      var JSON3 = runInContext(root, (root.JSON3 = {
        // Public: Restores the original value of the global `JSON` object and
        // returns a reference to the `JSON3` object.
        "noConflict": function () {
          if (!isRestored) {
            isRestored = true;
            root.JSON = nativeJSON;
            root.JSON3 = previousJSON;
            nativeJSON = previousJSON = null;
          }
          return JSON3;
        }
      }));

      root.JSON = {
        "parse": JSON3.parse,
        "stringify": JSON3.stringify
      };
    }
  }).call(commonjsGlobal);
  });

  var componentUrl = createCommonjsModule(function (module, exports) {
  /**
   * Parse the given `url`.
   *
   * @param {String} str
   * @return {Object}
   * @api public
   */

  exports.parse = function(url){
    var a = document.createElement('a');
    a.href = url;
    return {
      href: a.href,
      host: a.host || location.host,
      port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
      hash: a.hash,
      hostname: a.hostname || location.hostname,
      pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
      protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
      search: a.search,
      query: a.search.slice(1)
    };
  };

  /**
   * Check if `url` is absolute.
   *
   * @param {String} url
   * @return {Boolean}
   * @api public
   */

  exports.isAbsolute = function(url){
    return 0 == url.indexOf('//') || !!~url.indexOf('://');
  };

  /**
   * Check if `url` is relative.
   *
   * @param {String} url
   * @return {Boolean}
   * @api public
   */

  exports.isRelative = function(url){
    return !exports.isAbsolute(url);
  };

  /**
   * Check if `url` is cross domain.
   *
   * @param {String} url
   * @return {Boolean}
   * @api public
   */

  exports.isCrossDomain = function(url){
    url = exports.parse(url);
    var location = exports.parse(window.location.href);
    return url.hostname !== location.hostname
      || url.port !== location.port
      || url.protocol !== location.protocol;
  };

  /**
   * Return default port for `protocol`.
   *
   * @param  {String} protocol
   * @return {String}
   * @api private
   */
  function port (protocol){
    switch (protocol) {
      case 'http:':
        return 80;
      case 'https:':
        return 443;
      default:
        return location.port;
    }
  }
  });
  var componentUrl_1 = componentUrl.parse;
  var componentUrl_2 = componentUrl.isAbsolute;
  var componentUrl_3 = componentUrl.isRelative;
  var componentUrl_4 = componentUrl.isCrossDomain;

  var lib = createCommonjsModule(function (module, exports) {

  /**
   * Module dependencies.
   */

  var parse = componentUrl.parse;


  /**
   * Get the top domain.
   *
   * The function constructs the levels of domain and attempts to set a global
   * cookie on each one when it succeeds it returns the top level domain.
   *
   * The method returns an empty string when the hostname is an ip or `localhost`.
   *
   * Example levels:
   *
   *      domain.levels('http://www.google.co.uk');
   *      // => ["co.uk", "google.co.uk", "www.google.co.uk"]
   *
   * Example:
   *
   *      domain('http://localhost:3000/baz');
   *      // => ''
   *      domain('http://dev:3000/baz');
   *      // => ''
   *      domain('http://127.0.0.1:3000/baz');
   *      // => ''
   *      domain('http://segment.io/baz');
   *      // => 'segment.io'
   *
   * @param {string} url
   * @return {string}
   * @api public
   */
  function domain(url) {
    var cookie = exports.cookie;
    var levels = exports.levels(url);

    // Lookup the real top level one.
    for (var i = 0; i < levels.length; ++i) {
      var cname = '__tld__';
      var domain = levels[i];
      var opts = { domain: '.' + domain };

      cookie(cname, 1, opts);
      if (cookie(cname)) {
        cookie(cname, null, opts);
        return domain;
      }
    }

    return '';
  }

  /**
   * Levels returns all levels of the given url.
   *
   * @param {string} url
   * @return {Array}
   * @api public
   */
  domain.levels = function(url) {
    var host = parse(url).hostname;
    var parts = host.split('.');
    var last = parts[parts.length - 1];
    var levels = [];

    // Ip address.
    if (parts.length === 4 && last === parseInt(last, 10)) {
      return levels;
    }

    // Localhost.
    if (parts.length <= 1) {
      return levels;
    }

    // Create levels.
    for (var i = parts.length - 2; i >= 0; --i) {
      levels.push(parts.slice(i).join('.'));
    }

    return levels;
  };

  /**
   * Expose cookie on domain.
   */
  domain.cookie = componentCookie;

  /*
   * Exports.
   */

  exports = module.exports = domain;
  });

  /**
   * An object utility to persist values in cookies
   */

  var CookieLocal =
  /*#__PURE__*/
  function () {
    function CookieLocal(options) {
      _classCallCheck(this, CookieLocal);

      this._options = {};
      this.options(options);
    }
    /**
     *
     * @param {*} options
     */


    _createClass(CookieLocal, [{
      key: "options",
      value: function options() {
        var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (arguments.length === 0) return this._options;
        var domain = "." + lib(window.location.href);
        if (domain === ".") domain = null; // the default maxage and path

        this._options = defaults_1(_options, {
          maxage: 31536000000,
          path: "/",
          domain: domain
        }); //try setting a cookie first

        this.set("test_rudder", true);

        if (!this.get("test_rudder")) {
          this._options.domain = null;
        }

        this.remove("test_rudder");
      }
      /**
       *
       * @param {*} key
       * @param {*} value
       */

    }, {
      key: "set",
      value: function set(key, value) {
        try {
          value = json3.stringify(value);
          componentCookie(key, value, clone_1(this._options));
          return true;
        } catch (e) {
          return false;
        }
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "get",
      value: function get(key) {
        try {
          var value = componentCookie(key);
          value = value ? json3.parse(value) : null;
          return value;
        } catch (e) {
          return null;
        }
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "remove",
      value: function remove(key) {
        try {
          componentCookie(key, null, clone_1(this._options));
          return true;
        } catch (e) {
          return false;
        }
      }
    }]);

    return CookieLocal;
  }(); // Exporting only the instance


  var Cookie = new CookieLocal({});

  var store = (function() {
  	// Store.js
  	var store = {},
  		win = (typeof window != 'undefined' ? window : commonjsGlobal),
  		doc = win.document,
  		localStorageName = 'localStorage',
  		scriptTag = 'script',
  		storage;

  	store.disabled = false;
  	store.version = '1.3.20';
  	store.set = function(key, value) {};
  	store.get = function(key, defaultVal) {};
  	store.has = function(key) { return store.get(key) !== undefined };
  	store.remove = function(key) {};
  	store.clear = function() {};
  	store.transact = function(key, defaultVal, transactionFn) {
  		if (transactionFn == null) {
  			transactionFn = defaultVal;
  			defaultVal = null;
  		}
  		if (defaultVal == null) {
  			defaultVal = {};
  		}
  		var val = store.get(key, defaultVal);
  		transactionFn(val);
  		store.set(key, val);
  	};
  	store.getAll = function() {
  		var ret = {};
  		store.forEach(function(key, val) {
  			ret[key] = val;
  		});
  		return ret
  	};
  	store.forEach = function() {};
  	store.serialize = function(value) {
  		return json3.stringify(value)
  	};
  	store.deserialize = function(value) {
  		if (typeof value != 'string') { return undefined }
  		try { return json3.parse(value) }
  		catch(e) { return value || undefined }
  	};

  	// Functions to encapsulate questionable FireFox 3.6.13 behavior
  	// when about.config::dom.storage.enabled === false
  	// See https://github.com/marcuswestin/store.js/issues#issue/13
  	function isLocalStorageNameSupported() {
  		try { return (localStorageName in win && win[localStorageName]) }
  		catch(err) { return false }
  	}

  	if (isLocalStorageNameSupported()) {
  		storage = win[localStorageName];
  		store.set = function(key, val) {
  			if (val === undefined) { return store.remove(key) }
  			storage.setItem(key, store.serialize(val));
  			return val
  		};
  		store.get = function(key, defaultVal) {
  			var val = store.deserialize(storage.getItem(key));
  			return (val === undefined ? defaultVal : val)
  		};
  		store.remove = function(key) { storage.removeItem(key); };
  		store.clear = function() { storage.clear(); };
  		store.forEach = function(callback) {
  			for (var i=0; i<storage.length; i++) {
  				var key = storage.key(i);
  				callback(key, store.get(key));
  			}
  		};
  	} else if (doc && doc.documentElement.addBehavior) {
  		var storageOwner,
  			storageContainer;
  		// Since #userData storage applies only to specific paths, we need to
  		// somehow link our data to a specific path.  We choose /favicon.ico
  		// as a pretty safe option, since all browsers already make a request to
  		// this URL anyway and being a 404 will not hurt us here.  We wrap an
  		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
  		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
  		// since the iframe access rules appear to allow direct access and
  		// manipulation of the document element, even for a 404 page.  This
  		// document can be used instead of the current document (which would
  		// have been limited to the current path) to perform #userData storage.
  		try {
  			storageContainer = new ActiveXObject('htmlfile');
  			storageContainer.open();
  			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>');
  			storageContainer.close();
  			storageOwner = storageContainer.w.frames[0].document;
  			storage = storageOwner.createElement('div');
  		} catch(e) {
  			// somehow ActiveXObject instantiation failed (perhaps some special
  			// security settings or otherwse), fall back to per-path storage
  			storage = doc.createElement('div');
  			storageOwner = doc.body;
  		}
  		var withIEStorage = function(storeFunction) {
  			return function() {
  				var args = Array.prototype.slice.call(arguments, 0);
  				args.unshift(storage);
  				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
  				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
  				storageOwner.appendChild(storage);
  				storage.addBehavior('#default#userData');
  				storage.load(localStorageName);
  				var result = storeFunction.apply(store, args);
  				storageOwner.removeChild(storage);
  				return result
  			}
  		};

  		// In IE7, keys cannot start with a digit or contain certain chars.
  		// See https://github.com/marcuswestin/store.js/issues/40
  		// See https://github.com/marcuswestin/store.js/issues/83
  		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
  		var ieKeyFix = function(key) {
  			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
  		};
  		store.set = withIEStorage(function(storage, key, val) {
  			key = ieKeyFix(key);
  			if (val === undefined) { return store.remove(key) }
  			storage.setAttribute(key, store.serialize(val));
  			storage.save(localStorageName);
  			return val
  		});
  		store.get = withIEStorage(function(storage, key, defaultVal) {
  			key = ieKeyFix(key);
  			var val = store.deserialize(storage.getAttribute(key));
  			return (val === undefined ? defaultVal : val)
  		});
  		store.remove = withIEStorage(function(storage, key) {
  			key = ieKeyFix(key);
  			storage.removeAttribute(key);
  			storage.save(localStorageName);
  		});
  		store.clear = withIEStorage(function(storage) {
  			var attributes = storage.XMLDocument.documentElement.attributes;
  			storage.load(localStorageName);
  			for (var i=attributes.length-1; i>=0; i--) {
  				storage.removeAttribute(attributes[i].name);
  			}
  			storage.save(localStorageName);
  		});
  		store.forEach = withIEStorage(function(storage, callback) {
  			var attributes = storage.XMLDocument.documentElement.attributes;
  			for (var i=0, attr; attr=attributes[i]; ++i) {
  				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
  			}
  		});
  	}

  	try {
  		var testKey = '__storejs__';
  		store.set(testKey, testKey);
  		if (store.get(testKey) != testKey) { store.disabled = true; }
  		store.remove(testKey);
  	} catch(e) {
  		store.disabled = true;
  	}
  	store.enabled = !store.disabled;
  	
  	return store
  }());

  /**
   * An object utility to persist user and other values in localstorage
   */

  var StoreLocal =
  /*#__PURE__*/
  function () {
    function StoreLocal(options) {
      _classCallCheck(this, StoreLocal);

      this._options = {};
      this.enabled = false;
      this.options(options);
    }
    /**
     *
     * @param {*} options
     */


    _createClass(StoreLocal, [{
      key: "options",
      value: function options() {
        var _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (arguments.length === 0) return this._options;
        defaults_1(_options, {
          enabled: true
        });
        this.enabled = _options.enabled && store.enabled;
        this._options = _options;
      }
      /**
       *
       * @param {*} key
       * @param {*} value
       */

    }, {
      key: "set",
      value: function set(key, value) {
        if (!this.enabled) return false;
        return store.set(key, value);
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "get",
      value: function get(key) {
        if (!this.enabled) return null;
        return store.get(key);
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "remove",
      value: function remove(key) {
        if (!this.enabled) return false;
        return store.remove(key);
      }
    }]);

    return StoreLocal;
  }(); // Exporting only the instance


  var Store = new StoreLocal({});

  var defaults$1 = {
    user_storage_key: "rl_user_id",
    user_storage_trait: "rl_trait",
    user_storage_anonymousId: "rl_anonymous_id"
  };
  /**
   * An object that handles persisting key-val from Analytics
   */

  var Storage =
  /*#__PURE__*/
  function () {
    function Storage() {
      _classCallCheck(this, Storage);

      // First try setting the storage to cookie else to localstorage
      Cookie.set("rudder_cookies", true);

      if (Cookie.get("rudder_cookies")) {
        Cookie.remove("rudder_cookies");
        this.storage = Cookie;
        return;
      } // localStorage is enabled.


      if (Store.enabled) {
        this.storage = Store;
        return;
      }
    }
    /**
     *
     * @param {*} key
     * @param {*} value
     */


    _createClass(Storage, [{
      key: "setItem",
      value: function setItem(key, value) {
        this.storage.set(key, value);
      }
      /**
       *
       * @param {*} value
       */

    }, {
      key: "setUserId",
      value: function setUserId(value) {
        if (typeof value != "string") {
          logger.error("userId should be string");
          return;
        }

        this.storage.set(defaults$1.user_storage_key, value);
        return;
      }
      /**
       *
       * @param {*} value
       */

    }, {
      key: "setUserTraits",
      value: function setUserTraits(value) {
        this.storage.set(defaults$1.user_storage_trait, value);
        return;
      }
      /**
       *
       * @param {*} value
       */

    }, {
      key: "setAnonymousId",
      value: function setAnonymousId(value) {
        if (typeof value != "string") {
          logger.error("anonymousId should be string");
          return;
        }

        this.storage.set(defaults$1.user_storage_anonymousId, value);
        return;
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "getItem",
      value: function getItem(key) {
        return this.storage.get(key);
      }
      /**
       * get the stored userId
       */

    }, {
      key: "getUserId",
      value: function getUserId() {
        return this.storage.get(defaults$1.user_storage_key);
      }
      /**
       * get the stored user traits
       */

    }, {
      key: "getUserTraits",
      value: function getUserTraits() {
        return this.storage.get(defaults$1.user_storage_trait);
      }
      /**
       * get stored anonymous id
       */

    }, {
      key: "getAnonymousId",
      value: function getAnonymousId() {
        return this.storage.get(defaults$1.user_storage_anonymousId);
      }
      /**
       *
       * @param {*} key
       */

    }, {
      key: "removeItem",
      value: function removeItem(key) {
        return this.storage.remove(key);
      }
      /**
       * remove stored keys
       */

    }, {
      key: "clear",
      value: function clear() {
        this.storage.remove(defaults$1.user_storage_key);
        this.storage.remove(defaults$1.user_storage_trait);
        this.storage.remove(defaults$1.user_storage_anonymousId);
      }
    }]);

    return Storage;
  }();

  var Storage$1 =  Storage ;

  //Payload class, contains batch of Elements
  var RudderPayload = function RudderPayload() {
    _classCallCheck(this, RudderPayload);

    this.batch = null;
    this.writeKey = null;
  };

  var rngBrowser = createCommonjsModule(function (module) {
  // Unique ID creation requires a high quality random # generator.  In the
  // browser this is a little complicated due to unknown quality of Math.random()
  // and inconsistent support for the `crypto` API.  We do the best we can via
  // feature-detection

  // getRandomValues needs to be invoked in a context where "this" is a Crypto
  // implementation. Also, find the complete implementation of crypto on IE11.
  var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                        (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

  if (getRandomValues) {
    // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
    var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

    module.exports = function whatwgRNG() {
      getRandomValues(rnds8);
      return rnds8;
    };
  } else {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var rnds = new Array(16);

    module.exports = function mathRNG() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return rnds;
    };
  }
  });

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }

  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
    return ([bth[buf[i++]], bth[buf[i++]], 
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]], '-',
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]],
  	bth[buf[i++]], bth[buf[i++]]]).join('');
  }

  var bytesToUuid_1 = bytesToUuid;

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  var _nodeId;
  var _clockseq;

  // Previous uuid creation time
  var _lastMSecs = 0;
  var _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};
    var node = options.node || _nodeId;
    var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

    // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
      var seedBytes = rngBrowser();
      if (node == null) {
        // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
        node = _nodeId = [
          seedBytes[0] | 0x01,
          seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
        ];
      }
      if (clockseq == null) {
        // Per 4.2.2, randomize (14 bit) clockseq
        clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
      }
    }

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    for (var n = 0; n < 6; ++n) {
      b[i + n] = node[n];
    }

    return buf ? buf : bytesToUuid_1(b);
  }

  var v1_1 = v1;

  function v4(options, buf, offset) {
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || rngBrowser)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || bytesToUuid_1(rnds);
  }

  var v4_1 = v4;

  var uuid = v4_1;
  uuid.v1 = v1_1;
  uuid.v4 = v4_1;

  var uuid_1 = uuid;

  var hop = Object.prototype.hasOwnProperty;
  var strCharAt = String.prototype.charAt;
  var toStr = Object.prototype.toString;

  /**
   * Returns the character at a given index.
   *
   * @param {string} str
   * @param {number} index
   * @return {string|undefined}
   */
  // TODO: Move to a library
  var charAt = function(str, index) {
    return strCharAt.call(str, index);
  };

  /**
   * hasOwnProperty, wrapped as a function.
   *
   * @name has
   * @api private
   * @param {*} context
   * @param {string|number} prop
   * @return {boolean}
   */

  // TODO: Move to a library
  var has$1 = function has(context, prop) {
    return hop.call(context, prop);
  };

  /**
   * Returns true if a value is a string, otherwise false.
   *
   * @name isString
   * @api private
   * @param {*} val
   * @return {boolean}
   */

  // TODO: Move to a library
  var isString = function isString(val) {
    return toStr.call(val) === '[object String]';
  };

  /**
   * Returns true if a value is array-like, otherwise false. Array-like means a
   * value is not null, undefined, or a function, and has a numeric `length`
   * property.
   *
   * @name isArrayLike
   * @api private
   * @param {*} val
   * @return {boolean}
   */
  // TODO: Move to a library
  var isArrayLike = function isArrayLike(val) {
    return val != null && (typeof val !== 'function' && typeof val.length === 'number');
  };


  /**
   * indexKeys
   *
   * @name indexKeys
   * @api private
   * @param {} target
   * @param {Function} pred
   * @return {Array}
   */
  var indexKeys = function indexKeys(target, pred) {
    pred = pred || has$1;

    var results = [];

    for (var i = 0, len = target.length; i < len; i += 1) {
      if (pred(target, i)) {
        results.push(String(i));
      }
    }

    return results;
  };

  /**
   * Returns an array of an object's owned keys.
   *
   * @name objectKeys
   * @api private
   * @param {*} target
   * @param {Function} pred Predicate function used to include/exclude values from
   * the resulting array.
   * @return {Array}
   */
  var objectKeys = function objectKeys(target, pred) {
    pred = pred || has$1;

    var results = [];

    for (var key in target) {
      if (pred(target, key)) {
        results.push(String(key));
      }
    }

    return results;
  };

  /**
   * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
   * More permissive than the native `Object.keys` function (non-objects will not throw errors).
   *
   * @name keys
   * @api public
   * @category Object
   * @param {Object} source The value to retrieve keys from.
   * @return {Array} An array containing all the input `source`'s keys.
   * @example
   * keys({ likes: 'avocado', hates: 'pineapple' });
   * //=> ['likes', 'pineapple'];
   *
   * // Ignores non-enumerable properties
   * var hasHiddenKey = { name: 'Tim' };
   * Object.defineProperty(hasHiddenKey, 'hidden', {
   *   value: 'i am not enumerable!',
   *   enumerable: false
   * })
   * keys(hasHiddenKey);
   * //=> ['name'];
   *
   * // Works on arrays
   * keys(['a', 'b', 'c']);
   * //=> ['0', '1', '2']
   *
   * // Skips unpopulated indices in sparse arrays
   * var arr = [1];
   * arr[4] = 4;
   * keys(arr);
   * //=> ['0', '4']
   */
  var keys = function keys(source) {
    if (source == null) {
      return [];
    }

    // IE6-8 compatibility (string)
    if (isString(source)) {
      return indexKeys(source, charAt);
    }

    // IE6-8 compatibility (arguments)
    if (isArrayLike(source)) {
      return indexKeys(source, has$1);
    }

    return objectKeys(source);
  };

  /*
   * Exports.
   */

  var keys_1 = keys;

  var uuid$1 = uuid_1.v4;

  var inMemoryStore = {
    _data: {},
    length: 0,
    setItem: function(key, value) {
      this._data[key] = value;
      this.length = keys_1(this._data).length;
      return value;
    },
    getItem: function(key) {
      if (key in this._data) {
        return this._data[key];
      }
      return null;
    },
    removeItem: function(key) {
      if (key in this._data) {
        delete this._data[key];
      }
      this.length = keys_1(this._data).length;
      return null;
    },
    clear: function() {
      this._data = {};
      this.length = 0;
    },
    key: function(index) {
      return keys_1(this._data)[index];
    }
  };

  function isSupportedNatively() {
    try {
      if (!window.localStorage) return false;
      var key = uuid$1();
      window.localStorage.setItem(key, 'test_value');
      var value = window.localStorage.getItem(key);
      window.localStorage.removeItem(key);

      // handle localStorage silently failing
      return value === 'test_value';
    } catch (e) {
      // Can throw if localStorage is disabled
      return false;
    }
  }

  function pickStorage() {
    if (isSupportedNatively()) {
      return window.localStorage;
    }
    // fall back to in-memory
    return inMemoryStore;
  }

  // Return a shared instance
  var defaultEngine = pickStorage();
  // Expose the in-memory store explicitly for testing
  var inMemoryEngine = inMemoryStore;

  var engine = {
  	defaultEngine: defaultEngine,
  	inMemoryEngine: inMemoryEngine
  };

  /*
   * Module dependencies.
   */



  var objToString$1 = Object.prototype.toString;

  /**
   * Tests if a value is a number.
   *
   * @name isNumber
   * @api private
   * @param {*} val The value to test.
   * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
   */
  // TODO: Move to library
  var isNumber = function isNumber(val) {
    var type = typeof val;
    return type === 'number' || (type === 'object' && objToString$1.call(val) === '[object Number]');
  };

  /**
   * Tests if a value is an array.
   *
   * @name isArray
   * @api private
   * @param {*} val The value to test.
   * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
   */
  // TODO: Move to library
  var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
    return objToString$1.call(val) === '[object Array]';
  };

  /**
   * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
   * `.length` property.
   *
   * @name isArrayLike
   * @api private
   * @param {*} val
   * @return {boolean}
   */
  // TODO: Move to library
  var isArrayLike$1 = function isArrayLike(val) {
    return val != null && (isArray(val) || (val !== 'function' && isNumber(val.length)));
  };

  /**
   * Internal implementation of `each`. Works on arrays and array-like data structures.
   *
   * @name arrayEach
   * @api private
   * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
   * @param {Array} array The array(-like) structure to iterate over.
   * @return {undefined}
   */
  var arrayEach = function arrayEach(iterator, array) {
    for (var i = 0; i < array.length; i += 1) {
      // Break iteration early if `iterator` returns `false`
      if (iterator(array[i], i, array) === false) {
        break;
      }
    }
  };

  /**
   * Internal implementation of `each`. Works on objects.
   *
   * @name baseEach
   * @api private
   * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
   * @param {Object} object The object to iterate over.
   * @return {undefined}
   */
  var baseEach = function baseEach(iterator, object) {
    var ks = keys_1(object);

    for (var i = 0; i < ks.length; i += 1) {
      // Break iteration early if `iterator` returns `false`
      if (iterator(object[ks[i]], ks[i], object) === false) {
        break;
      }
    }
  };

  /**
   * Iterate over an input collection, invoking an `iterator` function for each element in the
   * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
   * function can end iteration early by returning `false`.
   *
   * @name each
   * @api public
   * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
   * @param {Array|Object|string} collection The collection to iterate over.
   * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
   * @example
   * var log = console.log.bind(console);
   *
   * each(log, ['a', 'b', 'c']);
   * //-> 'a', 0, ['a', 'b', 'c']
   * //-> 'b', 1, ['a', 'b', 'c']
   * //-> 'c', 2, ['a', 'b', 'c']
   * //=> undefined
   *
   * each(log, 'tim');
   * //-> 't', 2, 'tim'
   * //-> 'i', 1, 'tim'
   * //-> 'm', 0, 'tim'
   * //=> undefined
   *
   * // Note: Iteration order not guaranteed across environments
   * each(log, { name: 'tim', occupation: 'enchanter' });
   * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
   * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
   * //=> undefined
   */
  var each = function each(iterator, collection) {
    return (isArrayLike$1(collection) ? arrayEach : baseEach).call(this, iterator, collection);
  };

  /*
   * Exports.
   */

  var each_1 = each;

  var defaultEngine$1 = engine.defaultEngine;
  var inMemoryEngine$1 = engine.inMemoryEngine;




  /**
  * Store Implementation with dedicated
  */

  function Store$1(name, id, keys, optionalEngine) {
    this.id = id;
    this.name = name;
    this.keys = keys || {};
    this.engine = optionalEngine || defaultEngine$1;
  }

  /**
  * Set value by key.
  */

  Store$1.prototype.set = function(key, value) {
    var compoundKey = this._createValidKey(key);
    if (!compoundKey) return;
    try {
      this.engine.setItem(compoundKey, json3.stringify(value));
    } catch (err) {
      if (isQuotaExceeded(err)) {
        // switch to inMemory engine
        this._swapEngine();
        // and save it there
        this.set(key, value);
      }
    }
  };

  /**
  * Get by Key.
  */

  Store$1.prototype.get = function(key) {
    try {
      var str = this.engine.getItem(this._createValidKey(key));
      if (str === null) {
        return null;
      }
      return json3.parse(str);
    } catch (err) {
      return null;
    }
  };

  /**
  * Remove by Key.
  */

  Store$1.prototype.remove = function(key) {
    this.engine.removeItem(this._createValidKey(key));
  };

  /**
  * Ensure the key is valid
  */

  Store$1.prototype._createValidKey = function(key) {
    var name = this.name;
    var id = this.id;

    if (!keys_1(this.keys).length) return [name, id, key].join('.');

    // validate and return undefined if invalid key
    var compoundKey;
    each_1(function(value) {
      if (value === key) {
        compoundKey = [name, id, key].join('.');
      }
    }, this.keys);
    return compoundKey;
  };

  /**
  * Switch to inMemoryEngine, bringing any existing data with.
  */

  Store$1.prototype._swapEngine = function() {
    var self = this;

    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    each_1(function(key) {
      var value = self.get(key);
      inMemoryEngine$1.setItem([self.name, self.id, key].join('.'), value);
      self.remove(key);
    }, this.keys);

    this.engine = inMemoryEngine$1;
  };

  var store$1 = Store$1;

  function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e.code) {
      switch (e.code) {
      case 22:
        quotaExceeded = true;
        break;
      case 1014:
        // Firefox
        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          quotaExceeded = true;
        }
        break;
      default:
        break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
    return quotaExceeded;
  }

  var defaultClock = {
    setTimeout: function(fn, ms) {
      return window.setTimeout(fn, ms);
    },
    clearTimeout: function(id) {
      return window.clearTimeout(id);
    },
    Date: window.Date
  };

  var clock = defaultClock;

  function Schedule() {
    this.tasks = {};
    this.nextId = 1;
  }

  Schedule.prototype.now = function() {
    return +new clock.Date();
  };

  Schedule.prototype.run = function(task, timeout) {
    var id = this.nextId++;
    this.tasks[id] = clock.setTimeout(this._handle(id, task), timeout);
    return id;
  };

  Schedule.prototype.cancel = function(id) {
    if (this.tasks[id]) {
      clock.clearTimeout(this.tasks[id]);
      delete this.tasks[id];
    }
  };

  Schedule.prototype.cancelAll = function() {
    each_1(clock.clearTimeout, this.tasks);
    this.tasks = {};
  };

  Schedule.prototype._handle = function(id, callback) {
    var self = this;
    return function() {
      delete self.tasks[id];
      return callback();
    };
  };

  Schedule.setClock = function(newClock) {
    clock = newClock;
  };

  Schedule.resetClock = function() {
    clock = defaultClock;
  };

  var schedule = Schedule;

  /**
   * Expose `debug()` as the module.
   */

  var debug_1$1 = debug$1;

  /**
   * Create a debugger with the given `name`.
   *
   * @param {String} name
   * @return {Type}
   * @api public
   */

  function debug$1(name) {
    if (!debug$1.enabled(name)) return function(){};

    return function(fmt){
      fmt = coerce(fmt);

      var curr = new Date;
      var ms = curr - (debug$1[name] || curr);
      debug$1[name] = curr;

      fmt = name
        + ' '
        + fmt
        + ' +' + debug$1.humanize(ms);

      // This hackery is required for IE8
      // where `console.log` doesn't have 'apply'
      window.console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }
  }

  /**
   * The currently active debug mode names.
   */

  debug$1.names = [];
  debug$1.skips = [];

  /**
   * Enables a debug mode by name. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} name
   * @api public
   */

  debug$1.enable = function(name) {
    try {
      localStorage.debug = name;
    } catch(e){}

    var split = (name || '').split(/[\s,]+/)
      , len = split.length;

    for (var i = 0; i < len; i++) {
      name = split[i].replace('*', '.*?');
      if (name[0] === '-') {
        debug$1.skips.push(new RegExp('^' + name.substr(1) + '$'));
      }
      else {
        debug$1.names.push(new RegExp('^' + name + '$'));
      }
    }
  };

  /**
   * Disable debug output.
   *
   * @api public
   */

  debug$1.disable = function(){
    debug$1.enable('');
  };

  /**
   * Humanize the given `ms`.
   *
   * @param {Number} m
   * @return {String}
   * @api private
   */

  debug$1.humanize = function(ms) {
    var sec = 1000
      , min = 60 * 1000
      , hour = 60 * min;

    if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
    if (ms >= min) return (ms / min).toFixed(1) + 'm';
    if (ms >= sec) return (ms / sec | 0) + 's';
    return ms + 'ms';
  };

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  debug$1.enabled = function(name) {
    for (var i = 0, len = debug$1.skips.length; i < len; i++) {
      if (debug$1.skips[i].test(name)) {
        return false;
      }
    }
    for (var i = 0, len = debug$1.names.length; i < len; i++) {
      if (debug$1.names[i].test(name)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Coerce `val`.
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }

  // persist

  try {
    if (window.localStorage) debug$1.enable(localStorage.debug);
  } catch(e){}

  var componentEmitter = createCommonjsModule(function (module) {
  /**
   * Expose `Emitter`.
   */

  {
    module.exports = Emitter;
  }

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on =
  Emitter.prototype.addEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
      .push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function(event, fn){
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off =
  Emitter.prototype.removeListener =
  Emitter.prototype.removeAllListeners =
  Emitter.prototype.removeEventListener = function(event, fn){
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }

    // Remove event specific arrays for event types that no
    // one is subscribed for to avoid memory leak.
    if (callbacks.length === 0) {
      delete this._callbacks['$' + event];
    }

    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function(event){
    this._callbacks = this._callbacks || {};

    var args = new Array(arguments.length - 1)
      , callbacks = this._callbacks['$' + event];

    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function(event){
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function(event){
    return !! this.listeners(event).length;
  };
  });

  var uuid$2 = uuid_1.v4;



  var debug$2 = debug_1$1('localstorage-retry');


  // Some browsers don't support Function.prototype.bind, so just including a simplified version here
  function bind(func, obj) {
    return function() {
      return func.apply(obj, arguments);
    };
  }

  /**
   * @callback processFunc
   * @param {Mixed} item The item added to the queue to process
   * @param {Function} done A function to call when processing is completed.
   *   @param {Error} Optional error parameter if the processing failed
   *   @param {Response} Optional response parameter to emit for async handling
   */

  /**
   * Constructs a Queue backed by localStorage
   *
   * @constructor
   * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
   * @param {processFunc} fn The function to call in order to process an item added to the queue
   */
  function Queue(name, opts, fn) {
    if (typeof opts === 'function') fn = opts;
    this.name = name;
    this.id = uuid$2();
    this.fn = fn;
    this.maxItems = opts.maxItems || Infinity;
    this.maxAttempts = opts.maxAttempts || Infinity;

    this.backoff = {
      MIN_RETRY_DELAY: opts.minRetryDelay || 1000,
      MAX_RETRY_DELAY: opts.maxRetryDelay || 30000,
      FACTOR: opts.backoffFactor || 2,
      JITTER: opts.backoffJitter || 0
    };

    // painstakingly tuned. that's why they're not "easily" configurable
    this.timeouts = {
      ACK_TIMER: 1000,
      RECLAIM_TIMER: 3000,
      RECLAIM_TIMEOUT: 10000,
      RECLAIM_WAIT: 500
    };

    this.keys = {
      IN_PROGRESS: 'inProgress',
      QUEUE: 'queue',
      ACK: 'ack',
      RECLAIM_START: 'reclaimStart',
      RECLAIM_END: 'reclaimEnd'
    };

    this._schedule = new schedule();
    this._processId = 0;

    // Set up our empty queues
    this._store = new store$1(this.name, this.id, this.keys);
    this._store.set(this.keys.IN_PROGRESS, {});
    this._store.set(this.keys.QUEUE, []);

    // bind recurring tasks for ease of use
    this._ack = bind(this._ack, this);
    this._checkReclaim = bind(this._checkReclaim, this);
    this._processHead = bind(this._processHead, this);

    this._running = false;
  }

  /**
   * Mix in event emitter
   */

  componentEmitter(Queue.prototype);

  /**
   * Starts processing the queue
   */
  Queue.prototype.start = function() {
    if (this._running) {
      this.stop();
    }
    this._running = true;
    this._ack();
    this._checkReclaim();
    this._processHead();
  };

  /**
   * Stops processing the queue
   */
  Queue.prototype.stop = function() {
    this._schedule.cancelAll();
    this._running = false;
  };

  /**
   * Decides whether to retry. Overridable.
   *
   * @param {Object} item The item being processed
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @param {Error} error The error from previous attempt, if there was one
   * @return {Boolean} Whether to requeue the message
   */
  Queue.prototype.shouldRetry = function(_, attemptNumber) {
    if (attemptNumber > this.maxAttempts) return false;
    return true;
  };

  /**
   * Calculates the delay (in ms) for a retry attempt
   *
   * @param {Number} attemptNumber The attemptNumber (1 for first retry)
   * @return {Number} The delay in milliseconds to wait before attempting a retry
   */
  Queue.prototype.getDelay = function(attemptNumber) {
    var ms = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, attemptNumber);
    if (this.backoff.JITTER) {
      var rand =  Math.random();
      var deviation = Math.floor(rand * this.backoff.JITTER * ms);
      if (Math.floor(rand * 10) < 5) {
        ms -= deviation;
      } else {
        ms += deviation;
      }
    }
    return Number(Math.min(ms, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
  };

  /**
   * Adds an item to the queue
   *
   * @param {Mixed} item The item to process
   */
  Queue.prototype.addItem = function(item) {
    this._enqueue({
      item: item,
      attemptNumber: 0,
      time: this._schedule.now()
    });
  };

  /**
   * Adds an item to the retry queue
   *
   * @param {Mixed} item The item to retry
   * @param {Number} attemptNumber The attempt number (1 for first retry)
   * @param {Error} [error] The error from previous attempt, if there was one
   */
  Queue.prototype.requeue = function(item, attemptNumber, error) {
    if (this.shouldRetry(item, attemptNumber, error)) {
      this._enqueue({
        item: item,
        attemptNumber: attemptNumber,
        time: this._schedule.now() + this.getDelay(attemptNumber)
      });
    } else {
      this.emit('discard', item, attemptNumber);
    }
  };

  Queue.prototype._enqueue = function(entry) {
    var queue = this._store.get(this.keys.QUEUE) || [];
    queue = queue.slice(-(this.maxItems - 1));
    queue.push(entry);
    queue = queue.sort(function(a,b) {
      return a.time - b.time;
    });

    this._store.set(this.keys.QUEUE, queue);

    if (this._running) {
      this._processHead();
    }
  };

  Queue.prototype._processHead = function() {
    var self = this;
    var store = this._store;

    // cancel the scheduled task if it exists
    this._schedule.cancel(this._processId);

    // Pop the head off the queue
    var queue = store.get(this.keys.QUEUE) || [];
    var inProgress = store.get(this.keys.IN_PROGRESS) || {};
    var now = this._schedule.now();
    var toRun = [];

    function enqueue(el, id) {
      toRun.push({
        item: el.item,
        done: function handle(err, res) {
          var inProgress = store.get(self.keys.IN_PROGRESS) || {};
          delete inProgress[id];
          store.set(self.keys.IN_PROGRESS, inProgress);
          self.emit('processed', err, res, el.item);
          if (err) {
            self.requeue(el.item, el.attemptNumber + 1, err);
          }
        }
      });
    }

    var inProgressSize = Object.keys(inProgress).length;

    while (queue.length && queue[0].time <= now && inProgressSize++ < self.maxItems) {
      var el = queue.shift();
      var id = uuid$2();

      // Save this to the in progress map
      inProgress[id] = {
        item: el.item,
        attemptNumber: el.attemptNumber,
        time: self._schedule.now()
      };

      enqueue(el, id);
    }

    store.set(this.keys.QUEUE, queue);
    store.set(this.keys.IN_PROGRESS, inProgress);

    each_1(function(el) {
      // TODO: handle fn timeout
      try {
        self.fn(el.item, el.done);
      } catch (err) {
        debug$2('Process function threw error: ' + err);
      }
    }, toRun);

    // re-read the queue in case the process function finished immediately or added another item
    queue = store.get(this.keys.QUEUE) || [];
    this._schedule.cancel(this._processId);
    if (queue.length > 0) {
      this._processId = this._schedule.run(this._processHead, queue[0].time - now);
    }
  };

  // Ack continuously to prevent other tabs from claiming our queue
  Queue.prototype._ack = function() {
    this._store.set(this.keys.ACK, this._schedule.now());
    this._store.set(this.keys.RECLAIM_START, null);
    this._store.set(this.keys.RECLAIM_END, null);
    this._schedule.run(this._ack, this.timeouts.ACK_TIMER);
  };

  Queue.prototype._checkReclaim = function() {
    var self = this;

    function tryReclaim(store) {
      store.set(self.keys.RECLAIM_START, self.id);
      store.set(self.keys.ACK, self._schedule.now());

      self._schedule.run(function() {
        if (store.get(self.keys.RECLAIM_START) !== self.id) return;
        store.set(self.keys.RECLAIM_END, self.id);

        self._schedule.run(function() {
          if (store.get(self.keys.RECLAIM_END) !== self.id) return;
          if (store.get(self.keys.RECLAIM_START) !== self.id) return;
          self._reclaim(store.id);
        }, self.timeouts.RECLAIM_WAIT);
      }, self.timeouts.RECLAIM_WAIT);
    }

    function findOtherQueues(name) {
      var res = [];
      var storage = self._store.engine;
      for (var i = 0; i < storage.length; i++) {
        var k = storage.key(i);
        var parts = k.split('.');
        if (parts.length !== 3) continue;
        if (parts[0] !== name) continue;
        if (parts[2] !== 'ack') continue;
        res.push(new store$1(name, parts[1], self.keys));
      }
      return res;
    }

    each_1(function(store) {
      if (store.id === self.id) return;
      if (self._schedule.now() - store.get(self.keys.ACK) < self.timeouts.RECLAIM_TIMEOUT) return;
      tryReclaim(store);
    }, findOtherQueues(this.name));

    this._schedule.run(this._checkReclaim, this.timeouts.RECLAIM_TIMER);
  };

  Queue.prototype._reclaim = function(id) {
    var self = this;
    var other = new store$1(this.name, id, this.keys);

    var our = {
      queue: this._store.get(this.keys.QUEUE) || []
    };

    var their = {
      inProgress: other.get(this.keys.IN_PROGRESS) || {},
      queue: other.get(this.keys.QUEUE) || []
    };

    // add their queue to ours, resetting run-time to immediate and copying the attempt#
    each_1(function(el) {
      our.queue.push({
        item: el.item,
        attemptNumber: el.attemptNumber,
        time: self._schedule.now()
      });
    }, their.queue);

    // if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
    each_1(function(el) {
      our.queue.push({
        item: el.item,
        attemptNumber: el.attemptNumber + 1,
        time: self._schedule.now()
      });
    }, their.inProgress);

    our.queue = our.queue.sort(function(a,b) {
      return a.time - b.time;
    });

    this._store.set(this.keys.QUEUE, our.queue);

    // remove all keys
    other.remove(this.keys.ACK);
    other.remove(this.keys.RECLAIM_START);
    other.remove(this.keys.RECLAIM_END);
    other.remove(this.keys.IN_PROGRESS);
    other.remove(this.keys.QUEUE);

    // process the new items we claimed
    this._processHead();
  };

  var lib$1 = Queue;

  var queueOptions = {
    maxRetryDelay: 360000,
    // max retry interval
    minRetryDelay: 1000,
    // first attempt after 1sec
    backoffFactor: 0
  };
  /**
   *
   * @class EventRepository responsible for adding events into
   * flush queue and sending data to rudder backend
   * in batch and maintains order of the event.
   */

  var EventRepository =
  /*#__PURE__*/
  function () {
    /**
     *Creates an instance of EventRepository.
     * @memberof EventRepository
     */
    function EventRepository() {
      _classCallCheck(this, EventRepository);

      this.eventsBuffer = [];
      this.writeKey = "";
      this.url = BASE_URL;
      this.state = "READY";
      this.batchSize = 0; // previous implementation
      //setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);

      this.payloadQueue = new lib$1("rudder", queueOptions, function (item, done) {
        // apply sentAt at flush time and reset on each retry
        item.message.sentAt = getCurrentTimeFormatted(); //send this item for processing, with a callback to enable queue to get the done status

        eventRepository.processQueueElement(item.url, item.headers, item.message, 10 * 1000, function (err, res) {
          if (err) {
            return done(err);
          }

          done(null, res);
        });
      }); //start queue

      this.payloadQueue.start();
    }
    /**
     *
     *
     * @param {EventRepository} repo
     * @returns
     * @memberof EventRepository
     */


    _createClass(EventRepository, [{
      key: "preaparePayloadAndFlush",
      value: function preaparePayloadAndFlush(repo) {
        //construct payload
        logger.debug("==== in preaparePayloadAndFlush with state: " + repo.state);
        logger.debug(repo.eventsBuffer);

        if (repo.eventsBuffer.length == 0 || repo.state === "PROCESSING") {
          return;
        }

        var eventsPayload = repo.eventsBuffer;
        var payload = new RudderPayload();
        payload.batch = eventsPayload;
        payload.writeKey = repo.writeKey;
        payload.sentAt = getCurrentTimeFormatted(); //add sentAt to individual events as well

        payload.batch.forEach(function (event) {
          event.sentAt = payload.sentAt;
        });
        repo.batchSize = repo.eventsBuffer.length; //server-side integration, XHR is node module

        if (true) {
          var xhr = new XMLHttpRequest();
        } else {
          var xhr;
        }

        logger.debug("==== in flush sending to Rudder BE ====");
        logger.debug(JSON.stringify(payload, replacer));
        xhr.open("POST", repo.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        {
          xhr.setRequestHeader("Authorization", "Basic " + btoa(payload.writeKey + ":"));
        } //register call back to reset event buffer on successfull POST


        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            logger.debug("====== request processed successfully: " + xhr.status);
            repo.eventsBuffer = repo.eventsBuffer.slice(repo.batchSize);
            logger.debug(repo.eventsBuffer.length);
          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            handleError(new Error("request failed with status: " + xhr.status + " for url: " + repo.url));
          }

          repo.state = "READY";
        };

        xhr.send(JSON.stringify(payload, replacer));
        repo.state = "PROCESSING";
      }
      /**
       * the queue item proceesor
       * @param {*} url to send requests to
       * @param {*} headers
       * @param {*} message
       * @param {*} timeout
       * @param {*} queueFn the function to call after request completion
       */

    }, {
      key: "processQueueElement",
      value: function processQueueElement(url, headers, message, timeout, queueFn) {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", url, true);

          for (var k in headers) {
            xhr.setRequestHeader(k, headers[k]);
          }

          xhr.timeout = timeout;
          xhr.ontimeout = queueFn;
          xhr.onerror = queueFn;

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 429 || xhr.status >= 500 && xhr.status < 600) {
                handleError(new Error("request failed with status: " + xhr.status + xhr.statusText + " for url: " + url));
                queueFn(new Error("request failed with status: " + xhr.status + xhr.statusText + " for url: " + url));
              } else {
                logger.debug("====== request processed successfully: " + xhr.status);
                queueFn(null, xhr.status);
              }
            }
          };

          xhr.send(JSON.stringify(message, replacer));
        } catch (error) {
          queueFn(error);
        }
      }
      /**
       *
       *
       * @param {RudderElement} rudderElement
       * @memberof EventRepository
       */

    }, {
      key: "enqueue",
      value: function enqueue(rudderElement, type) {
        var headers = {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(this.writeKey + ":")
        };
        var message = rudderElement.getElementContent();
        message.originalTimestamp = getCurrentTimeFormatted(); //modify the url for event specific endpoints

        var url = this.url.slice(-1) == "/" ? this.url.slice(0, -1) : this.url; // add items to the queue

        this.payloadQueue.addItem({
          url: url + "/v1/" + type,
          headers: headers,
          message: message
        });
      }
    }]);

    return EventRepository;
  }();

  var eventRepository = new EventRepository();

  /**
   * Add the rudderelement object to flush queue
   *
   * @param {RudderElement} rudderElement
   */

  function enqueue(rudderElement, type) {
    if (!this.eventRepository) {
      this.eventRepository = eventRepository;
    }

    this.eventRepository.enqueue(rudderElement, type);
  }
  /**
   * class responsible for handling core
   * event tracking functionalities
   */


  var Analytics =
  /*#__PURE__*/
  function () {
    /**
     * Creates an instance of Analytics.
     * @memberof Analytics
     */
    function Analytics() {
      _classCallCheck(this, Analytics);

      this.initialized = false;
      this.ready = false;
      this.eventsBuffer = [];
      this.clientIntegrations = [];
      this.configArray = [];
      this.clientIntegrationObjects = undefined;
      this.successfullyLoadedIntegration = [];
      this.failedToBeLoadedIntegration = [];
      this.toBeProcessedArray = [];
      this.toBeProcessedByIntegrationArray = [];
      this.storage = new Storage$1();
      this.userId = this.storage.getUserId() != undefined ? this.storage.getUserId() : "";
      this.userTraits = this.storage.getUserTraits() != undefined ? this.storage.getUserTraits() : {};
      this.anonymousId = this.storage.getAnonymousId() ? this.storage.getAnonymousId() : generateUUID();
      this.storage.setUserId(this.userId);
      this.storage.setAnonymousId(this.anonymousId);
      this.eventRepository = eventRepository;
    }
    /**
     * Process the response from control plane and
     * call initialize for integrations
     *
     * @param {*} status
     * @param {*} response
     * @memberof Analytics
     */


    _createClass(Analytics, [{
      key: "processResponse",
      value: function processResponse(status, response) {
        logger.debug("===in process response=== " + status);
        response = JSON.parse(response);
        response.source.destinations.forEach(function (destination, index) {
          logger.debug("Destination " + index + " Enabled? " + destination.enabled + " Type: " + destination.destinationDefinition.name + " Use Native SDK? " + destination.config.useNativeSDK);

          if (destination.enabled) {
            this.clientIntegrations.push(destination.destinationDefinition.name);
            this.configArray.push(destination.config);
          }
        }, this);
        this.init(this.clientIntegrations, this.configArray);
      }
      /**
       * Initialize integrations by addinfg respective scripts
       * keep the instances reference in core
       *
       * @param {*} intgArray
       * @param {*} configArray
       * @returns
       * @memberof Analytics
       */

    }, {
      key: "init",
      value: function init(intgArray, configArray) {
        var _this = this;

        logger.debug("supported intgs ", integrations);
        var i = 0;
        this.clientIntegrationObjects = [];

        if (!intgArray || intgArray.length == 0) {
          this.toBeProcessedByIntegrationArray = [];
          return;
        }

        intgArray.forEach(function (intg) {
          var intgClass = integrations[intg];
          var destConfig = configArray[i];
          var intgInstance = new intgClass(destConfig);
          intgInstance.init();
          logger.debug("initializing destination: ", intg);

          _this.isInitialized(intgInstance).then(_this.replayEvents);
        });
      }
    }, {
      key: "replayEvents",
      value: function replayEvents(object) {
        if (object.successfullyLoadedIntegration.length + object.failedToBeLoadedIntegration.length == object.clientIntegrations.length) {
          object.clientIntegrationObjects = object.successfullyLoadedIntegration; //send the queued events to the fetched integration

          object.toBeProcessedByIntegrationArray.forEach(function (event) {
            var methodName = event[0];
            event.shift();
            var integrationOptions = event[0].message.integrations;

            for (var i = 0; i < object.clientIntegrationObjects.length; i++) {
              if (integrationOptions[object.clientIntegrationObjects[i].name] || integrationOptions[object.clientIntegrationObjects[i].name] == undefined && integrationOptions["All"]) {
                try {
                  var _object$clientIntegra;

                  (_object$clientIntegra = object.clientIntegrationObjects[i])[methodName].apply(_object$clientIntegra, _toConsumableArray(event));
                } catch (error) {
                  handleError(error);
                }
              }
            }
          });
          object.toBeProcessedByIntegrationArray = [];
        }
      }
    }, {
      key: "pause",
      value: function pause(time) {
        return new Promise(function (resolve) {
          setTimeout(resolve, time);
        });
      }
    }, {
      key: "isInitialized",
      value: function isInitialized(instance) {
        var _this2 = this;

        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        return new Promise(function (resolve) {
          if (instance.isLoaded()) {
            _this2.successfullyLoadedIntegration.push(instance);

            return resolve(_this2);
          }

          if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
            logger.debug("====max wait over====");

            _this2.failedToBeLoadedIntegration.push(instance);

            return resolve(_this2);
          }

          _this2.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(function () {
            return _this2.isInitialized(instance, time + INTEGRATION_LOAD_CHECK_INTERVAL).then(resolve);
          });
        });
      }
      /**
       * Process page params and forward to page call
       *
       * @param {*} category
       * @param {*} name
       * @param {*} properties
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "page",
      value: function page(category, name, properties, options, callback) {
        if (typeof options == "function") callback = options, options = null;
        if (typeof properties == "function") callback = properties, options = properties = null;
        if (typeof name == "function") callback = name, options = properties = name = null;
        if (_typeof(category) === "object") options = name, properties = category, name = category = null;
        if (_typeof(name) === "object") options = properties, properties = name, name = null;
        if (typeof category === "string" && typeof name !== "string") name = category, category = null;
        this.processPage(category, name, properties, options, callback);
      }
      /**
       * Process track params and forward to track call
       *
       * @param {*} event
       * @param {*} properties
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "track",
      value: function track(event, properties, options, callback) {
        if (typeof options == "function") callback = options, options = null;
        if (typeof properties == "function") callback = properties, options = null, properties = null;
        this.processTrack(event, properties, options, callback);
      }
      /**
       * Process identify params and forward to indentify  call
       *
       * @param {*} userId
       * @param {*} traits
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "identify",
      value: function identify(userId, traits, options, callback) {
        if (typeof options == "function") callback = options, options = null;
        if (typeof traits == "function") callback = traits, options = null, traits = null;
        if (_typeof(userId) == "object") options = traits, traits = userId, userId = this.userId;
        this.processIdentify(userId, traits, options, callback);
      }
      /**
       * Send page call to Rudder BE and to initialized integrations
       *
       * @param {*} category
       * @param {*} name
       * @param {*} properties
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "processPage",
      value: function processPage(category, name, properties, options, callback) {
        var rudderElement = new RudderElementBuilder().setType("page").build();

        if (name) {
          rudderElement["message"]["name"] = name;
        }

        if (!properties) {
          properties = {};
        }

        if (category) {
          properties["category"] = category;
        }

        if (properties) {
          rudderElement["message"]["properties"] = this.getPageProperties(properties); //properties;
        }

        this.trackPage(rudderElement, options, callback);
      }
      /**
       * Send track call to Rudder BE and to initialized integrations
       *
       * @param {*} event
       * @param {*} properties
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "processTrack",
      value: function processTrack(event, properties, options, callback) {
        var rudderElement = new RudderElementBuilder().setType("track").build();

        if (event) {
          rudderElement.setEventName(event);
        }

        if (properties) {
          rudderElement.setProperty(properties);
        } else {
          rudderElement.setProperty({});
        }

        this.trackEvent(rudderElement, options, callback);
      }
      /**
       * Send identify call to Rudder BE and to initialized integrations
       *
       * @param {*} userId
       * @param {*} traits
       * @param {*} options
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "processIdentify",
      value: function processIdentify(userId, traits, options, callback) {
        if (userId && this.userId && userId !== this.userId) {
          this.reset();
        }

        this.userId = userId;
        this.storage.setUserId(this.userId);
        var rudderElement = new RudderElementBuilder().setType("identify").build();

        if (traits) {
          for (var key in traits) {
            this.userTraits[key] = traits[key];
          }

          this.storage.setUserTraits(this.userTraits);
        }

        this.identifyUser(rudderElement, options, callback);
      }
      /**
       * Identify call supporting rudderelement from builder
       *
       * @param {*} rudderElement
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "identifyUser",
      value: function identifyUser(rudderElement, options, callback) {
        if (rudderElement["message"]["userId"]) {
          this.userId = rudderElement["message"]["userId"];
          this.storage.setUserId(this.userId);
        }

        if (rudderElement && rudderElement["message"] && rudderElement["message"]["context"] && rudderElement["message"]["context"]["traits"]) {
          this.userTraits = Object.assign({}, rudderElement["message"]["context"]["traits"]);
          this.storage.setUserTraits(this.userTraits);
        }

        this.processAndSendDataToDestinations("identify", rudderElement, options, callback);
      }
      /**
       * Page call supporting rudderelement from builder
       *
       * @param {*} rudderElement
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "trackPage",
      value: function trackPage(rudderElement, options, callback) {
        this.processAndSendDataToDestinations("page", rudderElement, options, callback);
      }
      /**
       * Track call supporting rudderelement from builder
       *
       * @param {*} rudderElement
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "trackEvent",
      value: function trackEvent(rudderElement, options, callback) {
        this.processAndSendDataToDestinations("track", rudderElement, options, callback);
      }
      /**
       * Process and send data to destinations along with rudder BE
       *
       * @param {*} type
       * @param {*} rudderElement
       * @param {*} callback
       * @memberof Analytics
       */

    }, {
      key: "processAndSendDataToDestinations",
      value: function processAndSendDataToDestinations(type, rudderElement, options, callback) {
        try {
          if (!this.anonymousId) {
            this.anonymousId = generateUUID();
            this.storage.setAnonymousId(this.anonymousId);
          }

          rudderElement["message"]["context"]["traits"] = Object.assign({}, this.userTraits);
          console.log("anonymousId: ", this.anonymousId);
          rudderElement["message"]["anonymousId"] = this.anonymousId;
          rudderElement["message"]["userId"] = this.userId;

          if (options) {
            this.processOptionsParam(rudderElement, options);
          }

          logger.debug(JSON.stringify(rudderElement));
          var integrations = rudderElement.message.integrations; //try to first send to all integrations, if list populated from BE

          if (this.clientIntegrationObjects) {
            this.clientIntegrationObjects.forEach(function (obj) {
              logger.debug("called in normal flow");

              if (integrations[obj.name] || integrations[obj.name] == undefined && integrations["All"]) {
                obj[type](rudderElement);
              }
            });
          }

          if (!this.clientIntegrationObjects) {
            logger.debug("pushing in replay queue"); //new event processing after analytics initialized  but integrations not fetched from BE

            this.toBeProcessedByIntegrationArray.push([type, rudderElement]);
          } // self analytics process


          enqueue.call(this, rudderElement, type);
          logger.debug(type + " is called ");

          if (callback) {
            callback();
          }
        } catch (error) {
          handleError(error);
        }
      }
      /**
       * process options parameter
       *
       * @param {*} rudderElement
       * @param {*} options
       * @memberof Analytics
       */

    }, {
      key: "processOptionsParam",
      value: function processOptionsParam(rudderElement, options) {
        var toplevelElements = ["integrations", "anonymousId", "originalTimestamp"];

        for (var key in options) {
          if (toplevelElements.includes(key)) {
            rudderElement.message[key] = options[key]; //special handle for ananymousId as transformation expects anonymousId in traits.

            /* if (key === "anonymousId") {
              rudderElement.message.context.traits["anonymousId"] = options[key];
            } */
          } else {
            if (key !== "context") rudderElement.message.context[key] = options[key];else {
              for (var k in options[key]) {
                rudderElement.message.context[k] = options[key][k];
              }
            }
          }
        }
      }
    }, {
      key: "getPageProperties",
      value: function getPageProperties(properties) {
        var defaultPageProperties = getDefaultPageProperties();

        for (var key in defaultPageProperties) {
          if (properties[key] === undefined) {
            properties[key] = defaultPageProperties[key];
          }
        }

        return properties;
      }
      /**
       * Clear user information
       *
       * @memberof Analytics
       */

    }, {
      key: "reset",
      value: function reset() {
        this.userId = "";
        this.userTraits = {};
        this.anonymousId = "";
        this.storage.clear();
      }
      /**
       * Call control pane to get client configs
       *
       * @param {*} writeKey
       * @memberof Analytics
       */

    }, {
      key: "load",
      value: function load(writeKey, serverUrl, options) {
        if (!writeKey || !serverUrl || serverUrl.length == 0) {
          handleError({
            message: "Unable to load due to wrong writeKey or serverUrl"
          });
          throw Error("failed to initialize");
        }

        if (options && options.logLevel) {
          logger.setLogLevel(options.logLevel);
        }

        logger.debug("inside load ");
        this.eventRepository.writeKey = writeKey;

        if (serverUrl) {
          this.eventRepository.url = serverUrl;
        }

        getJSONTrimmed(this, CONFIG_URL, writeKey, this.processResponse);
      }
    }]);

    return Analytics;
  }();

  {
    window.addEventListener("error", function (e) {
      handleError(e);
    }, true);
  }

  var instance = new Analytics();

  {
    var eventsPushedAlready = !!window.rudderanalytics && window.rudderanalytics.push == Array.prototype.push;
    var methodArg = window.rudderanalytics ? window.rudderanalytics[0] : [];

    if (methodArg.length > 0 && methodArg[0] == "load") {
      var method = methodArg[0];
      methodArg.shift();
      instance[method].apply(instance, _toConsumableArray(methodArg));
    }

    if (eventsPushedAlready) {
      for (var i$1 = 1; i$1 < window.rudderanalytics.length; i$1++) {
        instance.toBeProcessedArray.push(window.rudderanalytics[i$1]);
      }

      for (var _i = 0; _i < instance.toBeProcessedArray.length; _i++) {
        var event = _toConsumableArray(instance.toBeProcessedArray[_i]);

        var _method = event[0];
        event.shift();

        instance[_method].apply(instance, _toConsumableArray(event));
      }

      instance.toBeProcessedArray = [];
    }
  }

  var identify = instance.identify.bind(instance);
  var page = instance.page.bind(instance);
  var track = instance.track.bind(instance);
  var reset = instance.reset.bind(instance);
  var load = instance.load.bind(instance);
  var initialized = instance.initialized = true;

  exports.identify = identify;
  exports.initialized = initialized;
  exports.load = load;
  exports.page = page;
  exports.reset = reset;
  exports.track = track;

  return exports;

}({}));

var HSPlugin = (function () {
  'use strict';

  const LOG_LEVEL_INFO = 1;
  const LOG_LEVEL_DEBUG = 2;
  const LOG_LEVEL_WARN = 3;
  const LOG_LEVEL_ERROR = 4;
  let LOG_LEVEL = LOG_LEVEL_ERROR;
  const logger = {
    setLogLevel(logLevel) {
      switch (logLevel.toUpperCase()) {
        case "INFO":
          LOG_LEVEL = LOG_LEVEL_INFO;
          return;

        case "DEBUG":
          LOG_LEVEL = LOG_LEVEL_DEBUG;
          return;

        case "WARN":
          LOG_LEVEL = LOG_LEVEL_WARN;
      }
    },

    info() {
      if (LOG_LEVEL <= LOG_LEVEL_INFO) {
        console.info(...arguments);
      }
    },

    debug() {
      if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
        console.debug(...arguments);
      }
    },

    warn() {
      if (LOG_LEVEL <= LOG_LEVEL_WARN) {
        console.warn(...arguments);
      }
    },

    error() {
      if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
        console.error(...arguments);
      }
    }

  };

  const ScriptLoader = (id, src) => {
    logger.debug(`in script loader=== ${id}`);
    const js = document.createElement("script");
    js.src = src; //js.async = true;

    js.async = false;
    js.type = "text/javascript";
    js.id = id;
    const e = document.getElementsByTagName("script")[0]; //logger.debug("==script==", e);

    e.parentNode.insertBefore(js, e);
  };

  class HubSpot {
    constructor(config) {
      this.hubId = config.hubID; // 6405167

      this.name = "HS";
    }

    init() {
      const hubspotJs = `http://js.hs-scripts.com/${this.hubId}.js`;
      ScriptLoader("hubspot-integration", hubspotJs);
      logger.debug("===in init HS===");
    }

    identify(rudderElement) {
      logger.debug("in HubspotAnalyticsManager identify");
      const {
        traits
      } = rudderElement.message.context;
      const traitsValue = {};

      for (const k in traits) {
        if (!!Object.getOwnPropertyDescriptor(traits, k) && traits[k]) {
          const hubspotkey = k; // k.startsWith("rl_") ? k.substring(3, k.length) : k;

          if (toString.call(traits[k]) == "[object Date]") {
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


      const userProperties = rudderElement.message.context.user_properties;

      for (const k in userProperties) {
        if (!!Object.getOwnPropertyDescriptor(userProperties, k) && userProperties[k]) {
          const hubspotkey = k; // k.startsWith("rl_") ? k.substring(3, k.length) : k;

          traitsValue[hubspotkey] = userProperties[k];
        }
      }

      logger.debug(traitsValue);

      if (typeof window !== undefined) {
        const _hsq = window._hsq = window._hsq || [];

        _hsq.push(["identify", traitsValue]);
      }
    }

    track(rudderElement) {
      logger.debug("in HubspotAnalyticsManager track");

      const _hsq = window._hsq = window._hsq || [];

      const eventValue = {};
      eventValue.id = rudderElement.message.event;

      if (rudderElement.message.properties && (rudderElement.message.properties.revenue || rudderElement.message.properties.value)) {
        eventValue.value = rudderElement.message.properties.revenue || rudderElement.message.properties.value;
      }

      _hsq.push(["trackEvent", eventValue]);
    }

    page(rudderElement) {
      logger.debug("in HubspotAnalyticsManager page");

      const _hsq = window._hsq = window._hsq || []; // logger.debug("path: " + rudderElement.message.properties.path);
      // _hsq.push(["setPath", rudderElement.message.properties.path]);

      /* _hsq.push(["identify",{
          email: "testtrackpage@email.com"
      }]); */


      if (rudderElement.message.properties && rudderElement.message.properties.path) {
        _hsq.push(["setPath", rudderElement.message.properties.path]);
      }

      _hsq.push(["trackPageView"]);
    }

    isLoaded() {
      logger.debug("in hubspot isLoaded");
      return !!(window._hsq && window._hsq.push !== Array.prototype.push);
    }

    isReady() {
      return !!(window._hsq && window._hsq.push !== Array.prototype.push);
    }

  }

  var index =  HubSpot ;

  return index;

}());

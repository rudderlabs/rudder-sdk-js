/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";

class Posthog {
  constructor(config, analytics) {
    this.name = "POSTHOG";
    this.analytics = analytics;
    this.teamApiKey = config.teamApiKey;
    this.yourInstance = config.yourInstance || "https://app.posthog.com";
    this.autocapture = config.autocapture;
    this.capturePageView = config.capturePageView;
    this.disableSessionRecording = config.disableSessionRecording;
    this.propertyBlackList = [];
    this.xhrHeaders = {};
    this.superProperties = {};

    if (config.superProperties && config.superProperties.length > 0) {
      config.superProperties.forEach(property => {
        if(property && property.key && property.value && property.key.trim() != "" && property.value.trim() != ""){
          this.superProperties[property.key] = property.value;
        }
      });
    }
    if (config.xhrHeaders && config.xhrHeaders.length > 0) {
      config.xhrHeaders.forEach(header => {
        if(header && header.key && header.value && header.key.trim() != "" && header.value.trim() != ""){
          this.xhrHeaders[header.key] = header.value;
        }
      });
    }
    if (config.propertyBlackList && config.propertyBlackList.length > 0) {
      config.propertyBlackList.forEach(element => {
        if(element && element.property && element.property.trim() != ""){
          this.propertyBlackList.push(element.property);
        }
      });
    }
  }

  init() {
    ! function (t, e) {
      var o, n, p, r;
      e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split(".");
          2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }(p = t.createElement("script")).type = "text/javascript", p.async = !0, p.src = s.api_host + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
        var u = e;
        for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) {
            var e = "posthog";
            return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
          }, u.people.toString = function () {
            return u.toString(1) + ".people (stub)"
          }, o = "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "), n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a])
      }, e.__SV = 1)
    }(document, window.posthog || []);

    const configObject = {api_host: this.yourInstance,
      autocapture: this.autocapture,
      capture_pageview: this.capturePageView,
      disable_session_recording: this.disableSessionRecording,
      property_blacklist: this.propertyBlackList
    };
    if(this.xhrHeaders && Object.keys(this.xhrHeaders).length > 0){
      configObject.xhr_headers = {};//this.xhrHeaders;
    }


    posthog.init(this.teamApiKey, configObject);
    if(this.superProperties && Object.keys(this.superProperties).length > 0){
      posthog.register(this.superProperties);
    }
  }

  identify(rudderElement) {
    logger.debug("in Posthog identify");

    // rudderElement.message.context will always be present as part of identify event payload.
    const { traits } = rudderElement.message.context;
    const { userId } = rudderElement.message;

    if (userId) {
      window.posthog.identify(userId);
    }

    if (traits) {
      window.posthog.people.set(traits);
    }
  }

  track(rudderElement) {
    logger.debug("in Posthog track");

    const { event, properties } = rudderElement.message;

    window.posthog.capture(event, properties);
  }

  /**
   * 
   *
   * @memberof Posthog
   */
  page(rudderElement) {
    logger.debug("in Posthog page");

    window.posthog.capture('$pageview');
  }

  isLoaded() {
    logger.debug("in Posthog isLoaded");
    return !!(window.posthog && window.posthog.__loaded);
  }

  isReady() {
    return !!(window.posthog && window.posthog.__loaded);
  }
}

export default Posthog;

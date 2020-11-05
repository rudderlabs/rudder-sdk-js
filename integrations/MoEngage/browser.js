import logger from "../../utils/logUtil";

class MoEngage {
  constructor(config) {
    this.apiId = config.apiId;
    this.debug = config.debug;
    this.region = config.region;
    this.name = "MoEngage";
  }

  init() {
    var self = this;
    logger.debug("===in init MoEnagage===");
    (function (i, s, o, g, r, a, m, n) {
      i.moengage_object = r;
      var t = {};
      var q = function (f) {
        return function () {
          (i.moengage_q = i.moengage_q || []).push({ f: f, a: arguments });
        };
      };
      var f = [
        "track_event",
        "add_user_attribute",
        "add_first_name",
        "add_last_name",
        "add_email",
        "add_mobile",
        "add_user_name",
        "add_gender",
        "add_birthday",
        "destroy_session",
        "add_unique_user_id",
        "moe_events",
        "call_web_push",
        "track",
        "location_type_attribute",
      ];
      var h = { onsite: ["getData", "registerCallback"] };
      for (var k in f) {
        t[f[k]] = q(f[k]);
      }
      for (var k in h)
        for (var l in h[k]) {
          null == t[k] && (t[k] = {}), (t[k][h[k][l]] = q(k + "." + h[k][l]));
        }
      a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
      i.moe =
        i.moe ||
        function () {
          n = arguments[0];
          return t;
        };
      a.onload = function () {
        if (n) {
          i[r] = moe(n);
        }
      };
    })(
      window,
      document,
      "script",
      "https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js",
      "Moengage"
    );

    if (this.region !== "US") {
      self.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
        cluster: this.region === "EU" ? "eu" : "in",
      });
    } else {
      self.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
      });
    }
    this.initialAnonId = window.rudderanalytics.getAnonymousId();
  }

  isLoaded = () => {
    logger.debug("in MoEngage isLoaded");
    return !!window.moeBannerText;
  };

  isReady = () => {
    logger.debug("in MoEngage isReady");
    return !!window.moeBannerText;
  };

  track(rudderElement) {
    logger.debug("inside track");
    logger.debug(rudderElement.message.anonymousId);
    if (this.initialAnonId !== rudderElement.message.anonymousId) {
      this.reset();
    }
    this.moeClient.track_event(
      rudderElement.message.event,
      rudderElement.message.properties
    );
  }

  reset() {
    logger.debug("inside reset");
    this.initialAnonId = window.rudderanalytics.getAnonymousId();
    this.moeClient.destroy_session();
  }
}

export default MoEngage;

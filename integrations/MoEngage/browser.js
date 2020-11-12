import each from "@ndhoule/each";
import logger from "../../utils/logUtil";

// custom traits mapping context.traits --> moengage properties
const traitsMap = {
  firstName: "first_name",
  lastName: "last_name",
  firstname: "first_name",
  lastname: "last_name",
  email: "email",
  phone: "mobile",
  name: "user_name",
  username: "user_name",
  userName: "user_name",
  gender: "gender",
  birthday: "birthday",
  id: null,
};
class MoEngage {
  constructor(config, analyticsinstance) {
    this.apiId = config.apiId;
    this.debug = config.debug;
    this.region = config.region;
    this.name = "MoEngage";
    this.analyticsinstance = analyticsinstance;
  }

  init() {
    const self = this;
    logger.debug("===in init MoEnagage===");
    // loading the script for moengage web sdk
    /* eslint-disable */
    (function (i, s, o, g, r, a, m, n) {
      i.moengage_object = r;
      var t = {};
      var q = function (f) {
        return function () {
          (i.moengage_q = i.moengage_q || []).push({ f, a: arguments });
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
      document.location.protocol === "https:"
        ? "https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js"
        : "http://cdn.moengage.com/webpush/moe_webSdk.min.latest.js",
      "Moengage"
    );
    /* eslint-enable */

    // setting the region if us then not needed.
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
    this.initialUserId = this.analyticsinstance.userId;
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
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error("Payload not correct");
      return;
    }
    const { event, properties, userId } = rudderElement.message;
    if (userId) {
      if (this.initialUserId !== userId) {
        this.reset();
      }
    }
    // track event : https://docs.moengage.com/docs/tracking-events
    if (!event) {
      logger.error("Event name not present");
      return;
    }
    if (properties) {
      this.moeClient.track_event(event, properties);
    } else {
      this.moeClient.track_event(event);
    }
  }

  reset() {
    logger.debug("inside reset");
    // reset the user id
    this.initialUserId = this.analyticsinstance.userId;
    this.moeClient.destroy_session();
  }

  identify(rudderElement) {
    const self = this;
    const { userId } = rudderElement.message;
    let traits = null;
    if (rudderElement.message.context) {
      traits = rudderElement.message.context.traits;
    }
    // check if user id is same or not
    if (this.initialUserId !== userId) {
      this.reset();
    }
    // if user is present map
    if (userId) {
      this.moeClient.add_unique_user_id(userId);
    }

    // track user attributes : https://docs.moengage.com/docs/tracking-web-user-attributes
    if (traits) {
      each(function add(value, key) {
        // check if name is present
        if (key === "name") {
          self.moeClient.add_user_name(value);
        }
        if (Object.prototype.hasOwnProperty.call(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          self.moeClient[method](value);
        } else {
          self.moeClient.add_user_attribute(key, value);
        }
      }, traits);
    }
  }
}

export default MoEngage;

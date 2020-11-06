/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable yoda */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-rest-params */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import each from "@ndhoule/each";
import logger from "../../utils/logUtil";

class MoEngage {
  constructor(config) {
    this.apiId = config.apiId;
    this.debug = config.debug;
    this.region = config.region;
    this.name = "MoEngage";
  }

  init() {
    const self = this;
    logger.debug("===in init MoEnagage===");
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
    // Check if the anonymous id is same as previous session if not a new session will start
    if (rudderElement.message) {
      const { anonymousId, event, properties } = rudderElement.message;
      if (anonymousId) {
        if (this.initialAnonId !== anonymousId) {
          this.reset();
        }
      }
      if (event) {
        if (properties) {
          this.moeClient.track_event(event, properties);
        } else {
          this.moeClient.track_event(event);
        }
      } else {
        logger.error("Event name not present");
      }
    } else {
      logger.error("Payload not correct");
    }
  }

  reset() {
    logger.debug("inside reset");
    // reset the anonymous id
    this.initialAnonId = window.rudderanalytics.getAnonymousId();
    this.moeClient.destroy_session();
  }

  identify(rudderElement) {
    const self = this;
    const { anonymousId, userId } = rudderElement.message;
    const { traits } = rudderElement.message.context;
    // check if anonymous id is same or not
    if (this.initialAnonId !== anonymousId) {
      this.reset();
    }
    // if user is present map
    if (userId) {
      this.moeClient.add_unique_user_id(userId);
    }
    // custom traits mapping context.traits --> moengage properties
    const traitsMap = {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "mobile",
      name: "user_name",
      username: "user_name",
      gender: "gender",
      birthday: "birthday",
      id: null,
    };
    if (traits) {
      each(function name(value, key) {
        // check if name is present
        if (key === "name") {
          self.moeClient.add_user_name(value);
        }

        // if any of the custom properties are present it will be sent
        // For example : email is present in username then the method will be add_user_name

        if (Object.prototype.hasOwnProperty.call(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          self.moeClient[method](value);
        }
      }, traits);

      // remove the custom properties from triats

      each(function remove(value, key) {
        if (Object.prototype.hasOwnProperty.call(traits, key))
          delete traits[key];
      }, traitsMap);

      // send the remaining properties

      each(function add(value, key) {
        self.moeClient.add_user_attribute(key, value);
      }, traits);
    }
  }
}

export default MoEngage;

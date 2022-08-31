/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */

import get from "get-value";
import logger from "../../utils/logUtil";
import { SentryScriptLoader, sentryInit } from "./utils";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";
import { getDefinedTraits, isObject } from "../../utils/utils";
import { NAME } from "./constants";

class Sentry {
  constructor(config) {
    this.name = NAME;
    this.dsn = config.dsn;
    this.debugMode = config.debugMode;
    this.environment = config.environment;
    this.ignoreErrors = config.ignoreErrors;
    this.includePathsArray = config.includePaths;
    this.logger = config.logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.customVersionProperty = config.customVersionProperty;
    this.serverName = config.serverName;
  }

  init() {
    logger.debug("===in init Livechat===");
    window.__lc = window.__lc || {};
    window.__lc.license = 14469765;
    (function (n, t, c) {
      function i(n) {
        return e._h ? e._h.apply(null, n) : e._q.push(n);
      }
      var e = {
        _q: [],
        _h: null,
        _v: "2.0",
        on: function () {
          i(["on", c.call(arguments)]);
        },
        once: function () {
          i(["once", c.call(arguments)]);
        },
        off: function () {
          i(["off", c.call(arguments)]);
        },
        get: function () {
          if (!e._h)
            throw new Error(
              "[LiveChatWidget] You can't use getters before load."
            );
          return i(["get", c.call(arguments)]);
        },
        call: function () {
          i(["call", c.call(arguments)]);
        },
        init: function () {
          var n = t.createElement("script");
          (n.async = !0),
            (n.type = "text/javascript"),
            (n.src = "https://cdn.livechatinc.com/tracking.js"),
            t.head.appendChild(n);
        },
      };
      !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
    })(window, document, [].slice);
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug("===in Sentry isLoaded===");
    // return !!(
    //   window.Sentry &&
    //   isObject(window.Sentry) &&
    //   window.Sentry.setUser &&
    //   window.Sentry.Integrations.RewriteFrames
    // );
    if (window.LiveChatWidget) {
      logger.debug("LiveChatWidget Downloaded");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("===in Sentry isReady===");
    // if (
    //   window.Sentry &&
    //   isObject(window.Sentry) &&
    //   window.Sentry.setUser &&
    //   window.Sentry.Integrations.RewriteFrames
    // ) {
    //   const sentryConfig = sentryInit(
    //     this.allowUrls,
    //     this.denyUrls,
    //     this.ignoreErrors,
    //     this.includePathsArray,
    //     this.customVersionProperty,
    //     this.release,
    //     this.dsn,
    //     this.debugMode,
    //     this.environment,
    //     this.serverName
    //   );
    //   window.Sentry.init(sentryConfig);
    //   if (this.logger) {
    //     window.Sentry.setTag("logger", this.logger);
    //   }
    //   return true;
    // }
    // return false;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context;
    const { email, name } = getDefinedTraits(message); // userId sent as id and username sent as name
    const userId = get(message, "userId");
    const ipAddress = get(message, "context.traits.ip_address");

    if (!userId && !email && !name && !ipAddress) {
      // if no user identification property is present the event will be dropped
      logger.debug(
        "===[Sentry]: Any one of userId, email, name and ip_address is mandatory==="
      );
      return;
    }

    const payload = {
      id: userId,
      email: email,
      username: name,
      ip_address: ipAddress,
      ...traits,
    };

    window.Sentry.setUser(removeUndefinedAndNullValues(payload));
  }
}
export default Sentry;

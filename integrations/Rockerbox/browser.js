/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";

/* <script_element>.dataset.loader = LOAD_ORIGIN; */
import ScriptLoader from "../ScriptLoader";

class Rockerbox {
  constructor(config) {
    this.clientAuthId = config.clientAuthId;
    this.name = NAME;
    // TODO: add to config customDomain and enableCookieSync
    this.customDomain = config.customDomain;
    this.enableCookieSync = config.enableCookieSync;
  }

  init() {
    logger.debug("=== In init Rockerbox ===");
    window.RB = {};
    (function (d, RB) {
      if (!window.RB) {
        window.RB = RB;
        RB.queue = RB.queue || [];
        RB.track =
          RB.track ||
          function () {
            RB.queue.push(Array.prototype.slice.call(arguments));
          };
        RB.initialize = function (s) {
          RB.source = s;
        };
        var a = d.createElement("script");
        const host = this.customDomain ? this.customDomain : "getrockerbox.com";
        const library =
          this.customDomain && this.enableCookieSync ? "wxyz.rb" : "wxyz.v2";
        a.type = "text/javascript";
        a.async = !0;
        a.src = `https://${host}/assets/${library}.js`;
        f = d.getElementsByTagName("script")[0];
        f.parentNode.insertBefore(a, f);
      }
    })(document, window.RB || {});
    window.RB.disablePushState = true;
    window.RB.queue = [];
    window.RB.initialize(this.clientAuthId);
  }

  isLoaded() {
    logger.debug("===In isLoaded Rockerbox===");
    return !!window.RB && !!window.RB.loaded;
  }

  isReady() {
    logger.debug("===In isReady Rockerbox===");
  }

  identify(rudderElement) {
    logger.debug("===In Rockerbox Identify===");
    const { userId, email, phone } = rudderElement.message;
    window.RB.track("identify", {
      external_id: userId,
      email,
      phone_number: phone,
    });
  }
}

export default Rockerbox;

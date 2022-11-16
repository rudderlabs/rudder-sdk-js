/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";

class Satismeter {
  constructor(config, analytics) {
    logger.debug("in satismetwr const");
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.writeKey = config.writeKey;
  }

  init() {
    logger.debug("===In init Satismeter===");
    (function () {
      var script = document.createElement("script");
      var parent = document.getElementsByTagName("script")[0].parentNode;
      window.satismeter =
        window.satismeter ||
        function () {
          (window.satismeter.q = window.satismeter.q || []).push(arguments);
        };
      window.satismeter.l = 1 * new Date();
      script.async = 1;
      script.src = "https://app.satismeter.com/js";
      script.setAttribute("data-loader", LOAD_ORIGIN);
      parent.appendChild(script);
    })();
    window.satismeter({
      writeKey: this.writeKey,
    });
  }

  isLoaded() {
    logger.debug("===In isLoaded Satismeter===");
    return !!window.satismeter;
  }

  isReady() {
    logger.debug("===In isReady Satismeter===");
    return !!window.satismeter;
  }

  identify(rudderElement) {
    logger.debug("===In Satismeter identify===");
    const { message } = rudderElement;
    const { traits } = message.context;
    const userId = message.userId || traits?.userId;
    if (!userId) {
      logger.error("[Satismeter]:: userId is not found for Identify Call");
    }
    if (!traits?.createdAt) {
      window.satismeter({
        writeKey: this.writeKey,
        userId,
        type: "identify",
        traits: { ...traits, createdAt: message.sentAt },
      });
    }
    window.satismeter({
      writeKey: this.writeKey,
      userId,
      type: "identify",
      traits,
    });
  }

  track(rudderElement) {
    logger.debug("===In Satismeter track===");
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error("[Satismeter]:: event is required for track call");
    }
    window.satismeter("track", { event });
  }
}

export default Satismeter;

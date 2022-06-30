/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import logger from "../../utils/logUtil";

class Vero {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init Vero===");
    window._veroq = window._veroq || [];
    (function () {
      var ve = document.createElement("script");
      ve.type = "text/javascript";
      ve.async = true;
      ve.src = "https://d3qxef4rp70elm.cloudfront.net/m.js";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(ve, s);
    })();
    window._veroq.push(["init", { api_key: this.apiKey }]);
  }

  isLoaded() {
    logger.debug("in Vero isLoaded");
    return !!window._veroq;
  }

  isReady() {
    logger.debug("in Vero isReady");
    return !!window._veroq && !!window._veroq.ready;
  }

  identify(rudderElement) {
    const message = { rudderElement };
    const userId = message.userId || message.anonymousId;
    const { traits } = message.context || message;
    // userId OR email address are required by Vero's API. When userId isn't present,
    // email will be used as the userId.
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");
    if (!userId && !email) {
      logger.error("[Vero]: User parameter userId or email is required.");
      return;
    }
    window._veroq.push([userId, { traits }]);
  }

  track(rudderElement) {
    logger.debug("===In Vero track===");

    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error("[Vero]: Event name from track call is missing!!===");
      return;
    }
    window._veroq.push(["userId", { properties }]);
  }

  alias(rudderElement) {
    const { message } = rudderElement;
    const { event } = message;
    const userId = message.userId;
    const previousId = message.previousId;
  }
}

export default Vero;

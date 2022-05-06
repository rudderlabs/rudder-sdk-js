/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";

import { getHashFromArray } from "../utils/commonUtils";

import { NAME } from "./constants";
import ScriptLoader from "../ScriptLoader";

class Adroll {
  constructor(config) {
    this.advId = config.advId;
    this.pixId = config.pixId;
    this.name = NAME;
    window.adroll_adv_id = this.advId;
    window.adroll_pix_id = this.pixId;
    this.events = config.eventsMap || [];
  }

  init() {
    logger.debug("===In init Adroll===");
    ScriptLoader(
      "adroll roundtrip",
      `https://s.adroll.com/j/${this.advId}/roundtrip.js`
    );
  }

  isLoaded() {
    logger.debug("===In isLoaded Adroll===");
    return !!window.__adroll;
  }

  isReady() {
    logger.debug("===In isReady Adroll===");
    return !!window.__adroll;
  }

  identify(rudderElement) {
    logger.debug("===In Adroll Identify===");
    const { message } = rudderElement;
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");

    if (!email) {
      logger.error("User parameter (email) is required for identify call");
      return;
    }
    window._adroll_email =
      get(message, "context.traits.email") || get(message, "traits.email");
    window.__adroll.record_adroll_email("segment");
  }

  track(rudderElement) {
    const { userId, event } = rudderElement.message;
    const { properties } = rudderElement.message;
    properties.adroll_conversion_value = get(
      rudderElement.message.properties,
      "revenue"
    );
    if (userId) {
      properties.user_id = userId;
    }
    if (properties.price) {
      properties.adroll_conversion_value = properties.price;
      delete properties.price;
    }
    if (properties.productId) {
      properties.product_id = properties.productId;
      delete properties.productId;
    }

    const eventsHashmap = getHashFromArray(this.events);
    if (eventsHashmap[event.toLowerCase()]) {
      const segmentId = eventsHashmap[event.toLowerCase()];
      properties.adroll_segments = segmentId;
      window.__adroll.record_user(properties);
    } else {
      logger.error(
        `The event ${event} is not mapped to any segmentId. Aborting!`
      );
    }
  }
}

export default Adroll;

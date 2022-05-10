/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";

import { getHashFromArray } from "../utils/commonUtils";

import { NAME } from "./constants";
import ScriptLoader from "../ScriptLoader";
import { productEvent, orderEvent } from "./util";

class Adroll {
  constructor(config) {
    this.advId = config.advId;
    this.pixId = config.pixId;
    this.name = NAME;
    window.adroll_adv_id = this.advId;
    window.adroll_pix_id = this.pixId;
    this.eventsMap = config.eventsMap || [];
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
    window._adroll_email = email;
    window.__adroll.record_adroll_email("segment");
  }
  // record_adroll_email is used to attach a image pixel to the page connected to the user identified

  track(rudderElement) {
    const PRODUCT_EVENTS = [
      "product clicked",
      "product viewed",
      "product added",
    ];
    const ORDER_EVENTS = [
      "cart viewed",
      "checkout started",
      "order completed",
      "order cancelled",
      "order updated",
    ];
    const { message } = rudderElement;
    const { userId, event, properties } = message;
    const eventsHashmap = getHashFromArray(this.eventsMap);
    let data;
    if (eventsHashmap[event.toLowerCase()]) {
      if (PRODUCT_EVENTS.indexOf(event.toLowerCase()) !== -1) {
        if (userId) {
          properties.user_id = userId;
        }
        data = productEvent(properties);
      } else if (ORDER_EVENTS.indexOf(event.toLowerCase()) !== -1) {
        if (userId) {
          properties.user_id = userId;
        }
        data = orderEvent(properties);
      } else {
        if (userId) {
          properties.user_id = userId;
        }
        if (properties.revenue) {
          properties.adroll_conversion_value = properties.revenue;
          delete properties.revenue;
        }
        const segmentId = eventsHashmap[event.toLowerCase()];
        properties.adroll_segments = segmentId;
        data = properties;
      }
      const segmentId = eventsHashmap[event.toLowerCase()];
      data.adroll_segments = segmentId;
      window.__adroll.record_user(data);
    } else {
      logger.error(
        `The event ${message.event} is not mapped to any segmentId. Aborting!`
      );
    }
  }
  // record_user fires the correct pixel in accordance with the event configured in the dashboard
  // and the segment associated in adroll

  page(rudderElement) {
    logger.debug("=== In Adroll Page ===");
    const { message } = rudderElement;

    message.event = `Viewed ${message.name} ${message.category} Page`;
    this.track(rudderElement);
  }
}

export default Adroll;

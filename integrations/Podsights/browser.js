/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import sha256 from "crypto-js/sha256";
import {
  ADD_TO_CART_EVENT,
  CHECK_OUT_EVENT,
  LEAD_EVENT,
  NAME,
  PRODUCT_EVENT,
  PURCHASE_EVENT,
} from "./constants";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";
import {
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";
import { constructPayload } from "../../utils/utils";

class Podsights {
  constructor(config, analytics) {
    this.pixelId = config.pixelId;
    this.eventsToPodsightsEvents = config.eventsToPodsightsEvents;
    this.enableAliasCall = config.enableAliasCall;
    this.name = NAME;
    if (analytics.logLevel) logger.setLogLevel(analytics.logLevel);
  }

  init() {
    logger.debug("===In init Podsights===");
    window.pdst =
      window.pdst ||
      function () {
        (window.pdst.q = window.pdst.q || []).push(arguments);
      };
    ScriptLoader("pdst-capture", "https://cdn.pdst.fm/ping.min.js");
    window.pdst("conf", { key: `${this.pixelId}` });
  }

  isLoaded() {
    logger.debug("===In isLoaded Podsights===");
    return !!(window.pdst && typeof window.pdst === "function");
  }

  isReady() {
    logger.debug("===In isReady Podsights===");
    return !!(window.pdst && typeof window.pdst === "function");
  }

  /**
   * Track - tracks an event for an user
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug("===In Podsights Track===");
    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error("[Podsights]: event name from track call is missing.");
      return;
    }

    const eventsMapping = getHashFromArrayWithDuplicate(
      this.eventsToPodsightsEvents,
      "from",
      "to",
      false
    );
    const trimmedEvent = event.trim();
    const events = eventsMapping[trimmedEvent] || [];
    if (events.length === 0) {
      logger.error(`===No Podsights Pixel mapped event found. Aborting!===`);
      return;
    }
    const externalId =
      get(message, "userId") ||
      get(message, "context.traits.userId") ||
      get(message, "context.traits.id") ||
      get(message, "anonymousId");
    let payload;
    events.forEach((podsightEvent) => {
      switch (podsightEvent) {
        case "lead":
          payload = constructPayload(properties, LEAD_EVENT);
          window.pdst(podsightEvent, payload);
          break;
        case "purchase":
          payload = constructPayload(properties, PURCHASE_EVENT);
          window.pdst(podsightEvent, payload);
          break;
        case "product":
          payload = constructPayload(properties, PRODUCT_EVENT);
          window.pdst(podsightEvent, payload);
          break;
        case "addtocart":
          payload = constructPayload(properties, ADD_TO_CART_EVENT);
          window.pdst(podsightEvent, payload);
          break;
        case "checkout":
          payload = constructPayload(properties, CHECK_OUT_EVENT);
          window.pdst(podsightEvent, payload);
          break;
        default:
          logger.error(
            `event name ${podsightEvent} not supported. Aborting!===`
          );
          break;
      }

      if (podsightEvent === "lead") {
        payload = constructPayload(properties, LEAD_EVENT);
        window.pdst(podsightEvent, { category: trimmedEvent, ...properties });
      } else {
        window.pdst(podsightEvent, properties);
      }
      if (this.enableAliasCall && externalId) {
        window.pdst("alias", {
          id: sha256(externalId).toString(),
        });
      }
    });
  }

  /**
   * Page.
   * for supporting path of Page
   * @param {Page} page
   */
  page(rudderElement) {
    const { properties } = rudderElement.message;
    logger.debug("===In Podsights Page===");
    const { page } = rudderElement.message.context;
    let payload = properties;
    if (page) {
      payload = {
        url: page.url,
        referrer: page.referrer,
        ...payload,
      };
    }
    payload = removeUndefinedAndNullValues(payload);
    window.pdst("view", payload);
  }
}

export default Podsights;

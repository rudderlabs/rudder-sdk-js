/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";
import { getHashFromArrayWithDuplicate } from "../utils/commonUtils";

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
    if (this.enableAliasCall && event.trim().toLowerCase() === "alias") {
      const externalId =
        get(message, "userId") ||
        get(message, "context.traits.userId") ||
        get(message, "context.traits.id") ||
        get(message, "anonymousId");
      window.pdst("alias", {
        id: externalId,
      });
      return;
    }

    const eventsMapping = getHashFromArrayWithDuplicate(
      this.eventsToPodsightsEvents
    );
    const trimmedEvent = event.toLowerCase().trim();
    const events = eventsMapping[trimmedEvent] || [];
    if (events.length === 0) {
      logger.error(`===No Podsights Pixel mapped event found. Aborting!===`);
      return;
    }
    events.forEach((podsightEvent) => {
      window.pdst(podsightEvent, properties);
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
    window.pdst("view", properties);
  }
}

export default Podsights;

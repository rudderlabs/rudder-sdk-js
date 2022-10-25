/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import { getHashFromArrayWithDuplicate } from "../utils/commonUtils";

class Podsights {
  constructor(config) {
    this.pixelId = config.pixelId;
    this.eventsToPodsightsEvents = config.eventsToPodsightsEvents;
    this.name = NAME;
  }

  loadScript(pixelId) {
    (function (w, d) {
      var id = "pdst-capture",
        n = "script";
      if (!d.getElementById(id)) {
        w.pdst =
          w.pdst ||
          function () {
            (w.pdst.q = w.pdst.q || []).push(arguments);
          };
        var e = d.createElement(n);
        e.id = id;
        e.async = 1;
        e.src = "https://cdn.pdst.fm/ping.min.js";
        var s = d.getElementsByTagName(n)[0];
        s.parentNode.insertBefore(e, s);
      }
      window.pdst("conf", { key: `${pixelId}` });
    })(window, document);
  }

  init() {
    logger.debug("===In init Podsights===");
    this.loadScript(this.pixelId);
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
   * Track - tracks an event for a specific user
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
    window.pdst("view", {
      url: window.location.href,
      referrer: window.document.referrer,
      ...properties,
    });
  }
}

export default Podsights;

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
// import get from "get-value";
import logger from "../../utils/logUtil";

// import { getHashFromArray } from "../utils/commonUtils";

import { NAME } from "./constants";
// import ScriptLoader from "../ScriptLoader";
import { ecom } from "./util";

class Matomo {
  constructor(config) {
    // this.advId = config.advId;
    this.serverUrl = config.serverUrl;
    this.siteId = config.siteId;
    this.name = NAME;
    this.trackAllContentImpressions = config.trackAllContentImpressions;
    this.ecomEvents = {
      SET_ECOMMERCE_VIEW: "SET_ECOMMERCE_VIEW",
      ADD_ECOMMERCE_ITEM: "ADD_ECOMMERCE_ITEM",
      REMOVE_ECOMMERCE_ITEM: "REMOVE_ECOMMERCE_ITEM",
      TRACK_ECOMMERCE_ORDER: "TRACK_ECOMMERCE_ORDER",
    };
    // window.adroll_adv_id = this.advId;
    // window.adroll_pix_id = this.pixId;
    // this.eventsMap = config.eventsMap || [];
  }

  loadScript() {
    const _paq = (window._paq = window._paq || []);
    (function (serverUrl, siteId) {
      var u = serverUrl;
      window._paq.push(["setTrackerUrl", u + "matomo.php"]);
      window._paq.push(["setSiteId", siteId]);
      var d = document;
      var g = d.createElement("script");
      var s = d.getElementsByTagName("script")[0];
      g.async = true;
      u = u.replace("https://", "");
      g.src = `//cdn.matomo.cloud/${u}matomo.js`;
      s.parentNode.insertBefore(g, s);
    })(this.serverUrl, this.siteId);
  }

  init() {
    logger.debug("===In init Matomo===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded Matomo===");
    return !!(window._paq && window._paq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===In isReady Matomo===");
    if (!!(window._paq && window._paq.push !== Array.prototype.push)) {
      if (this.trackAllContentImpressions) {
        window._paq.push(["trackAllContentImpressions"]);
      }
    }
    return false;
  }

  identify(rudderElement) {
    logger.debug("===In Matomo Identify===");
    const { anonymousId, userId } = rudderElement.message;
    const matomoUserId = userId || anonymousId;
    if (!matomoUserId) {
      logger.error(
        "User parameter (anonymousId or userId) is required for identify call"
      );
      return;
    }
    window._paq.push(["setUserId", matomoUserId]);
  }
  // record_adroll_email is used to attach a image pixel to the page connected to the user identified

  track(rudderElement) {
    logger.debug("===In Matomo track===");

    const { message } = rudderElement;
    const { event, properties } = message;
    window._paq.op;
    if (!event) {
      logger.error("Event name not present");
      return;
    }

    try {
      switch (event.toLowerCase().trim()) {
        case "product viewed":
          ecom(this.ecomEvents.SET_ECOMMERCE_VIEW, message);
          break;
        case "product added":
          ecom(this.ecomEvents.ADD_ECOMMERCE_ITEM, message);
          break;
        case "product removed":
          ecom(this.ecomEvents.REMOVE_ECOMMERCE_ITEM, message);
          break;
        case "order completed":
          ecom(this.ecomEvents.TRACK_ECOMMERCE_ORDER, message);
          break;

        default:
          ecom("trackEvent", message);
          break;
      }
    } catch (err) {
      logger.error("[Matomo] track failed with following error", err);
    }
  }
  // record_user fires the correct pixel in accordance with the event configured in the dashboard
  // and the segment associated in adroll

  page(rudderElement) {
    logger.debug("=== In Matomo Page ===");
    window._paq.push(["trackPageView"]);
  }
}

export default Matomo;

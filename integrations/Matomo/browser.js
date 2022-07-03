/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
// Research Spec: https://www.notion.so/rudderstacks/Matomo-c5a76c7838b94190a3374887b94a176e

import logger from "../../utils/logUtil";

import { NAME } from "./constants";
import {
  goalIdMapping,
  ecommerceEventsMapping,
  standardEventsMapping,
  checkCustomDimensions,
} from "./util";
import { getHashFromArray } from "../utils/commonUtils";

class Matomo {
  constructor(config) {
    this.serverUrl = config.serverUrl;
    this.siteId = config.siteId;
    this.eventsMapToGoalId = config.eventsMapToGoalId;
    this.eventsToStandard = config.eventsToStandard;
    this.name = NAME;
    this.trackAllContentImpressions = config.trackAllContentImpressions;
    this.trackVisibleContentImpressions = config.trackVisibleContentImpressions;
    this.checkOnScroll = config.checkOnScroll;
    this.timeIntervalInMs = config.timeIntervalInMs;
    this.logAllContentBlocksOnPage = config.logAllContentBlocksOnPage;
    this.enableHeartBeatTimer = config.enableHeartBeatTimer;
    this.activeTimeInseconds = config.activeTimeInseconds;
    this.enableLinkTracking = config.enableLinkTracking;
    this.disablePerformanceTracking = config.disablePerformanceTracking;
    this.enableCrossDomainLinking = config.enableCrossDomainLinking;
    this.setCrossDomainLinkingTimeout = config.setCrossDomainLinkingTimeout;
    this.timeout = config.timeout;
    this.getCrossDomainLinkingUrlParameter =
      config.getCrossDomainLinkingUrlParameter;
    this.disableBrowserFeatureDetection = config.disableBrowserFeatureDetection;

    this.ecomEvents = {
      SET_ECOMMERCE_VIEW: "SET_ECOMMERCE_VIEW",
      ADD_ECOMMERCE_ITEM: "ADD_ECOMMERCE_ITEM",
      REMOVE_ECOMMERCE_ITEM: "REMOVE_ECOMMERCE_ITEM",
      TRACK_ECOMMERCE_ORDER: "TRACK_ECOMMERCE_ORDER",
    };
  }

  loadScript() {
    const _paq = (window._paq = window._paq || []);
    (function (serverUrl, siteId) {
      let u = serverUrl;
      window._paq.push(["setTrackerUrl", `${u}matomo.php`]);
      window._paq.push(["setSiteId", siteId]);
      const d = document;
      const g = d.createElement("script");
      const s = d.getElementsByTagName("script")[0];
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

    // Dasboard Event Settings
    if (window._paq && window._paq.push !== Array.prototype.push) {
      if (this.trackAllContentImpressions) {
        window._paq.push(["trackAllContentImpressions"]);
      }
      if (
        this.trackVisibleContentImpressions &&
        this.checkOnScroll &&
        this.timeIntervalInMs
      ) {
        window._paq.push([
          "trackVisibleContentImpressions",
          this.checkOnScroll,
          this.timeIntervalInMs,
        ]);
      }
      if (this.logAllContentBlocksOnPage) {
        window._paq.push(["logAllContentBlocksOnPage"]);
      }
      if (this.enableHeartBeatTimer && this.activeTimeInseconds) {
        window._paq.push(["enableHeartBeatTimer", this.activeTimeInseconds]);
      }
      if (this.enableLinkTracking) {
        window._paq.push(["enableLinkTracking", true]);
      }
      if (this.disablePerformanceTracking) {
        window._paq.push(["disablePerformanceTracking"]);
      }
      if (this.enableCrossDomainLinking) {
        window._paq.push(["enableCrossDomainLinking"]);
      }
      if (this.setCrossDomainLinkingTimeout && this.timeout) {
        window._paq.push(["setCrossDomainLinkingTimeout", this.timeout]);
      }
      if (this.getCrossDomainLinkingUrlParameter) {
        window._paq.push(["getCrossDomainLinkingUrlParameter"]);
      }
      if (this.disableBrowserFeatureDetection) {
        window._paq.push(["disableBrowserFeatureDetection"]);
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

  track(rudderElement) {
    logger.debug("===In Matomo track===");

    const { message } = rudderElement;
    const { event, properties } = message;
    const goalList = this.eventsMapToGoalId;
    const goalListTo = getHashFromArray(goalList);
    const standard = this.eventsToStandard;
    const standardTo = getHashFromArray(standard);

    if (!event) {
      logger.error("Event name not present");
      return;
    }

    // For every type of track calls we consider the trackGoal function.
    if (goalListTo[event.toLowerCase()]) {
      goalIdMapping(event, goalListTo);
    }

    // Mapping Standard Events
    if (standardTo[event.toLowerCase()]) {
      standardEventsMapping(event, standardTo, properties);
    } else {
      // Mapping Ecommerce Events
      switch (event.toLowerCase().trim()) {
        case "product viewed":
          ecommerceEventsMapping(this.ecomEvents.SET_ECOMMERCE_VIEW, message);
          break;
        case "product added":
          ecommerceEventsMapping(this.ecomEvents.ADD_ECOMMERCE_ITEM, message);
          break;
        case "product removed":
          ecommerceEventsMapping(
            this.ecomEvents.REMOVE_ECOMMERCE_ITEM,
            message
          );
          break;
        case "order completed":
          ecommerceEventsMapping(
            this.ecomEvents.TRACK_ECOMMERCE_ORDER,
            message
          );
          break;

        default:
          // Generic Track Event
          ecommerceEventsMapping("trackEvent", message);
          break;
      }
    }

    // Checks for custom dimensions in the payload, if present makes appropriate calls
    checkCustomDimensions(message);
  }

  page(rudderElement) {
    logger.debug("=== In Matomo Page ===");
    window._paq.push(["trackPageView"]);
  }
}

export default Matomo;

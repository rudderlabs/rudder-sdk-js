/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { eventParametersConfigArray } from "./ECommerceEventConfig";

import {
  isReservedName,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
  getPageViewProperty,
  hasRequiredParameters,
} from "./utils";

export default class GA4 {
  constructor(config, analytics) {
    this.measurementId = config.measurementId;
    this.analytics = analytics;
    this.sendUserId = config.sendUserId || false;
    this.blockPageView = config.blockPageViewEvent || false;
    this.extendPageViewParams = config.extendPageViewParams || false;
    this.name = "GA4";
  }

  loadScript(measurementId, userId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gt() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());

    // This condition is not working, even after disabling page view
    // page_view is even getting called on page load
    if (this.blockPageView) {
      window.gtag("config", measurementId, {
        user_id: userId,
        send_page_view: false,
      });
    } else {
      window.gtag("config", measurementId);
    }

    ScriptLoader(
      "google-analytics 4",
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    );
  }

  init() {
    // To do :: check how custom dimension and metrics is used
    const userId = this.analytics.userId || this.analytics.anonymousId;
    this.loadScript(this.measurementId, userId);
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  /**
   * Function to get destination properties for both event parameters and items array if present
   * @param {*} properties
   * @param {*} hasItem
   * @param {*} products
   */
  getdestinationProperties(properties, hasItem, products) {
    let destinationProperties = {};
    destinationProperties = getDestinationEventProperties(
      properties,
      eventParametersConfigArray
    );

    if (hasItem) {
      destinationProperties.items = getDestinationItemProperties(
        products || [properties],
        destinationProperties.items
      );
    }

    return destinationProperties;
  }

  /**
   *
   * @param {*} rudderElement
   */
  track(rudderElement) {
    let { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const { products } = properties;
    let destinationProperties = {};
    if (!event || isReservedName(event)) {
      throw Error("Cannot call un-named/reserved named track event");
    }
    const eventMappingObj = getDestinationEventName(event);
    if (eventMappingObj) {
      event = eventMappingObj.dest;
      if (eventMappingObj.onlyIncludeParams) {
        /* Only include params that are present in given object
         */
        const includeParams = eventMappingObj.onlyIncludeParams;
        Object.keys(includeParams).forEach((key) => {
          destinationProperties[includeParams[key]] = properties[key];
        });
      } else {
        destinationProperties = this.getdestinationProperties(
          properties,
          eventMappingObj.hasItem,
          products
        );
      }
    } else {
      destinationProperties = properties;
    }

    if (!hasRequiredParameters(destinationProperties, eventMappingObj)) {
      throw Error("Payload must have required parameters..");
    }

    window.gtag("event", event, destinationProperties);
  }

  identify(rudderElement) {
    if (this.sendUserId && rudderElement.message.userId) {
      const userId = this.analytics.userId || this.analytics.anonymousId;
      window.gtag("config", this.measurementId, {
        user_id: userId,
      });
    }
    window.gtag("set", "user_properties", this.analytics.userTraits);
    logger.debug("in GoogleAnalyticsManager identify");
  }

  page(rudderElement) {
    const pageProps = rudderElement.message.properties;
    if (!pageProps) return;
    if (this.extendPageViewParams) {
      window.gtag("event", "page_view", pageProps);
    } else {
      window.gtag("event", "page_view", getPageViewProperty(pageProps));
    }
  }
}

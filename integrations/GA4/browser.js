/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import {
  eventParametersConfigArray,
  itemParametersConfigArray,
} from "./ECommerceEventConfig";

import {
  isReservedName,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
  getPageViewProperty,
} from "./utility";

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

  // When adding events do everything ion lowercase.
  // use underscores instead of spaces
  // Register your parameters to show them up in UI even user_id

  /* utility functions ---Start here ---  */
  isLoaded() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  getDestinationItemProperties(products, item) {
    const items = [];
    let obj = {};
    products.forEach((p) => {
      obj = {
        ...getDestinationEventProperties(p, itemParametersConfigArray),
        ...(item && item[0]),
      };
      items.push(obj);
    });
    return items;
  }

  track(rudderElement) {
    let { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const { products } = properties;
    let destinationProperties = {};
    if (!event || isReservedName(event)) {
      throw Error("Cannot call un-named/reserved named track event");
    }

    const obj = getDestinationEventName(event);
    if (obj) {
      if (products && Array.isArray(products)) {
        event = obj.dest;
        // eslint-disable-next-line no-const-assign
        destinationProperties = getDestinationEventProperties(
          properties,
          eventParametersConfigArray
        );
        destinationProperties.items = getDestinationItemProperties(
          products,
          destinationProperties.items
        );
      } else {
        event = obj.dest;
        if (!obj.hasItem) {
          // eslint-disable-next-line no-const-assign
          destinationProperties = getDestinationEventProperties(
            properties,
            eventParametersConfigArray
          );
        } else {
          // create items
          destinationProperties.items = getDestinationItemProperties([
            properties,
          ]);
        }
      }
    } else {
      destinationProperties = properties;
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
    const page =
      rudderElement.message.context && rudderElement.message.context.page;
    if (!page) return;
    if (this.extendPageViewParams) {
      window.gtag("event", "page_view", page);
    } else {
      window.gtag("event", "page_view", getPageViewProperty(page));
    }
  }
}

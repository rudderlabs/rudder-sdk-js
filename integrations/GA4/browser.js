/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

import {
  isReservedName,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
  getPageViewProperty,
  hasRequiredParameters,
} from "./utils";
import { type, flattenJsonPayload } from "../../utils/utils";

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
      if (this.sendUserId) {
        window.gtag("config", measurementId, {
          user_id: userId,
          send_page_view: false,
        });
      } else {
        window.gtag("config", measurementId, {
          send_page_view: false,
        });
      }
    } else if (this.sendUserId) {
      window.gtag("config", measurementId, {
        user_id: userId,
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
   * For top level properties, include only those properties that are in the includeList
   * @param {*} properties
   * @param {*} hasItem
   * @param {*} products
   * @param {*} includeList
   */
  getdestinationProperties(properties, hasItem, products, includeList) {
    let destinationProperties = {};
    destinationProperties = getDestinationEventProperties(
      properties,
      includeList,
      hasItem
    );

    if (hasItem) {
      // only for events where GA requires an items array to be sent
      // get the product related destination keys || if products is not present use the rudder message properties to get the product related destination keys
      destinationProperties.items = getDestinationItemProperties(
        products || [properties],
        destinationProperties.items
      );
    }

    return destinationProperties;
  }

  /**
   * Only include params that are present in given mapping config for things like Cart/Product shared, Product/Products shared
   * @param {*} params
   * @param {*} properties
   */
  getIncludedParameters(params, properties) {
    const destinationProperties = {};
    if (type(params) === "object") {
      const { defaults, mappings } = params;
      if (type(defaults) === "object") {
        Object.keys(defaults).forEach((key) => {
          destinationProperties[key] = defaults[key];
        });
      }
      if (type(mappings) === "object") {
        Object.keys(mappings).forEach((key) => {
          destinationProperties[mappings[key]] = properties[key];
        });
      }
    }
    return destinationProperties;
  }

  sendGAEvent(event, parameters, checkRequiredParameters, eventMappingObj) {
    if (checkRequiredParameters) {
      if (!hasRequiredParameters(parameters, eventMappingObj)) {
        throw Error("Payload must have required parameters..");
      }
    }
    window.gtag("event", event, parameters);
  }

  handleEventMapper(eventMappingObj, properties, products) {
    let destinationProperties = {};
    const event = eventMappingObj.dest;
    if (eventMappingObj.onlyIncludeParams) {
      /* Only include params that are present in given mapping config for things like Cart/Product shared, Product/Products shared
       */
      const includeParams = eventMappingObj.onlyIncludeParams;
      destinationProperties = this.getIncludedParameters(
        includeParams,
        properties
      );
    } else {
      destinationProperties = this.getdestinationProperties(
        properties,
        eventMappingObj.hasItem,
        products,
        eventMappingObj.includeList
      );
    }
    this.sendGAEvent(event, destinationProperties, true, eventMappingObj);
  }

  /**
   *
   * @param {*} rudderElement
   */
  track(rudderElement) {
    const { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const { products } = properties;
    if (!event || isReservedName(event)) {
      throw Error("Cannot call un-named/reserved named track event");
    }
    // get GA4 event name and corresponding configs defined to add properties to that event
    const eventMappingArray = getDestinationEventName(event);
    if (eventMappingArray && eventMappingArray.length) {
      eventMappingArray.forEach((events) => {
        this.handleEventMapper(events, properties, products);
      });
    } else {
      this.sendGAEvent(event, flattenJsonPayload(properties), false);
    }
  }

  identify(rudderElement) {
    window.gtag(
      "set",
      "user_properties",
      flattenJsonPayload(this.analytics.userTraits)
    );
    if (this.sendUserId && rudderElement.message.userId) {
      const userId = this.analytics.userId || this.analytics.anonymousId;
      if (this.blockPageView) {
        window.gtag("config", this.measurementId, {
          user_id: userId,
          send_page_view: false,
        });
      } else {
        window.gtag("config", this.measurementId, {
          user_id: userId,
        });
      }
    }

    logger.debug("in GoogleAnalyticsManager identify");
  }

  page(rudderElement) {
    let pageProps = rudderElement.message.properties;
    if (!pageProps) return;
    pageProps = flattenJsonPayload(pageProps);
    if (this.extendPageViewParams) {
      window.gtag("event", "page_view", {
        ...pageProps,
        ...getPageViewProperty(pageProps),
      });
    } else {
      window.gtag("event", "page_view", getPageViewProperty(pageProps));
    }
  }
}

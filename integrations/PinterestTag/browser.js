/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import {
  eventMapping,
  searchPropertyMapping,
  productPropertyMapping,
  pinterestPropertySupport,
} from "./propertyMappingConfig";
import {
  flattenJsonPayload,
  isDefinedAndNotNull,
  getDataFromSource,
} from "../../utils/utils";

export default class PinterestTag {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.tagId = !config.tagId ? "" : config.tagId;
    this.enhancedMatch = config.enhancedMatch || false;
    this.customProperties = config.customProperties || [];
    this.userDefinedEventsMapping = config.eventsMapping || [];
    this.name = "PINTEREST_TAG";
    logger.debug("config", config);
  }

  loadScript() {
    !(function (e) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments));
        };
        var n = window.pintrk;
        (n.queue = []), (n.version = "3.0");
        var t = document.createElement("script");
        (t.async = !0), (t.src = e);
        var r = document.getElementsByTagName("script")[0];
        r.parentNode.insertBefore(t, r);
      }
    })("https://s.pinimg.com/ct/core.js");

  }

  handleEnhancedMatch() {
    const email = this.analytics.userTraits && this.analytics.userTraits.email;
    if (email && this.enhancedMatch) {
      window.pintrk("load", this.tagId, {
        em: email,
      });
    } else {
      window.pintrk("load", this.tagId);
    }
    window.pintrk("page");
  }

  init() {
    logger.debug("===in init Pinterest Tag===");
    this.loadScript();
    this.handleEnhancedMatch();
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    logger.debug("===in isLoaded Pinterest Tag===");

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===in isReady Pinterest Tag===");

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  sendPinterestTrack(eventName, pinterestObject) {
    window.pintrk("track", eventName, pinterestObject);
  }

  /**
   * Send rudder property and mappings array. This function will return data mapping destination property
   * @param {*} properties
   * @param {*} mappings
   * @returns Pinterest Products
   */
  getMappingObject(properties, mappings) {
    let pinterestObject = {};
    mappings.forEach((mapping) => {
      Object.keys(properties).forEach((p) => {
        pinterestObject = {
          ...getDataFromSource(mapping.src, mapping.dest, p, properties),
          ...pinterestObject,
        };
      });
    });
    return pinterestObject;
  }

  /**
   * This function  simply copies data from rudder payload to new object provided all
   * the key in properties is present in pinterestPropertySupport
   * @param {rudder properties} properties
   * @returns
   */
  getRawPayload(properties) {
    const data = {};
    Object.keys(properties).forEach((p) => {
      if (pinterestPropertySupport.includes(p)) {
        data[p] = properties[p];
      }
    });
    // This logic maps rudder query to search_query for Products Searched events
    if (isDefinedAndNotNull(properties[searchPropertyMapping.src])) {
      data[searchPropertyMapping.dest] = properties[searchPropertyMapping.src];
    }
    return data;
  }

  /**
   * This function will generate required pinterest object to be sent.
   * getRawPayload() will generate all the destination property excepts lineItems
   * If rudder payload has products array then line_items is generated
   * In case if the call is for event which has flag hasEmptyProducts to true, it will generate all
   * properties including lineItems even if it does not have products array in it ex: Product Added
   *
   * @param {rudder payload} properties
   * @param {*} hasEmptyProducts
   * @returns
   */
  generatePinterestObject(properties, hasEmptyProducts = false) {
    const pinterestObject = this.getRawPayload(properties);

    let { products } = properties;
    if (hasEmptyProducts && !products) {
      products = [properties];
    }
    if (products) {
      const lineItems = [];
      products.forEach((p) => {
        const product = this.getMappingObject(p, productPropertyMapping);
        lineItems.push(product);
      });
      pinterestObject.line_items = lineItems;
    }

    if (this.customProperties.length > 0) {
      const flattenPayload = flattenJsonPayload(properties);
      this.customProperties.forEach((custom) => {
        // This check fails if user is sending boolean value as false
        // Adding toString because if the property value is boolean then it never gets reflected in destination
        if (isDefinedAndNotNull(flattenPayload[custom.properties])) {
          pinterestObject[custom.properties] = flattenPayload[
            custom.properties
          ].toString();
        }
      });
    }
    return pinterestObject;
  }

  /**
   * This gives destination events .
   * Logics: If our eventMapping is not able to map the event that is sent by user payload then it will look into
   * userDefinedEventsMapping array. In case if it is not found there as well, it will return undefined.
   * @param {rudder event name} event
   * @returns
   */
  getDestinationEventName(event) {
    const destinationEvent = eventMapping.find((p) =>
      p.src.includes(event.toLowerCase())
    );
    if (!destinationEvent && this.userDefinedEventsMapping.length > 0) {
      const userDefinedEvent = this.userDefinedEventsMapping.find(
        (e) => e.rudderEvent.toLowerCase() === event.toLowerCase()
      );
      if (userDefinedEvent && userDefinedEvent.rudderEvent) {
        return {
          dest: userDefinedEvent.pinterestEvent,
          isUserDefinedEvent: true,
        };
      }
    }
    return destinationEvent;
  }

  track(rudderElement) {
    if (!rudderElement.message) {
      return;
    }
    const { properties, event } = rudderElement.message;
    let eventName = event;
    const destEvent = this.getDestinationEventName(event);
    if (isDefinedAndNotNull(destEvent)) {
      eventName = destEvent.dest;
    }
    const pinterestObject = this.generatePinterestObject(
      properties,
      destEvent?.hasEmptyProducts,
      destEvent?.isUserDefinedEvent
    );

    this.sendPinterestTrack(eventName, pinterestObject);
  }

  page(rudderElement) {
    const { category, name } = rudderElement.message;
    const pageObject = { name: name || "" };
    let event = "PageVisit";
    if (category) {
      pageObject.category = category;
      event = "ViewCategory";
    }
    window.pintrk("track", event, pageObject);
  }

  identify() {
    const email = this.analytics.userTraits && this.analytics.userTraits.email;
    if (email) {
      window.pintrk("set", { np: "rudderstack", em: email });
    }
  }
}

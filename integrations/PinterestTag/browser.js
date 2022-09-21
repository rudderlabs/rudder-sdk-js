/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import {
  eventMapping,
  searchPropertyMapping,
  productPropertyMapping,
  propertyMapping,
  pinterestPropertySupport,
} from './propertyMappingConfig';
import { flattenJsonPayload, isDefinedAndNotNull, getDataFromSource } from '../../utils/utils';
import { getHashFromArrayWithDuplicate, isDefined } from '../utils/commonUtils';
import { NAME } from './constants';
import { LOAD_ORIGIN } from '../ScriptLoader';

export default class PinterestTag {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.tagId = !config.tagId ? '' : config.tagId;
    this.enhancedMatch = config.enhancedMatch || false;
    this.customProperties = config.customProperties || [];
    this.userDefinedEventsMapping = config.eventsMapping || [];
    this.name = NAME;
    this.deduplicationKey = config.deduplicationKey;
    logger.debug('config', config);
  }

  loadScript() {
    !(function (e) {
      if (!window.pintrk) {
        window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments));
        };
        const n = window.pintrk;
        (n.queue = []), (n.version = '3.0');
        const t = document.createElement('script');
        (t.async = !0), (t.src = e), t.setAttribute('data-loader', LOAD_ORIGIN);
        const r = document.getElementsByTagName('script')[0];
        r.parentNode.insertBefore(t, r);
      }
    })('https://s.pinimg.com/ct/core.js');
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
  getMappingObject(properties, mappings, isPersist = false) {
    let pinterestObject = {};
    mappings.forEach((mapping) => {
      pinterestObject = {
        ...getDataFromSource(mapping.src, mapping.dest, properties),
        ...pinterestObject,
      };
    });
    if (isPersist) {
      return {
        ...pinterestObject,
        ...properties,
      };
    }
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
    const mappedProps = this.getMappingObject(properties, propertyMapping, true);
    Object.keys(mappedProps).forEach((p) => {
      if (pinterestPropertySupport.includes(p)) {
        data[p] = mappedProps[p];
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
   * It will generate all properties including lineItems even if it does not have products array in it ex: Product Added
   *
   * @param {rudder payload} properties
   * @returns
   */
  generatePinterestObject(properties) {
    const pinterestObject = this.getRawPayload(properties);

    let { products } = properties;
    if (!products) {
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

    if (this.customProperties.length > 0 && Object.keys(properties).length > 0) {
      const flattenPayload = flattenJsonPayload(properties);

      this.customProperties.forEach((custom) => {
        // This check fails if user is sending boolean value as false
        // Adding toString because if the property value is boolean then it never gets reflected in destination
        if (isDefinedAndNotNull(flattenPayload[custom.properties])) {
          pinterestObject[custom.properties] = flattenPayload[custom.properties].toString();
        }
      });
    }
    return pinterestObject;
  }

  getDestinationEventName(event) {
    let eventName;
    /*
    Step 1: At first we will look for
            the event mapping in the UI. In case it is similar, will map to that.
     */
    if (this.userDefinedEventsMapping.length > 0) {
      const keyMap = getHashFromArrayWithDuplicate(
        this.userDefinedEventsMapping,
        'from',
        'to',
        false,
      );
      eventName = keyMap[event];
    }
    if (isDefined(eventName)) {
      return [...eventName];
    }
    /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Pinterest Conversion API
            mappings.
    */
    if (!eventName) {
      const eventMapInfo = eventMapping.find((eventMap) => {
        if (eventMap.src.includes(event.toLowerCase())) {
          return eventMap;
        }
        return false;
      });
      if (isDefinedAndNotNull(eventMapInfo)) {
        return [eventMapInfo.dest];
      }
    }
    /*
    Step 3: In case both of the above stated cases fail, will mark the event as "custom"
   */
    return ['custom'];
  }

  track(rudderElement) {
    if (!rudderElement.message || !rudderElement.message.event) {
      return;
    }
    const { message } = rudderElement;
    const { properties, event, messageId } = message;
    const destEventArray = this.getDestinationEventName(event);
    destEventArray.forEach((eventName) => {
      const pinterestObject = this.generatePinterestObject(properties);
      pinterestObject.event_id = get(message, `${this.deduplicationKey}`) || messageId;
      this.sendPinterestTrack(eventName, pinterestObject);
    });
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
      window.pintrk("set", { em: email });
    }
  }
}

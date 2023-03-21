/* eslint-disable class-methods-use-this */
import sha256 from 'crypto-js/sha256';
import get from 'get-value';
import logger from '../../utils/logUtil';
import {
  eventMapping,
  searchPropertyMapping,
  productPropertyMapping,
  propertyMapping,
  pinterestPropertySupport,
} from './propertyMappingConfig';
import {
  flattenJsonPayload,
  isDefinedAndNotNull,
  getDataFromSource,
  getDefinedTraits,
} from '../../utils/utils';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { NAME } from './constants';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

export default class PinterestTag {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.tagId = !config.tagId ? '' : config.tagId;
    this.enhancedMatch = config.enhancedMatch || false;
    this.customProperties = config.customProperties || [];
    this.userDefinedEventsMapping = config.eventsMapping || [];
    this.name = NAME;
    this.deduplicationKey = config.deduplicationKey;
    this.areTransformationsConnected = destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo.destinationId;
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
      window.pintrk('load', this.tagId, {
        em: email,
      });
    } else {
      window.pintrk('load', this.tagId);
    }
    window.pintrk('page');
  }

  init() {
    logger.debug('===in init Pinterest Tag===');
    this.loadScript();
    this.handleEnhancedMatch();
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    logger.debug('===in isLoaded Pinterest Tag===');

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }

  // ref :- https://developers.pinterest.com/docs/conversions/conversion-management/#Understanding%20Limited%20Data%20Processing#%0A%2CCPRA%20Related%20Data%20Fields:~:text=using%20SHA%2D256.-,%3C,%3E,-To%20specifically%20not
  generateLdpObject(message) {
    if (!message) {
      const { userTraits } = this.analytics;
      const optOutType = userTraits?.optOutType || '';
      const state =
        userTraits?.state ||
        userTraits?.State ||
        userTraits?.address?.state ||
        userTraits?.address?.State ||
        '';
      const country =
        userTraits?.country ||
        userTraits?.Country ||
        userTraits?.address?.country ||
        userTraits?.address?.Country ||
        '';
      return {
        opt_out_type: optOutType,
        st: optOutType ? sha256(state).toString() : '',
        country: optOutType ? sha256(country).toString() : '',
      };
    }

    const optOutType = message.context.traits?.optOutType || message.properties?.optOutType || '';
    const { state, country } = getDefinedTraits(message);
    return {
      opt_out_type: optOutType,
      st: optOutType ? sha256(state || '').toString() : '',
      country: optOutType ? sha256(country || '').toString() : '',
    };
  }

  setLdp(message) {
    window.pintrk('set', this.generateLdpObject(message));
  }

  isReady() {
    logger.debug('===in isReady Pinterest Tag===');

    return !!(window.pintrk && window.pintrk.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  sendPinterestTrack(eventName, pinterestObject) {
    window.pintrk('track', eventName, pinterestObject);
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
   * getRawPayload() will generate all the destination property excepts lineItems.
   * If rudder payload has products array then line_items is generated
   * If it does not have product array, it will move the whole message.properties into line items. ex: Product Added
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
    let eventNames;
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
      eventNames = keyMap[event];
    }
    if (eventNames) {
      return eventNames;
    }
    /*
    Step 2: To find if the particular event is amongst the list of standard
            Rudderstack ecommerce events, used specifically for Pinterest Conversion API
            mappings.
    */
    const eventMapInfo = eventMapping.find((eventMap) => {
      if (eventMap.src.includes(event.toLowerCase())) {
        return eventMap;
      }
      return false;
    });
    if (isDefinedAndNotNull(eventMapInfo)) {
      return [eventMapInfo.dest];
    }

    /*
    Step 3: In case both of the above stated cases fail, will send the event name as it is.
          This is going to be reflected as "unknown" event in pinterest tag dashboard.
   */
    return [event];
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
      this.setLdp(message);
      this.sendPinterestTrack(eventName, pinterestObject);
    });
  }

  page(rudderElement) {
    const { category, name } = rudderElement.message;
    const pageObject = { name: name || '' };
    let event = 'PageVisit';
    if (category) {
      pageObject.category = category;
      event = 'ViewCategory';
    }
    this.setLdp(rudderElement.message);
    window.pintrk('track', event, pageObject);
  }

  identify() {
    const email = this.analytics.userTraits && this.analytics.userTraits.email;
    if (email) {
      const ldpObject = this.generateLdpObject();
      window.pintrk('set', { em: email, ...ldpObject });
    }
  }
}

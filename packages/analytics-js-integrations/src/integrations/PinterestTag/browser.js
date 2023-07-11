/* eslint-disable class-methods-use-this */
import sha256 from 'crypto-js/sha256';
import get from 'get-value';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/PinterestTag/constants';
import {
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
import { getDestinationEventName } from './utils';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    this.sendAsCustomEvent = config.sendAsCustomEvent || false;
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
    const userTraits = this.analytics.getUserTraits();
    const email = userTraits && userTraits.email;
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
    mappings.forEach(mapping => {
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
    Object.keys(mappedProps).forEach(p => {
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
      products.forEach(p => {
        const product = this.getMappingObject(p, productPropertyMapping);
        lineItems.push(product);
      });
      pinterestObject.line_items = lineItems;
    }

    if (this.customProperties.length > 0 && Object.keys(properties).length > 0) {
      const flattenPayload = flattenJsonPayload(properties);

      this.customProperties.forEach(custom => {
        // This check fails if user is sending boolean value as false
        // Adding toString because if the property value is boolean then it never gets reflected in destination
        if (isDefinedAndNotNull(flattenPayload[custom.properties])) {
          pinterestObject[custom.properties] = flattenPayload[custom.properties].toString();
        }
      });
    }
    return pinterestObject;
  }

  track(rudderElement) {
    if (!rudderElement.message || !rudderElement.message.event) {
      return;
    }
    const { message } = rudderElement;
    const { properties, event, messageId } = message;
    const destEventArray = getDestinationEventName(
      event,
      this.userDefinedEventsMapping,
      this.sendAsCustomEvent,
    );
    destEventArray.forEach(eventName => {
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
    const userTraits = this.analytics.getUserTraits();
    const email = userTraits && userTraits.email;
    if (email) {
      const ldpObject = this.generateLdpObject();
      window.pintrk('set', { em: email, ...ldpObject });
    }
  }
}

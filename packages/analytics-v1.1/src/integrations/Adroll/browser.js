/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';

import { getHashFromArray } from '../../utils/commonUtils';

import { NAME } from './constants';
import ScriptLoader from '../../utils/ScriptLoader';
import { PRODUCT_EVENTS, ORDER_EVENTS, productEvent, orderEvent } from './util';

class Adroll {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.advId = config.advId;
    this.pixId = config.pixId;
    this.name = NAME;
    window.adroll_adv_id = this.advId;
    window.adroll_pix_id = this.pixId;
    this.eventsMap = config.eventsMap || [];
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Adroll===');
    ScriptLoader('adroll roundtrip', `https://s.adroll.com/j/${this.advId}/roundtrip.js`);
  }

  isLoaded() {
    logger.debug('===In isLoaded Adroll===');
    return !!window.__adroll;
  }

  isReady() {
    logger.debug('===In isReady Adroll===');
    return !!window.__adroll;
  }

  identify(rudderElement) {
    logger.debug('===In Adroll Identify===');
    const { message } = rudderElement;
    const email = get(message, 'context.traits.email') || get(message, 'traits.email');

    if (!email) {
      logger.error('User parameter (email) is required for identify call');
      return;
    }
    window._adroll_email = email;
    window.__adroll.record_adroll_email('segment');
  }
  // record_adroll_email is used to attach a image pixel to the page connected to the user identified

  track(rudderElement) {
    const { message } = rudderElement;
    const { userId, event, properties } = message;
    const eventsHashmap = getHashFromArray(this.eventsMap);
    let data;
    if (eventsHashmap[event.toLowerCase()]) {
      if (userId) {
        properties.user_id = userId;
      }
      if (PRODUCT_EVENTS.indexOf(event.toLowerCase()) !== -1) {
        data = productEvent(properties);
      } else if (ORDER_EVENTS.indexOf(event.toLowerCase()) !== -1) {
        data = orderEvent(properties);
      } else {
        if (properties.revenue) {
          properties.adroll_conversion_value = properties.revenue;
          delete properties.revenue;
        }
        const segmentId = eventsHashmap[event.toLowerCase()];
        properties.adroll_segments = segmentId;
        data = properties;
      }
      const segmentId = eventsHashmap[event.toLowerCase()];
      data.adroll_segments = segmentId;
      window.__adroll.record_user(data);
    } else {
      logger.error(`The event ${message.event} is not mapped to any segmentId. Aborting!`);
    }
  }
  // record_user fires the correct pixel in accordance with the event configured in the dashboard
  // and the segment associated in adroll

  page(rudderElement) {
    logger.debug('=== In Adroll Page ===');
    const { message } = rudderElement;
    const eventsHashmap = getHashFromArray(this.eventsMap);
    let pageFullName;
    if (!message.name && !message.category) {
      pageFullName = `Viewed a Page`;
    } else if (!message.name && message.category) {
      pageFullName = `Viewed ${message.category} Page`;
    } else if (message.name && !message.category) {
      pageFullName = `Viewed ${message.name} Page`;
    } else {
      pageFullName = `Viewed ${message.category} ${message.name} Page`;
    }

    const segmentId = eventsHashmap[pageFullName.toLowerCase()];
    if (!segmentId) {
      logger.error(`The event ${pageFullName} is not mapped to any segmentId. Aborting!`);
      return;
    }

    window.__adroll.record_user({
      adroll_segments: segmentId,
      name: pageFullName,
      path: window.location.pathname,
      referrer: window.document.referrer,
      search: window.location.search,
      title: window.document.title,
      url: window.location.href,
    });
  }
}

export default Adroll;

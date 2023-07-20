/* eslint-disable */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

class QuoraPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.pixelId = config.pixelId;
    this.eventsToQPEvents = config.eventsToQPEvents;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    loadNativeSdk(this.pixelId);
  }

  init() {
    logger.debug('===In init Quora Pixel===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Quora Pixel===');
    return !!(window.qp && window.qp.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('===In isReady Quora Pixel===');
    return !!(window.qp && window.qp.push !== Array.prototype.push);
  }

  track(rudderElement) {
    logger.debug('===In Quora Pixel track===');
    const { event } = rudderElement.message;
    const eventsMapping = getHashFromArrayWithDuplicate(this.eventsToQPEvents);
    const trimmedEvent = event.toLowerCase().trim();
    const events = eventsMapping[trimmedEvent] || [];

    if (events.length === 0) {
      logger.warn(`===No Quora Pixel mapped event found. Sending Generic as the default event===`);
      window.qp('track', 'Generic');
    }

    events.forEach((qpEvent) => {
      if (!qpEvent) {
        window.qp('track', 'Generic');
      } else if (qpEvent !== 'Custom') {
        window.qp('track', qpEvent);
      }
    });
  }
}

export default QuoraPixel;

/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/QuoraPixel/constants';
import { isDefinedAndNotNull } from '@rudderstack/analytics-js-common/utilities/checks';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class QuoraPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.pixelId = config.pixelId;
    this.eventsToQPEvents = config.eventsToQPEvents;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.pixelId);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    return !!(window.qp && window.qp.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  track(rudderElement) {
    const { event } = rudderElement.message;
    const eventsMapping = getHashFromArrayWithDuplicate(this.eventsToQPEvents);

    if (!isDefinedAndNotNull(event)) {
      logger.error('Event name is either null or undefined');
      return;
    }

    if (typeof event !== 'string') {
      logger.error('Event name should be a string');
      return;
    }

    const trimmedEvent = event.toLowerCase().trim();
    const events = eventsMapping[trimmedEvent] || [];

    if (events.length === 0) {
      logger.warn('No Quora Pixel mapped event found. Sending Generic as the default event');
      window.qp('track', 'Generic');
    }

    events.forEach(qpEvent => {
      if (!qpEvent) {
        window.qp('track', 'Generic');
      } else if (qpEvent !== 'Custom') {
        window.qp('track', qpEvent);
      }
    });
  }
}

export default QuoraPixel;

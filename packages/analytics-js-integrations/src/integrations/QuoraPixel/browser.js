/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/QuoraPixel/constants';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!(window.qp && window.qp.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!(window.qp && window.qp.push !== Array.prototype.push);
  }

  track(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} track`);

    const { event } = rudderElement.message;
    const eventsMapping = getHashFromArrayWithDuplicate(this.eventsToQPEvents);
    const trimmedEvent = event.toLowerCase().trim();
    const events = eventsMapping[trimmedEvent] || [];

    if (events.length === 0) {
      logger.warn(
        `${DISPLAY_NAME} : No Quora Pixel mapped event found. Sending Generic as the default event`,
      );
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

/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/XPixel/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);
class XPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.pixelId = config.pixelId;
    this.event = config.eventId;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.pixelId);
  }

  isLoaded() {
    return !!window.twq;
  }

  isReady() {
    return this.isLoaded();
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    if (!event) {
      logger.error('Event name is missing');
      return;
    }

    if (properties) {
      properties.isRudderEvents = true;
      window.twq.track(event, properties);
    } else {
      window.twq.track(event, { isRudderEvents: true });
    }
  }
}
export default XPixel;

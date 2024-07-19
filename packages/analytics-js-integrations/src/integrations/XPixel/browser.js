/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/XPixel/constants';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { getTrackResponse } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);
class XPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.pixelId = config.pixelId;
    this.eventToEventIdMap = config.eventToEventIdMap;
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
    const { event } = rudderElement.message;
    if (!event) {
      logger.error('Event name is missing');
      return;
    }
    const properties = getTrackResponse(rudderElement.message);
    const standardEventsMap = getHashFromArrayWithDuplicate(this.eventToEventIdMap);
    const eventIds = standardEventsMap[event?.toLowerCase()];
    if (Array.isArray(eventIds)) {
      eventIds.forEach(eventId => {
        window.twq('event', eventId, properties);
      });
    } else {
      logger.error(`Event name (${event}) is not valid, must be mapped to atleast one Event ID`);
    }
  }

  page(rudderElement) {
    const event = 'Page View';
    const properties = getTrackResponse(rudderElement.message);
    const standardEventsMap = getHashFromArrayWithDuplicate(this.eventToEventIdMap);
    const eventIds = standardEventsMap[event?.toLowerCase()];
    if (Array.isArray(eventIds)) {
      eventIds.forEach(eventId => {
        window.twq('event', eventId, properties);
      });
    } else {
      logger.error(`Event name (${event}) is not valid, must be mapped to atleast one Event ID`);
    }
  }
}
export default XPixel;

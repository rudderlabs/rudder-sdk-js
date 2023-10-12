/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
  eventNameMapping,
} from '@rudderstack/analytics-js-common/constants/integrations/TiktokAds/constants';
import Logger from '../../utils/logger';
import {
  isDefinedAndNotNull,
  getDestinationExternalID,
  getHashFromArrayWithDuplicate,
} from '../../utils/commonUtils';
import { getTrackResponse } from './util';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

// Docs : https://ads.tiktok.com/gateway/docs/index
class TiktokAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.analytics = analytics;
    this.eventsToStandard = config.eventsToStandard;
    this.pixelCode = config.pixelCode;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.pixelCode);
  }

  isLoaded() {
    logger.debug('In isLoaded');
    return !!window.ttq;
  }

  isReady() {
    logger.debug('In isReady');
    return !!window.ttq;
  }

  identify(rudderElement) {
    logger.debug('In identify');
    const { message } = rudderElement;
    const { traits } = message.context;
    const { email, phone, number } = traits;
    const payload = {};
    if (isDefinedAndNotNull(email)) {
      payload.email = email;
    }
    if (isDefinedAndNotNull(phone) || isDefinedAndNotNull(number)) {
      payload.phone = phone || number;
    }
    if (Object.keys(payload).length > 0) {
      const externalId = getDestinationExternalID(message, 'tiktokExternalId');
      if (isDefinedAndNotNull(externalId)) {
        window.ttq.identify(externalId, payload);
      } else {
        window.ttq.identify(payload);
      }
    }
  }

  track(rudderElement) {
    logger.debug('In track');

    const { message } = rudderElement;
    let event = message?.event;
    if (!event) {
      logger.error('Event name is required');
      return;
    }
    event = event.toLowerCase().trim();
    const standardEventsMap = getHashFromArrayWithDuplicate(this.eventsToStandard);
    if (eventNameMapping[event] === undefined && !standardEventsMap[event]) {
      logger.error(`Event name (${event}) is not valid, must be mapped to one of standard events`);
      return;
    }
    if (standardEventsMap[event]) {
      Object.keys(standardEventsMap).forEach(key => {
        if (key === event) {
          standardEventsMap[event].forEach(eventName => {
            const updatedProperties = getTrackResponse(message);
            window.ttq.track(eventName, updatedProperties);
          });
        }
      });
    } else {
      event = eventNameMapping[event];
      const updatedProperties = getTrackResponse(message);
      window.ttq.track(event, updatedProperties);
    }
  }

  page(rudderElement) {
    logger.debug('In page');
    window.ttq.page();
  }
}

export default TiktokAds;

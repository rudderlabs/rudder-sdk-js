/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/LinkedInInsightTag/constants';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

class LinkedInInsightTag {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.partnerId = config.partnerId;
    this.eventToConversionIdMap = config.eventToConversionIdMap;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    ScriptLoader('LinkedIn Insight Tag', 'https://snap.licdn.com/li.lms-analytics/insight.min.js');
    if (!this.partnerId) {
      return;
    }
    window._linkedin_data_partner_id = this.partnerId;
  }

  isLoaded() {
    return !!window._linkedin_data_partner_id;
  }

  isReady() {
    return this.isLoaded();
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error('Event name is missing for track call');
      return;
    }

    if (typeof event !== 'string') {
      logger.error('Event type should be string');
      return;
    }

    const trimmedEvent = event.trim();
    const eventMapping = getHashFromArrayWithDuplicate(
      this.eventToConversionIdMap,
      'from',
      'to',
      false,
    );
    if (!eventMapping[trimmedEvent]) {
      logger.error(
        `The "${event}" event is not mapped in the destination dashboard. It'll be skipped`,
      );
      return;
    }
    const eventArray = eventMapping[trimmedEvent] || [];
    eventArray.forEach(eventValue => {
      window.lintrk('track', { conversion_id: eventValue });
    });
  }
}

export default LinkedInInsightTag;

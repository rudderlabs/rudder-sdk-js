/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { NAME } from './constants';

class LinkedInInsightTag {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.partnerId = config.partnerId;
    this.eventToConversionIdMap = config.eventToConversionIdMap;
    this.enableTransformationForDeviceMode =
      destinationInfo && destinationInfo.enableTransformationForDeviceMode;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init LinkedIn Insight Tag===');
    ScriptLoader('LinkedIn Insight Tag', 'https://snap.licdn.com/li.lms-analytics/insight.min.js');
    if (!this.partnerId) {
      return;
    }
    window._linkedin_data_partner_id = this.partnerId;
  }

  isLoaded() {
    logger.debug('=== in isLoaded LinkedIn Insight Tag===');
    return !!window._linkedin_data_partner_id;
  }

  isReady() {
    logger.debug('=== in isReady LinkedIn Insight Tag===');
    return !!window._linkedin_data_partner_id;
  }

  track(rudderElement) {
    logger.debug('===In LinkedIn Insight Tag Track===');
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error('[LinkedIn Insight Tag]: Event name is missing for track call.');
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
      logger.debug(
        `The "${event}" event is not mapped in the destination dashboard. It'll be skipped.`,
      );
      return;
    }
    const eventArray = eventMapping[trimmedEvent] || [];
    eventArray.forEach((eventValue) => {
      window.lintrk('track', { conversion_id: eventValue });
    });
  }
}

export default LinkedInInsightTag;

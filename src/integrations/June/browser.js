/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import ScriptLoader from '../../utils/ScriptLoader';
import { getDestinationExternalID } from '../../utils/commonUtils';

class June {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.apiKey = config.apiKey;
    this.enableTransformationForDeviceMode =
      destinationInfo && destinationInfo.enableTransformationForDeviceMode;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    window.analytics = {};
    ScriptLoader(
      'june-integration',
      'https://unpkg.com/@june-so/analytics-next/dist/umd/standalone.js',
    );
    window.analytics._writeKey = this.apiKey;
  }

  init() {
    logger.debug('===In init June===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded June===');
    return !!window.analytics && typeof window.analytics === 'object';
  }

  isReady() {
    logger.debug('===In isReady June===');
    return !!window.analytics && typeof window.analytics === 'object';
  }

  page(rudderElement) {
    logger.debug('===In June page===');
    const { name, properties } = rudderElement.message;
    window.analytics.page(name, properties);
  }

  identify(rudderElement) {
    logger.debug('===In June identify===');
    const { message } = rudderElement;
    const userId =
      get(message, 'userId') ||
      get(message, 'context.traits.userId') ||
      get(message, 'context.traits.Id');
    if (!userId) {
      logger.error('userId is required for an identify call');
      return;
    }
    const traits = get(message, 'context.traits');
    window.analytics.identify(userId, traits);
  }

  track(rudderElement) {
    logger.debug('===In June track===');
    let groupId;
    const { message } = rudderElement;
    const externalGroupId = getDestinationExternalID(message, 'juneGroupId');
    const { event } = message;
    let { properties } = message;
    ({ groupId, ...properties } = properties || {});
    groupId = externalGroupId || groupId;

    if (groupId) {
      window.analytics.track(event, properties, { groupId });
    } else {
      window.analytics.track(event, properties);
    }
  }

  group(rudderElement) {
    logger.debug('===In June group===');
    const { groupId } = rudderElement.message;
    if (!groupId) {
      logger.error('groupId is required for group call');
      return;
    }
    const { traits } = rudderElement.message;
    window.analytics.group(groupId, traits);
  }
}

export default June;

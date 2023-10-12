/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/June/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import { getDestinationExternalID } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

class June {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.apiKey = config.apiKey;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
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
    this.loadScript();
  }

  isLoaded() {
    logger.debug('In isLoaded');
    return !!(window.analytics && window.analytics.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('In isReady');
    return !!(window.analytics && window.analytics.push !== Array.prototype.push);
  }

  page(rudderElement) {
    logger.debug('In page');
    const { name, properties } = rudderElement.message;
    window.analytics.page(name, properties);
  }

  identify(rudderElement) {
    logger.debug('In identify');
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
    logger.debug('In track');
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
    logger.debug('In group');
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

/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Appcues/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import { isDefinedAndNotNullAndNotEmpty } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

class Appcues {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.apiKey = config.apiKey;
    this.nativeSdkUrl = config.nativeSdkUrl;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    let url = `https://fast.appcues.com/${this.accountId}.js`;
    if (
      isDefinedAndNotNullAndNotEmpty(this.nativeSdkUrl) &&
      typeof this.nativeSdkUrl === 'string'
    ) {
      if (this.nativeSdkUrl.endsWith('.js')) {
        url = this.nativeSdkUrl;
      } else if (this.nativeSdkUrl.endsWith('/')) {
        url = `${this.nativeSdkUrl}${this.accountId}.js`;
      } else {
        url = `${this.nativeSdkUrl}/${this.accountId}.js`;
      }
    }
    ScriptLoader('appcues-id', url);
  }

  isLoaded() {
    return !!window.Appcues;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const { userId } = rudderElement.message;
    // iterate through traits and flatten any properties that are objects or arrays
    Object.keys(traits).forEach(key => {
      if (traits[key] && typeof traits[key] === 'object') {
        Object.keys(traits[key]).forEach(subKey => {
          traits[`${key}.${subKey}`] = traits[key][subKey];
        });
        delete traits[key];
      }
    });
    if (userId) {
      window.Appcues.identify(userId, traits);
    } else {
      logger.error('user id is required');
    }
  }

  track(rudderElement) {
    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    if (eventName) {
      window.Appcues.track(eventName, properties);
    } else {
      logger.error('event name is required');
    }
  }

  page(rudderElement) {
    const { properties, name } = rudderElement.message;
    window.Appcues.page(name, properties);
  }

  // docs: https://docs.appcues.com/en_US/dev-installing-appcues/installation-overview-for-developers#identifying-groups-15
  group(rudderElement) {
    const { groupId, traits } = rudderElement.message;
    if (!isDefinedAndNotNullAndNotEmpty(groupId)) {
      logger.error('group id is required');
      return;
    }
    window.Appcues.group(
      groupId, // unique, required
      traits,
    );
  }
}

export default Appcues;

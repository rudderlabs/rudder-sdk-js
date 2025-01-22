/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Sprig/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

class Sprig {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.environmentId = config.environmentId;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.environmentId);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    return !!window.Sprig;
  }

  isReady() {
    return !!window.Sprig;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { userId, context } = message;
    if (userId) {
      window.Sprig('setUserId', userId);
    }

    const email = get(message, 'context.traits.email');
    if (email) {
      window.Sprig('setEmail', email);
    }

    const { traits } = context;
    if (traits.email) {
      delete traits.email;
    }
    if (Object.keys(traits).length > 0) {
      window.Sprig('setAttributes', traits);
    }
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const { event, properties, userId } = message;
    if (!event) {
      logger.error('Event name is required for track call');
      return;
    }

    if (typeof event !== 'string') {
      logger.error('Event name should be string');
      return;
    }

    if (event.toLowerCase() === 'signed out') {
      window.Sprig('logoutUser');
    } else {
      const payload = { eventName: event };
      if (userId) {
        payload.userId = userId;
      }
      if (typeof properties === 'object' && Object.keys(properties).length > 0) {
        payload.properties = properties;
      }
      window.Sprig('identifyAndTrack', payload);
    }
  }
}

export default Sprig;

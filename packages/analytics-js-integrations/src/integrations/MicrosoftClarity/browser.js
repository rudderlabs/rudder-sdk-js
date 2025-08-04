import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
/* eslint-disable class-methods-use-this */

import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);
class MicrosoftClarity {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.projectId = config.projectId;
    this.cookieConsent = config.cookieConsent;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.cookieConsent, this.projectId);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    // queue would be undefined if the Clarity script is loaded
    return !!window.clarity && !window.clarity.q;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { userId, context } = message;
    if (!userId) {
      logger.error('userId is required for an identify call');
      return;
    }
    let sessionId;
    let customPageId;
    if (context?.sessionId) {
      sessionId = context.sessionId;
    }
    if (context?.traits?.customPageId) {
      customPageId = context.traits.customPageId;
    }

    const identifyPromise = window.clarity('identify', userId, sessionId, customPageId);
    if (typeof identifyPromise?.then === 'function') {
      // Clarity SDK is ready
      identifyPromise.catch(error => {
        logger.error('The "identify" promise was rejected', error);
      });
    }
    if (context?.traits) {
      const { traits } = context;
      const keys = Object.keys(traits);
      keys.forEach(key => {
        window.clarity('set', key, traits[key]);
      });
    }
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const { event } = message;
    if (!event || typeof event !== 'string' || event.trim() === '') {
      logger.error('event name is required for track call');
      return;
    }

    // Send the custom event to Microsoft Clarity
    // https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api#add-custom-events
    // Note: Clarity custom events only support event names, not event properties
    window.clarity('event', event);
  }
}

export default MicrosoftClarity;

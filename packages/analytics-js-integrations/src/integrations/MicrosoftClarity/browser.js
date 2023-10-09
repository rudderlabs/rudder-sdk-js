import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/MicrosoftClarity/constants';
import Logger from '../../utils/logger';
/* eslint-disable class-methods-use-this */

import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);
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
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.clarity;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.clarity;
  }

  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);
    const { message } = rudderElement;
    const { userId, context } = message;
    if (!userId) {
      logger.error(`${DISPLAY_NAME} : userId is required for an identify call`);
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
    window.clarity('identify', userId, sessionId, customPageId);
    if (context?.traits) {
      const { traits } = context;
      const keys = Object.keys(traits);
      keys.forEach(key => {
        window.clarity('set', key, traits[key]);
      });
    }
  }
}

export default MicrosoftClarity;

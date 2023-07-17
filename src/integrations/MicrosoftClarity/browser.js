/* eslint-disable */
import { NAME } from './constants';
import Logger from '../../utils/logger';
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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    loadNativeSdk(window, document, 'clarity', 'script', this.projectId);
    if (this.cookieConsent) {
      window.clarity('consent');
    }
  }

  init() {
    logger.debug('===In init Microsoft Clarity===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Microsoft Clarity===');
    return !!window.clarity;
  }

  isReady() {
    logger.debug('===In isReady Microsoft Clarity===');
    return !!window.clarity;
  }

  identify(rudderElement) {
    logger.debug('===In Microsoft Clarity Identify===');
    const { message } = rudderElement;
    const { userId, context } = message;
    if (!userId) {
      logger.error('[Microsoft Clarity] :: userId is required for an identify call');
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
      keys.forEach((key) => {
        window.clarity('set', key, traits[key]);
      });
    }
  }
}

export default MicrosoftClarity;

/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

class ProfitWell {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.publicApiKey = config.publicApiKey;
    this.siteType = config.siteType;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init ProfitWell===');

    if (!this.publicApiKey) {
      logger.debug('===[ProfitWell]: Public API Key not found===');
      return;
    }

    window.publicApiKey = this.publicApiKey;

    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'profitwell-js');
    scriptTag.setAttribute('data-pw-auth', window.publicApiKey);
    document.body.appendChild(scriptTag);

    loadNativeSdk(
      window,
      document,
      'profitwell',
      'script',
      'https://public.profitwell.com/js/profitwell.js',
    );
  }

  isLoaded() {
    logger.debug('===In isLoaded ProfitWell===');
    return !!(window.profitwell && window.profitwell.length !== 0);
  }

  isReady() {
    logger.debug('===In isReady ProfitWell===');
    return !!(window.profitwell && window.profitwell.length !== 0);
  }

  identify(rudderElement) {
    logger.debug('===In ProfitWell identify===');

    if (this.siteType === 'marketing') {
      window.profitwell('start', {});
      return;
    }

    const { message } = rudderElement;
    const email = get(message, 'context.traits.email');
    if (email) {
      window.profitwell('start', {
        user_email: email,
      });
      return;
    }

    const userId = get(message, 'userId');
    if (userId) {
      window.profitwell('start', {
        user_id: userId,
      });
      return;
    }

    logger.debug('===[ProfitWell]: email or userId is required for identify===');
  }
}

export default ProfitWell;

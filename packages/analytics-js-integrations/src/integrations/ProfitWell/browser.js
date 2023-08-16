/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/utilsV1/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/ProfitWell/constants';

class ProfitWell {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.publicApiKey = config.publicApiKey;
    this.siteType = config.siteType;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
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

    (function (i, s, o, g, r, a, m) {
      i[o] =
        i[o] ||
        function () {
          (i[o].q = i[o].q || []).push(arguments);
        };
      a = s.createElement(g);
      m = s.getElementsByTagName(g)[0];
      a.async = 1;
      a.setAttribute('data-loader', LOAD_ORIGIN);
      a.src = `${r}?auth=${window.publicApiKey}`;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'profitwell', 'script', 'https://public.profitwell.com/js/profitwell.js');
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

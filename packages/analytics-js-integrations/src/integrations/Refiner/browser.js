import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Refiner/constants';
import { replaceUserTraits, replaceAccountTraits } from './utils';

class Refiner {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.apiKey = config.webClientApiKey;
    this.userAttributesMapping = config.userAttributesMapping;
    this.accountAttributesMapping = config.accountAttributesMapping;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    window._refinerQueue = window._refinerQueue || [];
    this._refiner = function () {
      window._refinerQueue.push(arguments);
    };
    (function () {
      var a = document.createElement('script');
      a.setAttribute('data-loader', LOAD_ORIGIN);
      a.type = 'text/javascript';
      a.async = !0;
      a.src = 'https://js.refiner.io/v001/client.js';
      var b = document.getElementsByTagName('script')[0];
      b.parentNode.insertBefore(a, b);
    })();
    this._refiner('setProject', this.apiKey);
  }

  init() {
    logger.debug('===In init Refiner===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Refiner===');
    return !!this._refiner;
  }

  isReady() {
    logger.debug('===In isReady Refiner===');
    return !!this._refiner;
  }

  identify(rudderElement) {
    logger.debug('===In Refiner Identify===');
    const { message } = rudderElement;
    const { userId, traits, context } = message;
    const email = message.traits?.email || message.context?.traits?.email;
    if (!userId && !email) {
      logger.error('either one userId or email is required');
      return;
    }
    let userTraits = {
      ...traits,
      ...context.traits,
      email,
    };
    userTraits = replaceUserTraits(userTraits, this.userAttributesMapping);
    this._refiner('identifyUser', {
      id: userId,
      ...userTraits,
    });
  }

  track(rudderElement) {
    logger.debug('===In Refiner track===');
    const { event } = rudderElement.message;
    this._refiner('trackEvent', event);
  }

  group(rudderElement) {
    logger.debug('===In Refiner Group===');
    const { message } = rudderElement;
    const { userId, groupId, traits } = message;
    const userEmail = message.context?.traits?.email;
    if (!userId && !userEmail) {
      logger.error('either one userId or email is required');
      return;
    }
    let accountTraits = { ...traits };
    accountTraits = replaceAccountTraits(accountTraits, this.accountAttributesMapping);
    this._refiner('identifyUser', {
      id: userId,
      email: userEmail,
      account: {
        id: groupId,
        ...accountTraits,
      },
    });
  }

  page(rudderElement) {
    logger.debug('===In Refiner page===');
    const { message } = rudderElement;
    let pageFullName;
    if (!message.name && !message.category) {
      pageFullName = `pageView`;
    } else if (!message.name && message.category) {
      pageFullName = `Viewed ${message.category} Page`;
    } else if (message.name && !message.category) {
      pageFullName = `Viewed ${message.name} Page`;
    } else {
      pageFullName = `Viewed ${message.category} ${message.name} Page`;
    }
    this._refiner('trackEvent', pageFullName);
  }
}

export default Refiner;

/* eslint-disable no-underscore-dangle */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Refiner/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';
import { replaceUserTraits, replaceAccountTraits } from './utils';

const logger = new Logger(NAME);

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
    loadNativeSdk(this.apiKey);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!this._refiner;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!this._refiner;
  }

  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);

    const { message } = rudderElement;
    const { userId, traits, context } = message;
    const email = traits?.email || context?.traits?.email;
    if (!userId && !email) {
      logger.error(`${DISPLAY_NAME} : Either userId or email is required`);
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
    logger.debug(`In ${DISPLAY_NAME} track`);

    const { event } = rudderElement.message;

    if (!event) {
      logger.error(`${DISPLAY_NAME} : Event name not present`);
      return;
    }

    if (typeof event !== 'string') {
      logger.error(`${DISPLAY_NAME} : Event name should be string`);
      return;
    }

    this._refiner('trackEvent', event);
  }

  group(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} group`);

    const { message } = rudderElement;
    const { userId, groupId, traits, context } = message;
    const userEmail = context?.traits?.email;
    if (!userId && !userEmail) {
      logger.error(`${DISPLAY_NAME} : Either one userId or email is required`);
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
    logger.debug(`In ${DISPLAY_NAME} page`);

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

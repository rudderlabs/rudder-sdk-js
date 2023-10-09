/* eslint-disable class-methods-use-this */
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Webengage/constants';

import { loadNativeSdk } from './nativeSdkLoader';
import { setSystemAttributes, setCustomAttributes } from './utils';

class Webengage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.webengageLicenseCode = config.webengageLicenseCode;
    this.dataCentre = config.dataCentre;
    this.hashEmail = config.hashEmail;
    this.hashPhone = config.hashPhone;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.webengageLicenseCode, this.dataCentre);
  }

  init() {
    logger.debug('===In init Webengage===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Webengage===');
    return !!window.webengage && typeof window.webengage === 'function';
  }

  isReady() {
    logger.debug('===In isReady Webengage===');
    return !!window.webengage;
  }

  // identify call to webengage
  identify(rudderElement) {
    const { message } = rudderElement;
    logger.debug('===In identify Webengage===');
    const { userId } = message;
    window.webengage.user.login(userId);
    setSystemAttributes(window.webengage, message, config);
    setCustomAttributes(window.webengage, message);
  }

  // track call to webengage
  track(rudderElement) {
    logger.debug('===In track Webengage===');
    const { event, properties } = rudderElement.message;
    window.webengage.track(event, properties);
  }
}

export default Webengage;

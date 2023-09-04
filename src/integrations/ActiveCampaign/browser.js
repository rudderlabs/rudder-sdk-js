/* eslint-disable class-methods-use-this */
import { NAME } from './constants';
import logger from '../../utils/logUtil';
import { loadNativeSdk } from './nativeSdkLoader';
import get from "get-value";

class ActiveCampaign {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.actId = config.actid;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===In init ActiveCampaign===');

    if (!this.actId) {
      logger.debug('actId missing');
      return;
    }
    loadNativeSdk(this.actId);
  }

  isLoaded() {
    logger.debug('===In isLoaded ActiveCampaign===');
    return !!window.vgo;
  }

  isReady() {
    logger.debug('===In isReady ActiveCampaign===');
    return !!window.vgo;
  }

  page(rudderElement) {
    const { message } = rudderElement;
    const email = get(message, 'context.traits.email') || get(message, 'traits.email');

    if (email) {
      window.vgo('setEmail', email);
    }
    window.vgo('process');
  }
}

export default ActiveCampaign;

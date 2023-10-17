/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/ActiveCampaign/constants';
import get from 'get-value';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

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
    if (!this.actId) {
      logger.error('actId is required');
      return;
    }
    loadNativeSdk(this.actId);
  }

  isLoaded() {
    return !!window.vgo;
  }

  isReady() {
    return this.isLoaded();
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

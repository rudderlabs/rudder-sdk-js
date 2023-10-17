/* eslint-disable class-methods-use-this */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/ProfitWell/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

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
    if (!this.publicApiKey) {
      logger.error('Public API Key not found');
      return;
    }
    loadNativeSdk(this.publicApiKey);
  }

  isLoaded() {
    return !!(window.profitwell && window.profitwell.length > 0);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
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

    logger.info('email or userId is required for identify');
  }
}

export default ProfitWell;

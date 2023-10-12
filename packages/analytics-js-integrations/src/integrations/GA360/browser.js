/**
 * Purpose of this integration:
 * GA 360 is the enterprise version of Google Analytics. It is not different from GA. But in order Work GA 360 as
 * device-mode integration and maintain the same structure with others created this integration.
 * This GA360 class inherited all the properties from the GA class and whenever a method of this class is called,
 * underlying GA method will get called.
 */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/GA360/constants';
import Logger from '../../utils/logger';
import { GA } from '../GA';

const logger = new Logger(DISPLAY_NAME);

class GA360 extends GA {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    super(config, analytics, destinationInfo);
    this.analytics = analytics;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    return super.init();
  }

  isLoaded() {
    logger.debug('In isLoaded');
    return super.isLoaded();
  }

  isReady() {
    logger.debug('In isReady');
    return super.isReady();
  }

  identify(rudderElement) {
    logger.debug('In identify');
    return super.identify(rudderElement);
  }

  track(rudderElement) {
    logger.debug('In track');
    return super.track(rudderElement);
  }

  page(rudderElement) {
    logger.debug('In page');
    return super.page(rudderElement);
  }
}

export { GA360 };

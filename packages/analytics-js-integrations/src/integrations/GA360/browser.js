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
    return super.isLoaded();
  }

  isReady() {
    return super.isReady();
  }

  identify(rudderElement) {
    return super.identify(rudderElement);
  }

  track(rudderElement) {
    return super.track(rudderElement);
  }

  page(rudderElement) {
    return super.page(rudderElement);
  }
}

export default GA360;

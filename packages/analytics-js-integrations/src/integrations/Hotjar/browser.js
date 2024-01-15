/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Hotjar/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Hotjar {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteID;
    this.name = NAME;
    this._ready = false;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.siteId);
    this._ready = true;
  }

  isLoaded() {
    return this._ready;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId) {
      logger.error('user id is required for an identify call');
      return;
    }

    const { traits } = rudderElement.message.context;

    window.hj('identify', rudderElement.message.userId, traits);
  }

  track(rudderElement) {
    let { event } = rudderElement.message;

    if (!event) {
      logger.error('Event name is not present');
      return;
    }

    if (typeof event !== 'string') {
      logger.error('Event name should be string');
      return;
    }

    // event name must not exceed 750 characters and can only contain alphanumeric, underscores, and dashes.
    // Ref - https://help.hotjar.com/hc/en-us/articles/4405109971095#the-events-api-call
    if (event.length > 750) {
      event = event.substring(0, 750);
    }
    event = event.replace(/ /g, '_');

    if (event) {
      window.hj('event', event);
    }
  }
}

export default Hotjar;

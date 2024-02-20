/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Ninetailed/constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);
class Ninetailed {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    // We expect the customer to load the SDK through NPM package
    // Docs: https://docs.ninetailed.io/for-developers/experience-sdk/getting-started
  }

  isLoaded() {
    return !!window.ninetailed;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { userId, traits, context } = message;
    const userTraits = { ...traits, ...context?.traits };
    // for userId: until we don't pass the id to ninetailed, it will not make server identify call but is accepting the data
    window.ninetailed.identify(userId, userTraits);
  }
  track(rudderElement) {
    const { message } = rudderElement;
    const { properties, event } = message;
    if (!event) {
      logger.error('Event name is required');
      return;
    }
    window.ninetailed.track(event, properties);
  }
  page(rudderElement) {
    const { message } = rudderElement;
    const { properties } = message;
    if (properties) {
      properties.url = window.location.href;
      window.ninetailed.page(properties);
      return;
    }
    window.ninetailed.page();
  }
}

export default Ninetailed;

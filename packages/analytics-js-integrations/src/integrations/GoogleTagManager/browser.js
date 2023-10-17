/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/GoogleTagManager/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class GoogleTagManager {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.containerID = config.containerID;
    this.name = NAME;
    this.serverUrl = config.serverUrl;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.containerID, this.serverUrl);
  }

  isLoaded() {
    return !!(window.dataLayer && Array.prototype.push !== window.dataLayer.push);
  }

  sendToGTMDatalayer(props) {
    window.dataLayer.push(props);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    // set the traits to the datalayer and put everything under the key traits
    // keeping it under the traits key as destructing might conflict with `message.properties`
    const rudderMessage = rudderElement.message;
    const props = { traits: rudderMessage.context.traits };
    this.sendToGTMDatalayer(props);
  }

  track(rudderElement) {
    const rudderMessage = rudderElement.message;
    const props = {
      event: rudderMessage.event,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      // set the traits as well if there is any
      // it'll be null/undefined before identify call is made
      traits: rudderMessage.context.traits,
      ...rudderMessage.properties,
    };
    this.sendToGTMDatalayer(props);
  }

  page(rudderElement) {
    const rudderMessage = rudderElement.message;
    const pageName = rudderMessage.name;
    const pageCategory = rudderMessage.properties ? rudderMessage.properties.category : undefined;

    let eventName;

    if (pageName) {
      eventName = `Viewed ${pageName} page`;
    }

    if (pageCategory && pageName) {
      eventName = `Viewed ${pageCategory} ${pageName} page`;
    }
    if (!eventName) {
      eventName = 'Viewed a Page';
    }
    const props = {
      event: eventName,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      // set the traits as well if there is any
      // it'll be null/undefined before identify call is made
      traits: rudderMessage.context.traits,
      ...rudderMessage.properties,
    };

    this.sendToGTMDatalayer(props);
  }
}

export { GoogleTagManager };

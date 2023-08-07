/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import ScriptLoader from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Appcues/constants';

class Appcues {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.apiKey = config.apiKey;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
    // this.sendToAllDestinations = config.sendToAll;
  }

  init() {
    logger.debug('===in init Appcues===');
    ScriptLoader('appcues-id', `https://fast.appcues.com/${this.accountId}.js`);
  }

  isLoaded() {
    logger.debug('in appcues isLoaded');
    return !!window.Appcues;
  }

  isReady() {
    logger.debug('in appcues isReady');
    // This block of code enables us to send Appcues Flow events to all the other destinations connected to the same source (we might use it in future)
    // if (this.sendToAllDestinations && window.Appcues) {
    //   window.Appcues.on("all", function(eventName, event) {
    //     this.analytics.track(eventName, event, {
    //       integrations: {
    //         All: true,
    //         APPCUES: false
    //       }
    //     });
    //   });
    // }
    return !!window.Appcues;
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const { userId } = rudderElement.message;
    if (userId) {
      window.Appcues.identify(userId, traits);
    } else {
      logger.error('user id is empty');
    }
  }

  track(rudderElement) {
    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    if (eventName) {
      window.Appcues.track(eventName, properties);
    } else {
      logger.error('event name is empty');
    }
  }

  page(rudderElement) {
    const { properties, name } = rudderElement.message;
    window.Appcues.page(name, properties);
  }

  // To be uncommented after adding Reset feature to our SDK
  // reset() {
  //   window.Appcues.reset();
  // }
}

export default Appcues;

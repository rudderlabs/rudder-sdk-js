/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/CustomerIO/constants';
import { loadNativeSdk } from './nativeSdkLoader';

class CustomerIO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteID = config.siteID;
    this.apiKey = config.apiKey;
    this.datacenterEU = config.datacenterEU;
    this.sendPageNameInSDK = config.sendPageNameInSDK;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===in init Customer IO init===');
    const { siteID, datacenterEU } = this;
    loadNativeSdk(siteID, datacenterEU);
  }

  identify(rudderElement) {
    logger.debug('in Customer IO identify');
    const userId = rudderElement.message.userId
      ? rudderElement.message.userId
      : rudderElement.message.anonymousId;
    const traits = rudderElement.message.context.traits ? rudderElement.message.context.traits : {};
    const createAt = traits.createdAt;
    if (createAt) {
      traits.created_at = Math.floor(new Date(createAt).getTime() / 1000);
    }
    traits.id = userId;
    window._cio.identify(traits);
  }

  track(rudderElement) {
    logger.debug('in Customer IO track');

    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    window._cio.track(eventName, properties);
  }

  page(rudderElement) {
    logger.debug('in Customer IO page');
    if (this.sendPageNameInSDK === false) {
      window._cio.page(rudderElement.message.properties);
    } else {
      const name = rudderElement.message.name || rudderElement.message.properties.url;
      window._cio.page(name, rudderElement.message.properties);
    }
  }

  isLoaded() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }
}

export { CustomerIO };
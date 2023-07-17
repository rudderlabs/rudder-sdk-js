/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

class CustomerIO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteID = config.siteID;
    this.apiKey = config.apiKey;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Customer IO init===');
    window._cio = window._cio || [];
    const { siteID } = this;
    loadNativeSdk(siteID);
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

    const name = rudderElement.message.name || rudderElement.message.properties.url;
    window._cio.page(name, rudderElement.message.properties);
  }

  isLoaded() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }
}

export { CustomerIO };

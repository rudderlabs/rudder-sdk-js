/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/CustomerIO/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

class CustomerIO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteID = config.siteID;
    this.apiKey = config.apiKey;
    this.datacenterEU = config.datacenterEU;
    this.datacenter = config.datacenter;
    this.sendPageNameInSDK = config.sendPageNameInSDK;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const { siteID, datacenter, datacenterEU } = this;
    loadNativeSdk(siteID, datacenter, datacenterEU);
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);
    const { userId, context } = rudderElement.message;
    const { traits } = context || {};
    if (!userId) {
      logger.error(`${DISPLAY_NAME} : userId is required for Identify call`);
      return;
    }
    const createAt = traits.createdAt;
    if (createAt) {
      traits.created_at = Math.floor(new Date(createAt).getTime() / 1000);
    }
    traits.id = userId;
    window._cio.identify(traits);
  }

  track(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} track`);

    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    window._cio.track(eventName, properties);
  }

  page(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} page`);
    if (this.sendPageNameInSDK === false) {
      window._cio.page(rudderElement.message.properties);
    } else {
      const name = rudderElement.message.name || rudderElement.message.properties.url;
      window._cio.page(name, rudderElement.message.properties);
    }
  }
}

export { CustomerIO };

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/CustomerIO/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class CustomerIO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    const {
      dataUseInApp = false,
      siteID,
      apiKey,
      datacenterEU,
      datacenter,
      sendPageNameInSDK,
    } = config;

    this.analytics = analytics;
    this.siteID = siteID;
    this.apiKey = apiKey;
    this.datacenterEU = datacenterEU;
    this.datacenter = datacenter;
    this.sendPageNameInSDK = sendPageNameInSDK;
    this.dataUseInApp = dataUseInApp;
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
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { userId, context } = rudderElement.message;
    const { traits } = context || {};
    if (!userId) {
      logger.error('userId is required for Identify call');
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
    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    window._cio.track(eventName, properties);
  }

  page(rudderElement) {
    if (this.sendPageNameInSDK === false) {
      window._cio.page(rudderElement.message.properties);
    } else {
      const name = rudderElement.message.name || rudderElement.message.properties.url;
      window._cio.page(name, rudderElement.message.properties);
    }
  }
}

export { CustomerIO };

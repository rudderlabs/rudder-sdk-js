import { NAME, DISPLAY_NAME, SDK_V2, V2_GLOBAL_NAME, IN_APP_PLUGIN_KEY } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdkV1, loadNativeSdkV2 } from './nativeSdkLoader';
import { getSdkVersion } from './utils';

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
      datacenter,
      sendPageNameInSDK,
      writeKey,
      anonymousInApp,
    } = config;

    this.analytics = analytics;
    this.siteID = siteID;
    this.apiKey = apiKey;
    this.datacenter = datacenter;
    this.sendPageNameInSDK = sendPageNameInSDK;
    this.dataUseInApp = dataUseInApp;
    this.sdkVersion = getSdkVersion(config);
    this.writeKey = writeKey;
    this.anonymousInApp = anonymousInApp === true;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (this.sdkVersion === SDK_V2) {
      this.initV2();
      return;
    }
    const { siteID, datacenter, dataUseInApp } = this;
    loadNativeSdkV1(siteID, datacenter, dataUseInApp);
  }

  initV2() {
    const { writeKey, datacenter, anonymousInApp, analytics } = this;
    if (!writeKey) {
      logger.error(
        'writeKey is required to load the Customer.io JavaScript client (SDK version 2.x); aborting load',
      );
      return;
    }
    // Known-user in-app needs no client option (workspace setting). Anonymous in-app is an
    // explicit opt-in, and it is the only reason to hand the In-App Plugin any options: the
    // plugin's `siteId` comes from Customer.io's own settings for the write key, never from us.
    const loadOptions = anonymousInApp
      ? { integrations: { [IN_APP_PLUGIN_KEY]: { anonymousInApp: true } } }
      : {};
    loadNativeSdkV2(writeKey, datacenter, loadOptions);

    // Keep RudderStack's and Customer.io's anonymous identities aligned. The stub queues this
    // until the client loads, so it is applied before any event.
    const anonymousId = analytics.getAnonymousId?.();
    if (anonymousId) {
      window[V2_GLOBAL_NAME].setAnonymousId(anonymousId);
    }
  }

  isLoaded() {
    if (this.sdkVersion === SDK_V2) {
      return window[V2_GLOBAL_NAME]?.initialized === true;
    }
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  /**
   * The loaded client for the configured version. Undefined only if `init()` aborted (2.x
   * without a write key); `isReady()` is false then, so callers treat it as a no-op.
   */
  getNativeClient() {
    return this.sdkVersion === SDK_V2 ? window[V2_GLOBAL_NAME] : window._cio;
  }

  identify(rudderElement) {
    const { userId, context } = rudderElement.message;
    const traits = context?.traits ?? {};
    if (!userId) {
      logger.error('userId is required for Identify call');
      return;
    }
    const client = this.getNativeClient();
    if (!client) {
      return;
    }
    const createAt = traits.createdAt;
    if (createAt) {
      traits.created_at = Math.floor(new Date(createAt).getTime() / 1000);
    }
    if (this.sdkVersion === SDK_V2) {
      // The new client takes the id as its own argument, separate from the traits.
      client.identify(userId, traits);
      return;
    }
    traits.id = userId;
    client.identify(traits);
  }

  track(rudderElement) {
    const client = this.getNativeClient();
    if (!client) {
      return;
    }
    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    client.track(eventName, properties);
  }

  page(rudderElement) {
    const client = this.getNativeClient();
    if (!client) {
      return;
    }
    if (this.sendPageNameInSDK === false) {
      client.page(rudderElement.message.properties);
    } else {
      const name = rudderElement.message.name || rudderElement.message.properties.url;
      client.page(name, rudderElement.message.properties);
    }
  }
}

export default CustomerIO;

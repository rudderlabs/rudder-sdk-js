/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
} from './constants';
import { resolveVendorSdkVersionPolicy } from '@rudderstack/analytics-js-common/utilities/vendorSdkVersionPolicy';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);

class Bugsnag {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.releaseStage = config.releaseStage;
    this.apiKey = config.apiKey;
    this.name = NAME;
    this.setIntervalHandler = undefined;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const policy = resolveVendorSdkVersionPolicy(this.analytics.loadOnlyIntegrations, DISPLAY_NAME);
    ScriptLoader(
      'bugsnag-id',
      policy === 'floating' ? VENDOR_SDK_FLOATING_URL : VENDOR_SDK_PINNED_URL,
      policy === 'floating' ? {} : { integrity: VENDOR_SDK_INTEGRITY, crossOrigin: 'anonymous' },
    );

    this.setIntervalHandler = setInterval(this.initBugsnagClient.bind(this), 1000);
  }

  initBugsnagClient() {
    if (window.bugsnag !== undefined) {
      window.bugsnagClient = window.bugsnag(this.apiKey);
      window.bugsnagClient.releaseStage = this.releaseStage;
      clearInterval(this.setIntervalHandler);
    }
  }

  isLoaded() {
    return !!window.bugsnagClient;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const traitsFinal = {
      id: rudderElement.message.userId || rudderElement.message.anonymousId,
      name: traits.name,
      email: traits.email,
    };

    window.bugsnagClient.user = traitsFinal;
    window.bugsnagClient.notify(new Error('error in identify'));
  }
}
export default Bugsnag;

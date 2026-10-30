/* eslint-disable class-methods-use-this */
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_INTEGRITY,
  VENDOR_SDK_FLOATING_URL,
} from './constants';
import { resolveVendorSdkVersionPolicy } from '@rudderstack/analytics-js-common/utilities/vendorSdkVersionPolicy';
import Logger from '../../utils/logger';
import { createUser, getDestinationOptions } from './utils';

const logger = new Logger(DISPLAY_NAME);

class LaunchDarkly {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.clientSideId = config.clientSideId;
    this.anonymousUsersSharedKey = config.anonymousUsersSharedKey;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.clientSideId) {
      logger.error(
        `${this.name} :: Unable to initialize destination - clientSideId is missing in config`,
      );
      return;
    }
    const policy = resolveVendorSdkVersionPolicy(this.analytics.loadOnlyIntegrations, DISPLAY_NAME);
    ScriptLoader(
      null,
      policy === 'floating' ? VENDOR_SDK_FLOATING_URL : VENDOR_SDK_PINNED_URL,
      policy === 'floating' ? {} : { integrity: VENDOR_SDK_INTEGRITY, crossOrigin: 'anonymous' },
    );
  }

  isLoaded() {
    return !!window.LDClient;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const launchDarklyIntgConfig = getDestinationOptions(message.integrations);
    const anonymousUsersSharedKey = launchDarklyIntgConfig?.key || this.anonymousUsersSharedKey;
    this.launchDarklyUser = createUser(message, anonymousUsersSharedKey);

    if (window.ldclient) {
      window.ldclient.identify(this.launchDarklyUser);
    } else {
      window.ldclient = window.LDClient.initialize(this.clientSideId, this.launchDarklyUser);
    }
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (window.ldclient) {
      window.ldclient.track(event, properties);
    } else logger.error('track is not supported before identify');
  }

  alias(rudderElement) {
    const { message } = rudderElement;
    const newUser = { key: message.userId };

    if (window.ldclient) {
      window.ldclient.alias(newUser, this.launchDarklyUser);
    } else logger.error('alias is not supported before identify');
  }
}
export default LaunchDarkly;

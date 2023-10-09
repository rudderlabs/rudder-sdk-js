/* eslint-disable class-methods-use-this */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/LaunchDarkly/constants';
import Logger from '../../utils/logger';
import { createUser, getDestinationOptions } from './utils';

const logger = new Logger(NAME);

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
    ScriptLoader(null, 'https://unpkg.com/launchdarkly-js-client-sdk@2');
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.LDClient;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
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
    } else logger.error(`${DISPLAY_NAME} : track is not supported before identify`);
  }

  alias(rudderElement) {
    const { message } = rudderElement;
    const newUser = { key: message.userId };

    if (window.ldclient) {
      window.ldclient.alias(newUser, this.launchDarklyUser);
    } else logger.error(`${DISPLAY_NAME} : alias is not supported before identify`);
  }
}
export default LaunchDarkly;

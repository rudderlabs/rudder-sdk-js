/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import ScriptLoader from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/LaunchDarkly/constants';
import createUser from './utils';

class LaunchDarkly {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.clientSideId = config.clientSideId;
    this.anonymousUsersSharedKey = config.anonymousUsersSharedKey;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init LaunchDarkly===');
    if (!this.clientSideId) {
      logger.error(
        `${this.name} :: Unable to initialize destination - clientSideId is missing in config`,
      );
      return;
    }
    ScriptLoader(null, 'https://unpkg.com/launchdarkly-js-client-sdk@2');
  }

  isLoaded() {
    logger.debug('===In isLoaded LaunchDarkly===');
    return !!window.LDClient;
  }

  isReady() {
    logger.debug('===In isReady LaunchDarkly===');
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const anonymousUsersSharedKey =
      get(message, `integrations.${NAME}.key`) || this.anonymousUsersSharedKey;
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
    } else logger.error('=== In LaunchDarkly, track is not supported before identify ===');
  }

  alias(rudderElement) {
    const { message } = rudderElement;
    const newUser = { key: message.userId };

    if (window.ldclient) {
      window.ldclient.alias(newUser, this.launchDarklyUser);
    } else logger.error('=== In LaunchDarkly, alias is not supported before identify ===');
  }
}
export default LaunchDarkly;

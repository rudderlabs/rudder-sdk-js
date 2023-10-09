/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Bugsnag/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';

const logger = new Logger(NAME);

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
    ScriptLoader('bugsnag-id', 'https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js');

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
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.bugsnagClient;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.bugsnagClient;
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
export { Bugsnag };

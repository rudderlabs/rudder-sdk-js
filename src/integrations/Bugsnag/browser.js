/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import { NAME } from './constants';

class Bugsnag {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.releaseStage = config.releaseStage;
    this.apiKey = config.apiKey;
    this.name = NAME;
    this.setIntervalHandler = undefined;
    this.areTransformationsConnected = destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Bugsnag===');
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
    logger.debug('in bugsnag isLoaded');
    return !!window.bugsnagClient;
  }

  isReady() {
    logger.debug('in bugsnag isReady');
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

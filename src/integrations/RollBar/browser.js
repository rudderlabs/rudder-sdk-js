/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

import { isObject } from '../../utils/utils';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

class RollBar {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.accessToken = config.accessToken;
    this.captureUncaughtException = config.captureUncaughtException;
    this.captureUnhandledRejections = config.captureUnhandledRejections;
    this.guessUncaughtFrames = config.guessUncaughtFrames;
    this.codeVersion = !config.codeVersion ? '' : config.codeVersion;
    this.ignoredMessages = config.ignoredMessages;
    this.environment = config.environment;
    this.sourceMapEnabled = config.sourceMapEnabled;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init RollBar===');
    var _rollbarConfig = {
      accessToken: this.accessToken,
      captureUncaught: this.captureUncaughtException,
      captureUnhandledRejections: this.captureUnhandledRejections,
      payload: {
        environment: this.environment,
        client: {
          javascript: {
            code_version: this.codeVersion,
            source_map_enabled: this.sourceMapEnabled,
            guess_uncaught_frames: this.guessUncaughtFrames,
          },
        },
      },
    };
    var msg = this.ignoredMessages;
    if (msg.length > 0) {
      var ret = [];
      // clean out array
      for (var x = 0; x < msg.length; x++) {
        if (msg[x] !== null && msg[x].singleIgnoredMessage !== '')
          ret.push(msg[x].singleIgnoredMessage);
      }
      _rollbarConfig.ignoredMessages = ret;
    }

    loadNativeSdk(_rollbarConfig);
  }

  isLoaded() {
    logger.debug('===In isLoaded RollBar===');
    return !!(window.Rollbar && isObject(window.Rollbar));
  }

  isReady() {
    logger.debug('===In isReady RollBar===');

    return !!window.Rollbar;
  }

  identify(rudderElement) {
    logger.debug('===In RollBar Identify===');
    const { message } = rudderElement;
    const { userId } = message;
    const { traits } = rudderElement.message.context;

    const person = traits;
    if (person.name) {
      person.username = person.name;
      delete person.name;
    }
    if (userId) person.id = userId;
    else logger.debug('=== userId is not found. no new user will be created in rollbar');
    window.Rollbar.configure({ payload: { person } });
  }
}

export default RollBar;

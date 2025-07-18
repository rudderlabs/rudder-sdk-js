/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { isObject } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const _rollbarConfig = {
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
    const { ignoredMessages } = this;
    if (ignoredMessages.length > 0) {
      const ret = [];
      // clean out array
      ignoredMessages.forEach(message => {
        if (
          ignoredMessages[message] !== null &&
          ignoredMessages[message].singleIgnoredMessage !== ''
        )
          ret.push(ignoredMessages[message].singleIgnoredMessage);
      });
      _rollbarConfig.ignoredMessages = ret;
    }

    loadNativeSdk(_rollbarConfig);
  }

  isLoaded() {
    return !!(window.Rollbar && isObject(window.Rollbar));
  }

  isReady() {
    return !!window.Rollbar;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { userId, context } = message;
    const { traits } = context;

    const person = traits;
    if (person.name) {
      person.username = person.name;
      delete person.name;
    }
    if (userId) person.id = userId;
    else logger.info('userId is not found. no new user will be created in rollbar');
    window.Rollbar.configure({ payload: { person } });
  }
}

export default RollBar;

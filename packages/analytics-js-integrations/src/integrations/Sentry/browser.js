/* eslint-disable class-methods-use-this */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Sentry/constants';
import Logger from '../../utils/logger';
import { SentryScriptLoader, sentryInit } from './utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { getDefinedTraits, isObject } from '../../utils/utils';

const logger = new Logger(DISPLAY_NAME);

class Sentry {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.dsn = config.dsn;
    this.debugMode = config.debugMode;
    this.environment = config.environment;
    this.ignoreErrors = config.ignoreErrors;
    this.includePathsArray = config.includePaths;
    this.logger = config.logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.customVersionProperty = config.customVersionProperty;
    this.serverName = config.serverName;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.dsn) {
      logger.error('DSN is a mandatory field');
      return;
    }
    SentryScriptLoader(
      'sentry',
      `https://browser.sentry-cdn.com/6.13.1/bundle.min.js`,
      `sha384-vUP3nL55ipf9vVr3gDgKyDuYwcwOC8nZGAksntVhezPcr2QXl1Ls81oolaVSkPm+`,
    );

    SentryScriptLoader(
      'plugin',
      `https://browser.sentry-cdn.com/6.13.1/rewriteframes.min.js`,
      `sha384-WOm9k3kzVt1COFAB/zCXOFx4lDMtJh/2vmEizIwgog7OW0P/dPwl3s8f6MdwrD7q`,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    return !!(
      window.Sentry &&
      isObject(window.Sentry) &&
      window.Sentry.setUser &&
      window.Sentry.Integrations.RewriteFrames
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    if (
      window.Sentry &&
      isObject(window.Sentry) &&
      window.Sentry.setUser &&
      window.Sentry.Integrations.RewriteFrames
    ) {
      const sentryConfig = sentryInit(
        this.allowUrls,
        this.denyUrls,
        this.ignoreErrors,
        this.includePathsArray,
        this.customVersionProperty,
        this.release,
        this.dsn,
        this.debugMode,
        this.environment,
        this.serverName,
      );
      window.Sentry.init(sentryConfig);
      if (this.logger) {
        window.Sentry.setTag('logger', this.logger);
      }
      return true;
    }
    return false;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context;
    const { email, name } = getDefinedTraits(message); // userId sent as id and username sent as name
    const userId = get(message, 'userId');
    const ipAddress = get(message, 'context.traits.ip_address');

    if (!userId && !email && !name && !ipAddress) {
      // if no user identification property is present the event will be dropped
      logger.error('Any one of userId, email, name and ip_address is mandatory');
      return;
    }

    const payload = {
      id: userId,
      email,
      username: name,
      ip_address: ipAddress,
      ...traits,
    };

    window.Sentry.setUser(removeUndefinedAndNullValues(payload));
  }
}
export default Sentry;

import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
  SENTRY_SDK_ID,
  SENTRY_SDK_URL,
  SENTRY_SDK_INTEGRITY,
  SENTRY_REWRITE_FRAMES_ID,
  SENTRY_REWRITE_FRAMES_URL,
  SENTRY_REWRITE_FRAMES_INTEGRITY,
} from './constants';
import Logger from '../../utils/logger';
import { SentryScriptLoader, sentryInit } from './utils';
import {
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullValues,
} from '../../utils/commonUtils';
import { getDefinedTraits, isObject } from '../../utils/utils';

const logger = new Logger(DISPLAY_NAME);

const hasBaseSdk = () =>
  !!(window.Sentry && isObject(window.Sentry) && window.Sentry.init && window.Sentry.setUser);

const hasRewriteFramesIntegration = () =>
  !!(window.Sentry?.rewriteFramesIntegration || window.Sentry?.Integrations?.RewriteFrames);

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
    this.requiresRewriteFrames = this.includePathsArray?.some(({ includePaths } = {}) =>
      isDefinedAndNotNullAndNotEmpty(includePaths),
    );
    this.logger = config.logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.customVersionProperty = config.customVersionProperty;
    this.serverName = config.serverName;
    this.isInitialized = false;
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
    // Sentry's project loader URL is project-specific and cannot be derived from the existing
    // DSN-only destination contract, so load the versioned browser CDN artifacts directly.
    SentryScriptLoader(SENTRY_SDK_ID, SENTRY_SDK_URL, SENTRY_SDK_INTEGRITY, hasBaseSdk);
    if (this.requiresRewriteFrames) {
      SentryScriptLoader(
        SENTRY_REWRITE_FRAMES_ID,
        SENTRY_REWRITE_FRAMES_URL,
        SENTRY_REWRITE_FRAMES_INTEGRITY,
        hasRewriteFramesIntegration,
      );
    }
  }

  isLoaded() {
    return hasBaseSdk() && (!this.requiresRewriteFrames || hasRewriteFramesIntegration());
  }

  isReady() {
    if (this.isInitialized) {
      return true;
    }

    if (this.isLoaded()) {
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
      this.isInitialized = true;
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

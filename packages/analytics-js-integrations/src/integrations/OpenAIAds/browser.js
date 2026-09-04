import { DISPLAY_NAME, LOGGER_MESSAGES, NAME } from './constants';
import Logger from '../../utils/logger';
import { initPixel, isNativeSdkLoaded, loadNativeSdk } from './nativeSdkLoader';
import {
  buildEventData,
  buildUserData,
  getDeduplicationId,
  getObrefFromCookie,
  isEventFiltered,
  removeEmptyValues,
  resolveEvent,
  resolvePixelId,
} from './utils';

const logger = new Logger(DISPLAY_NAME);

const normalizeUserId = userId => {
  if (typeof userId === 'string') {
    return userId.trim();
  }
  if (typeof userId === 'number' || typeof userId === 'boolean') {
    return String(userId);
  }
  return '';
};

class OpenAIAds {
  constructor(config = {}, analytics = {}, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }

    this.name = NAME;
    this.analytics = analytics;
    this.config = config;
    this.pixelId = resolvePixelId(config);
    this.eventMapping = config.eventMapping || [];
    this.defaultCurrency = config.defaultCurrency;
    this.defaultActionSource = config.defaultActionSource;
    this.userData = {};
    this.cookieObref = undefined;
    this.currentUserId = '';

    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.pixelId) {
      logger.error(LOGGER_MESSAGES.MISSING_PIXEL_ID);
      return;
    }

    loadNativeSdk();
    initPixel(this.pixelId);
    this.currentUserId = normalizeUserId(this.analytics?.getUserId?.());
  }

  isLoaded() {
    return isNativeSdkLoaded();
  }

  isReady() {
    return this.isLoaded();
  }

  getPayloadConfig() {
    return {
      defaultCurrency: this.defaultCurrency,
      defaultActionSource: this.defaultActionSource,
      eventFilteringOption: this.config.eventFilteringOption,
      whitelistedEvents: this.config.whitelistedEvents,
      blacklistedEvents: this.config.blacklistedEvents,
    };
  }

  updatePixelUser(user, allowEmpty = false) {
    const cleanedUser = removeEmptyValues(user);
    if (Object.keys(cleanedUser).length > 0 || allowEmpty) {
      window.oaiq('init', { user: cleanedUser });
    }
  }

  // Mirrors the MoEngage integration pattern: clear vendor user state when the SDK user changes
  // or when a previously identified user becomes empty after logout/reset.
  shouldResetSession(userId) {
    return (
      (userId && this.currentUserId !== '' && this.currentUserId !== userId) ||
      (this.currentUserId !== '' && userId === '')
    );
  }

  resetSession(userId) {
    this.currentUserId = userId;
    this.userData = {};
    this.cookieObref = undefined;
    if (this.pixelId && typeof window.oaiq === 'function') {
      window.oaiq('init', { pixelId: this.pixelId, user: {} });
    }
  }

  syncUserId(message) {
    const userId = normalizeUserId(message?.userId);
    if (this.shouldResetSession(userId)) {
      this.resetSession(userId);
      return;
    }

    if (this.currentUserId === '' && userId) {
      this.currentUserId = userId;
    }
  }

  identify(rudderElement) {
    const message = rudderElement?.message || rudderElement || {};
    this.syncUserId(message);
    const user = buildUserData(message, logger);

    if (Object.keys(user).length === 0) {
      logger.error(LOGGER_MESSAGES.IDENTIFY_NO_USER_DATA);
      return;
    }

    this.userData = { ...this.userData, ...user };
    this.updatePixelUser(this.userData);
  }

  track(rudderElement) {
    this.sendConversionEvent(rudderElement, 'track');
  }

  page(rudderElement) {
    this.sendConversionEvent(rudderElement, 'page');
  }

  screen(rudderElement) {
    this.sendConversionEvent(rudderElement, 'screen');
  }

  sendConversionEvent(rudderElement, messageType) {
    const message = rudderElement?.message || rudderElement || {};
    this.syncUserId(message);
    const resolvedEvent = resolveEvent(message, messageType, this.eventMapping);

    if (resolvedEvent.error) {
      logger.error(resolvedEvent.error);
      return;
    }

    if (isEventFiltered(resolvedEvent.sourceKey, this.config)) {
      logger.info(LOGGER_MESSAGES.FILTERED_EVENT(resolvedEvent.sourceKey));
      return;
    }

    const eventDataResult = buildEventData(message, resolvedEvent, this.getPayloadConfig());
    if (eventDataResult.error) {
      logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(eventDataResult.error));
      return;
    }

    const eventUserData = buildUserData(message, logger);
    const cookieObref = getObrefFromCookie();
    const hasCookieObrefChanged = this.cookieObref !== cookieObref;
    const pixelUserData = { ...this.userData, ...eventUserData };
    if (cookieObref) {
      pixelUserData.obref = cookieObref;
    }
    if (Object.keys(eventUserData).length > 0 || hasCookieObrefChanged) {
      this.updatePixelUser(pixelUserData, hasCookieObrefChanged);
      this.cookieObref = cookieObref;
    }

    const deduplicationResult = getDeduplicationId(message, resolvedEvent.mappingRow);
    if (deduplicationResult.error) {
      logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(deduplicationResult.error));
      return;
    }

    const eventOptions = removeEmptyValues({
      id: deduplicationResult.id,
    });

    window.oaiq(
      'measureSingle',
      this.pixelId,
      resolvedEvent.eventName,
      eventDataResult.eventData,
      eventOptions,
    );
  }

}

export default OpenAIAds;

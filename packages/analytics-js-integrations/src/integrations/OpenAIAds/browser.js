import { DISPLAY_NAME, LOGGER_MESSAGES, NAME } from './constants';
import Logger from '../../utils/logger';
import { initPixel, isNativeSdkLoaded, loadNativeSdk } from './nativeSdkLoader';
import {
  buildEventData,
  buildUserData,
  getDeduplicationId,
  removeEmptyValues,
  resolveEvent,
} from './utils';

const logger = new Logger(DISPLAY_NAME);

class OpenAIAds {
  constructor(config = {}, analytics = {}, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }

    this.name = NAME;
    this.analytics = analytics;
    this.config = config;
    this.userData = {};
    this.currentUserId = '';
    this.pixelInitialized = false;

    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.ensurePixelInitialized()) {
      return;
    }

    this.currentUserId = this.analytics.getUserId?.() || '';
  }

  ensurePixelInitialized() {
    if (!this.config.pixelId) {
      logger.error(LOGGER_MESSAGES.MISSING_PIXEL_ID);
      return false;
    }

    if (!this.pixelInitialized || typeof window.oaiq !== 'function') {
      loadNativeSdk();
      initPixel(this.config.pixelId);
      this.pixelInitialized = true;
    }

    return true;
  }

  isLoaded() {
    return isNativeSdkLoaded();
  }

  isReady() {
    return this.isLoaded();
  }

  getPayloadConfig() {
    return {
      defaultCurrency: this.config.defaultCurrency,
      defaultActionSource: this.config.defaultActionSource,
    };
  }

  updatePixelUser(user) {
    const cleanedUser = removeEmptyValues(user);
    if (Object.keys(cleanedUser).length > 0 && typeof window.oaiq === 'function') {
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
    if (this.config.pixelId && typeof window.oaiq === 'function') {
      window.oaiq('init', { pixelId: this.config.pixelId, user: {} });
    }
  }

  syncUserId(message) {
    if (!Object.prototype.hasOwnProperty.call(message || {}, 'userId')) {
      return;
    }

    const userId = message.userId || '';
    if (this.shouldResetSession(userId)) {
      this.resetSession(userId);
      return;
    }

    if (this.currentUserId === '' && userId) {
      this.currentUserId = userId;
    }
  }

  identify(rudderElement) {
    if (!this.ensurePixelInitialized()) {
      return;
    }

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
    if (!this.ensurePixelInitialized()) {
      return;
    }

    const message = rudderElement?.message || rudderElement || {};
    this.syncUserId(message);
    const resolvedEvent = resolveEvent(message, messageType, this.config.eventMapping || []);

    if (resolvedEvent.error) {
      logger.error(resolvedEvent.error);
      return;
    }

    const eventDataResult = buildEventData(message, resolvedEvent, this.getPayloadConfig());
    if (eventDataResult.error) {
      logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(eventDataResult.error));
      return;
    }

    const eventUserData = buildUserData(message, logger);
    const pixelUserData = { ...this.userData, ...eventUserData };
    if (Object.keys(eventUserData).length > 0) {
      this.updatePixelUser(pixelUserData);
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
      this.config.pixelId,
      resolvedEvent.eventName,
      eventDataResult.eventData,
      eventOptions,
    );
  }

}

export default OpenAIAds;

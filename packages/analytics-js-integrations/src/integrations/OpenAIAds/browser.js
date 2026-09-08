import { DISPLAY_NAME, LOGGER_MESSAGES, NAME } from './constants';
import Logger from '../../utils/logger';
import { initPixel, isNativeSdkLoaded, loadNativeSdk } from './nativeSdkLoader';
import {
  buildEventData,
  buildEventOptions,
  buildUserData,
  getEventMappingIndex,
  removeEmptyValues,
  resolveEvent,
} from './utils';

const logger = new Logger(DISPLAY_NAME);

function OpenAIAds(config = {}, analytics = {}, destinationInfo) {
  if (analytics.logLevel) {
    logger.setLogLevel(analytics.logLevel);
  }

  this.name = NAME;
  this.analytics = analytics;
  this.config = config;
  this.eventMappingIndex = getEventMappingIndex(config.eventMapping);
  this.userData = {};
  this.currentUserId = '';
  this.pixelInitialized = false;
  this.pixelIdMissing = false;

  const destination = destinationInfo || {};
  this.shouldApplyDeviceModeTransformation = destination.shouldApplyDeviceModeTransformation;
  this.propagateEventsUntransformedOnError = destination.propagateEventsUntransformedOnError;
  this.destinationId = destination.destinationId;
}

OpenAIAds.prototype.init = function init() {
  if (!this.ensurePixelInitialized()) {
    return;
  }

  const analyticsUserId =
    typeof this.analytics.getUserId === 'function' ? this.analytics.getUserId() : undefined;
  this.currentUserId =
    analyticsUserId === undefined || analyticsUserId === null ? '' : String(analyticsUserId);
  this.seedUserData();
};

OpenAIAds.prototype.ensurePixelInitialized = function ensurePixelInitialized() {
  if (!this.config.pixelId) {
    this.pixelIdMissing = true;
    logger.error(LOGGER_MESSAGES.MISSING_PIXEL_ID);
    return false;
  }

  this.pixelIdMissing = false;
  if (!this.pixelInitialized || typeof window.oaiq !== 'function') {
    loadNativeSdk();
    initPixel(this.config.pixelId);
    this.pixelInitialized = true;
  }

  return true;
};

OpenAIAds.prototype.isLoaded = function isLoaded() {
  return this.pixelIdMissing || isNativeSdkLoaded();
};

OpenAIAds.prototype.isReady = function isReady() {
  return this.isLoaded();
};

OpenAIAds.prototype.getPayloadConfig = function getPayloadConfig() {
  return {
    defaultCurrency: this.config.defaultCurrency,
  };
};

OpenAIAds.prototype.updatePixelUser = function updatePixelUser(user) {
  const cleanedUser = removeEmptyValues(user);
  if (Object.keys(cleanedUser).length > 0 && typeof window.oaiq === 'function') {
    window.oaiq('init', { pixelId: this.config.pixelId, user: cleanedUser });
  }
};

// The pixel keeps user state for the current page and applies it to later measure calls.
// The SDK restores traits from storage without re-emitting identify, so seed once per load.
OpenAIAds.prototype.seedUserData = function seedUserData() {
  const traits =
    typeof this.analytics.getUserTraits === 'function' ? this.analytics.getUserTraits() : undefined;
  const user = buildUserData({ traits, userId: this.currentUserId }, logger);
  if (Object.keys(user).length > 0) {
    this.userData = user;
    this.updatePixelUser(this.userData);
  }
};

// Mirrors the MoEngage integration pattern: clear vendor user state when the SDK user changes
// or when a previously identified user becomes empty after logout/reset.
OpenAIAds.prototype.shouldResetSession = function shouldResetSession(userId) {
  return (
    (userId && this.currentUserId !== '' && this.currentUserId !== userId) ||
    (this.currentUserId !== '' && userId === '')
  );
};

OpenAIAds.prototype.resetSession = function resetSession(userId) {
  this.currentUserId = userId;
  this.userData = {};
  if (this.config.pixelId && typeof window.oaiq === 'function') {
    window.oaiq('init', { pixelId: this.config.pixelId, user: {} });
  }
};

OpenAIAds.prototype.syncUserId = function syncUserId(message) {
  if (!Object.prototype.hasOwnProperty.call(message || {}, 'userId')) {
    return { reset: false, loggedOut: false };
  }

  const userId = message.userId === undefined || message.userId === null ? '' : String(message.userId);
  if (this.shouldResetSession(userId)) {
    this.resetSession(userId);
    return { reset: true, loggedOut: userId === '' };
  }

  if (this.currentUserId === '' && userId) {
    this.currentUserId = userId;
  }
  return { reset: false, loggedOut: false };
};

OpenAIAds.prototype.identify = function identify(rudderElement) {
  if (!this.ensurePixelInitialized()) {
    return;
  }

  const message = (rudderElement && rudderElement.message) || rudderElement || {};
  const userSyncResult = this.syncUserId(message);
  if (userSyncResult.loggedOut) {
    return;
  }

  const user = buildUserData(message, logger);

  if (Object.keys(user).length === 0) {
    logger.error(LOGGER_MESSAGES.IDENTIFY_NO_USER_DATA);
    return;
  }

  this.userData = Object.assign({}, this.userData, user);
  this.updatePixelUser(this.userData);
};

OpenAIAds.prototype.track = function track(rudderElement) {
  this.sendConversionEvent(rudderElement, 'track');
};

OpenAIAds.prototype.page = function page(rudderElement) {
  this.sendConversionEvent(rudderElement, 'page');
};

OpenAIAds.prototype.sendConversionEvent = function sendConversionEvent(rudderElement, messageType) {
  if (!this.ensurePixelInitialized()) {
    return;
  }

  const message = (rudderElement && rudderElement.message) || rudderElement || {};
  this.syncUserId(message);
  const resolvedEvent = resolveEvent(message, messageType, this.eventMappingIndex);

  if (resolvedEvent.error) {
    logger.error(resolvedEvent.error);
    return;
  }

  const eventDataResult = buildEventData(message, resolvedEvent, this.getPayloadConfig());
  if (eventDataResult.error) {
    logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(eventDataResult.error));
    return;
  }

  const eventOptionsResult = buildEventOptions(message, resolvedEvent);
  if (eventOptionsResult.error) {
    logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(eventOptionsResult.error));
    return;
  }

  window.oaiq(
    'measureSingle',
    this.config.pixelId,
    resolvedEvent.eventName,
    eventDataResult.eventData,
    eventOptionsResult.eventOptions,
  );
};

export default OpenAIAds;

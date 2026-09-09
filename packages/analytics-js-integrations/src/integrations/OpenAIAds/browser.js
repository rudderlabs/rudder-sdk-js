import { DISPLAY_NAME, LOGGER_MESSAGES, NAME } from './constants';
import Logger from '../../utils/logger';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { initPixel, isNativeSdkLoaded, loadNativeSdk } from './nativeSdkLoader';
import {
  buildEventData,
  buildEventOptions,
  buildUserData,
  getEventMappingIndex,
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
    this.eventMappingIndex = getEventMappingIndex(config.eventMapping);
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

    const analyticsUserId =
      typeof this.analytics.getUserId === 'function' ? this.analytics.getUserId() : undefined;
    this.currentUserId =
      analyticsUserId === undefined || analyticsUserId === null ? '' : String(analyticsUserId);
    this.seedUserData();
  }

  ensurePixelInitialized() {
    const { pixelId } = this.config;
    if (!pixelId) {
      logger.error(LOGGER_MESSAGES.MISSING_PIXEL_ID);
      return false;
    }

    if (!this.pixelInitialized || !isNativeSdkLoaded()) {
      loadNativeSdk();
      initPixel(pixelId);
      this.pixelInitialized = true;
    }

    return true;
  }

  // Device-mode readiness is a shared gate, not a per-destination one: the queue that feeds
  // every device-mode destination only starts once all of them have resolved as loaded or
  // failed (`Analytics.ts` loadDestinations / `EventRepository.ts`, and `allModulesInitialized`
  // in analytics-v1.1). A destination saved without a `pixelId` can never load the pixel, so
  // polling it until the timeout would stall delivery for every other destination on the source.
  // Resolving immediately keeps this destination inert without holding up its peers: every
  // entry point returns early from `ensurePixelInitialized`, and OpenAIAds does not implement
  // `getDataForIntegrationsObject`, so it never claims the event in the message `integrations`
  // object and never suppresses the cloud-mode path.
  isLoaded() {
    return !this.config.pixelId || isNativeSdkLoaded();
  }

  isReady() {
    return this.isLoaded();
  }

  updatePixelUser(user) {
    const cleanedUser = removeUndefinedAndNullValues(user);
    if (Object.keys(cleanedUser).length > 0 && isNativeSdkLoaded()) {
      window.oaiq('init', { pixelId: this.config.pixelId, user: cleanedUser });
    }
  }

  // The pixel keeps user state for the current page and applies it to later measure calls.
  // The SDK restores traits from storage without re-emitting identify, so seed once per load.
  seedUserData() {
    const traits =
      typeof this.analytics.getUserTraits === 'function'
        ? this.analytics.getUserTraits()
        : undefined;
    const user = buildUserData({ userId: this.currentUserId, context: { traits } }, logger);
    if (Object.keys(user).length > 0) {
      this.userData = user;
      this.updatePixelUser(this.userData);
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
    if (this.config.pixelId && isNativeSdkLoaded()) {
      window.oaiq('init', { pixelId: this.config.pixelId, user: {} });
    }
  }

  syncUserId(message) {
    if (!Object.prototype.hasOwnProperty.call(message ?? {}, 'userId')) {
      return { reset: false, loggedOut: false };
    }

    const userId =
      message.userId === undefined || message.userId === null ? '' : String(message.userId);
    if (this.shouldResetSession(userId)) {
      this.resetSession(userId);
      return { reset: true, loggedOut: userId === '' };
    }

    if (this.currentUserId === '' && userId) {
      this.currentUserId = userId;
    }
    return { reset: false, loggedOut: false };
  }

  identify(rudderElement) {
    if (!this.ensurePixelInitialized()) {
      return;
    }

    const message = rudderElement?.message ?? rudderElement ?? {};
    // A logout has already cleared the pixel user state; re-publishing the stale
    // context traits that the SDK keeps around would undo it.
    if (this.syncUserId(message).loggedOut) {
      return;
    }

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

  sendConversionEvent(rudderElement, messageType) {
    if (!this.ensurePixelInitialized()) {
      return;
    }

    const message = rudderElement?.message ?? rudderElement ?? {};
    this.syncUserId(message);
    const resolvedEvent = resolveEvent(message, messageType, this.eventMappingIndex);

    if (resolvedEvent.error) {
      logger.error(resolvedEvent.error);
      return;
    }

    const { eventOptions, error: eventOptionsError } = buildEventOptions(message, resolvedEvent);
    if (eventOptionsError) {
      logger.error(LOGGER_MESSAGES.INVALID_EVENT_DATA(eventOptionsError));
      return;
    }

    window.oaiq(
      'measureSingle',
      this.config.pixelId,
      resolvedEvent.eventName,
      buildEventData(message, resolvedEvent, this.config),
      eventOptions,
    );
  }
}

export default OpenAIAds;

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

    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const { pixelId } = this.config;
    // Fail fast: the device-mode plugin catches this and moves the destination straight to
    // `failedDestinations`, so it is never dispatched to and never polled for readiness.
    if (!pixelId) {
      throw new Error(LOGGER_MESSAGES.MISSING_PIXEL_ID);
    }

    loadNativeSdk();
    initPixel(pixelId);

    const analyticsUserId =
      typeof this.analytics.getUserId === 'function' ? this.analytics.getUserId() : undefined;
    this.currentUserId =
      analyticsUserId === undefined || analyticsUserId === null ? '' : String(analyticsUserId);
    this.seedUserData();
  }

  isLoaded() {
    return isNativeSdkLoaded();
  }

  isReady() {
    return this.isLoaded();
  }

  // Holds on to the published user object so later updates merge onto it, and re-inits the
  // pixel with the complete object: the pixel replaces its stored user rather than merging.
  updatePixelUser(user) {
    const cleanedUser = removeUndefinedAndNullValues(user);
    if (Object.keys(cleanedUser).length === 0 || !isNativeSdkLoaded()) {
      return;
    }

    this.userData = cleanedUser;
    window.oaiq('init', { pixelId: this.config.pixelId, user: cleanedUser });
  }

  // The pixel keeps user state for the current page and applies it to later measure calls.
  // The SDK restores traits from storage without re-emitting identify, so seed once per load.
  seedUserData() {
    const traits =
      typeof this.analytics.getUserTraits === 'function'
        ? this.analytics.getUserTraits()
        : undefined;
    // `anonymousId` is carried so an anonymous visitor still seeds an `external_id_sha256`,
    // matching the cloud-mode `userId` -> `anonymousId` mapping.
    const anonymousId =
      typeof this.analytics.getAnonymousId === 'function'
        ? this.analytics.getAnonymousId()
        : undefined;
    this.updatePixelUser(
      buildUserData({ userId: this.currentUserId, anonymousId, context: { traits } }, logger),
    );
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

    this.updatePixelUser({ ...this.userData, ...user });
  }

  track(rudderElement) {
    this.sendConversionEvent(rudderElement, 'track');
  }

  page(rudderElement) {
    this.sendConversionEvent(rudderElement, 'page');
  }

  sendConversionEvent(rudderElement, messageType) {
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

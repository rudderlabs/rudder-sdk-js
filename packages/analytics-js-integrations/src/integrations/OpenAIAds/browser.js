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

  identify(rudderElement) {
    const message = rudderElement?.message || rudderElement || {};
    const user = buildUserData(message, logger);

    if (Object.keys(user).length === 0) {
      logger.error(LOGGER_MESSAGES.IDENTIFY_NO_USER_DATA);
      return;
    }

    this.userData = { ...this.userData, ...user };
    this.updatePixelUser(this.userData);
  }

  reset() {
    this.userData = {};
    this.cookieObref = undefined;
    if (this.pixelId && typeof window.oaiq === 'function') {
      window.oaiq('init', { pixelId: this.pixelId, user: {} });
    }
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

    const eventOptions = removeEmptyValues({
      id: getDeduplicationId(message, resolvedEvent.mappingRow),
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

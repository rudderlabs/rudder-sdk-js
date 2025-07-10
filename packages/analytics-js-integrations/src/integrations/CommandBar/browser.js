/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class CommandBar {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.orgId = config.orgId;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.orgId);
  }

  isLoaded() {
    return window.CommandBar && typeof window.CommandBar.shareState === 'function';
  }

  isReady() {
    return this.isLoaded();
  }

  /**
   * Idenitfies a user with userId and traits
   * Commandbar doc: https://www.commandbar.com/docs/sdk/lifecycle/boot/
   * @param {*} rudderElement
   * @returns
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits, userId, context } = message;
    const userTraits = { ...context.traits, ...traits };
    const { hmacId } = userTraits;
    if (!userId) {
      logger.error('userId from identify call is missing');
      return;
    }

    const instanceAttributes = {}; // stores commandBar options associated with the current session.

    if (hmacId) {
      instanceAttributes.hmac = hmacId;
      delete userTraits.hmacId;
    }
    window.CommandBar.boot(userId, userTraits, instanceAttributes);
  }
  /**
   * ref: https://www.commandbar.com/docs/sdk/events/trackevent/
   * Track - tracks an event for an user
   * @param {Track} track
   */
  track(rudderElement) {
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error('event name from track call is missing');
      return;
    }
    window.CommandBar.trackEvent(event, {});
  }
}

export default CommandBar;

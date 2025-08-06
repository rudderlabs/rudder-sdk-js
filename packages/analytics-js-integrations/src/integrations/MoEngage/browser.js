/* eslint-disable class-methods-use-this */
import each from '@ndhoule/each';
import { NAME, DISPLAY_NAME, IdentifyUserPropertiesMap, TraitsMap } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';
import { calculateMoeDataCenter } from './utils';

const logger = new Logger(DISPLAY_NAME);

class MoEngage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiId = config.apiId;
    this.debug = config.debug;
    this.region = config.region;
    this.identityResolution = Boolean(config.identityResolution ?? false);
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    this.moengageRegion = calculateMoeDataCenter(this.region);
    loadNativeSdk(this.moengageRegion);
    // Following MoEngage official convention: assign moe() result to global Moengage
    window.Moengage = window.moe({
      app_id: this.apiId,
      debug_logs: this.debug ? 1 : 0,
    });

    this.currentUserId = this.analytics.getUserId();
  }

  isLoaded() {
    // Check if MoEngage is properly initialized following their official pattern
    return !!window.moeBannerText && !!window.Moengage;
  }

  isReady() {
    return this.isLoaded();
  }

  // We are destroying the session if userId is changed or currentUserId is not empty and userId is empty
  // This is a log out scenario
  shouldResetSession(userId) {
    return (
      (userId && this.currentUserId !== '' && this.currentUserId !== userId) ||
      (this.currentUserId !== '' && userId === '')
    );
  }

  resetSession(userId) {
    this.currentUserId = userId;
    return window.Moengage.destroy_session();
  }

  trackOld(rudderElement) {
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error('Payload not correct');
      return;
    }

    const { event, properties, userId } = rudderElement.message;
    if (userId && this.currentUserId !== userId) {
      this.resetSession(userId).then(() => {
        // Continue after reset is complete
        this.trackEvent(event, properties);
      });
      return;
    }
    this.trackEvent(event, properties);
  }

  track(rudderElement) {
    if (!this.identityResolution) {
      this.trackOld(rudderElement);
      return;
    }
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error('Payload not correct');
      return;
    }

    const { event, properties, userId } = rudderElement.message;
    if (this.shouldResetSession(userId)) {
      this.resetSession(userId).then(() => {
        // Continue after reset is complete
        this.trackEvent(event, properties);
      });
      return;
    }
    this.trackEvent(event, properties);
  }

  trackEvent(event, properties) {
    // track event : https://developers.moengage.com/hc/en-us/articles/360061179752-Web-SDK-Events-Tracking
    if (!event) {
      logger.error('Event name is not present');
      return;
    }
    if (properties) {
      window.Moengage.track_event(event, properties);
    } else {
      window.Moengage.track_event(event);
    }
  }

  identifyOld(rudderElement) {
    const { userId, context } = rudderElement.message;
    let traits = null;
    if (context) {
      traits = context.traits;
    }

    // check if user id is same or not
    if (this.currentUserId !== userId) {
      this.resetSession(userId).then(() => {
        // Continue after reset is complete
        this.processIdentifyOld(userId, traits);
      });
      return;
    }
    this.processIdentifyOld(userId, traits);
  }

  processIdentifyOld(userId, traits) {
    // if user is present map
    if (userId) {
      window.Moengage.add_unique_user_id(userId);
    }

    // track user attributes : https://developers.moengage.com/hc/en-us/articles/360061179752-Web-SDK-Events-Tracking
    if (traits) {
      each((value, key) => {
        // check if name is present
        if (key === 'name') {
          window.Moengage.add_user_name(value);
        }
        if (Object.prototype.hasOwnProperty.call(TraitsMap, key)) {
          const method = `add_${TraitsMap[key]}`;
          window.Moengage[method](value);
        } else {
          window.Moengage.add_user_attribute(key, value);
        }
      }, traits);
    }
  }

  identify(rudderElement) {
    if (!this.identityResolution) {
      this.identifyOld(rudderElement);
      return;
    }

    const { userId, context, anonymousId } = rudderElement.message;
    let traits = null;
    if (context) {
      traits = context.traits;
    }

    if (this.shouldResetSession(userId)) {
      this.resetSession(userId).then(() => {
        // Continue after reset is complete
        this.processIdentify(userId, anonymousId, traits);
      });
      return;
    }

    this.processIdentify(userId, anonymousId, traits);
  }

  processIdentify(userId, anonymousId, traits) {
    // If currentUserId is empty, set it to the current userId this happens when an anonymous user loggedIn for the first time
    if (this.currentUserId === '' && userId) {
      this.currentUserId = userId;
    }

    const userAttributes = {};
    each((value, key) => {
      if (Object.prototype.hasOwnProperty.call(IdentifyUserPropertiesMap, key)) {
        const method = IdentifyUserPropertiesMap[key];
        userAttributes[method] = value;
      } else {
        userAttributes[key] = value; // For any other attributes not in the map
      }
    }, traits);

    const payload = {
      ...(anonymousId && { anonymousId }),
      ...(userId && { uid: userId }),
      ...userAttributes,
    };

    // track user attributes : https://developers.moengage.com/hc/en-us/articles/360061114832-Web-SDK-User-Attributes-Tracking
    window.Moengage.identifyUser(payload);
  }
}

export default MoEngage;

/* eslint-disable class-methods-use-this */
import each from '@ndhoule/each';
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

// custom traits mapping context.traits --> moengage properties
const traitsMap = {
  firstName: 'first_name',
  lastName: 'last_name',
  firstname: 'first_name',
  lastname: 'last_name',
  email: 'email',
  phone: 'mobile',
  name: 'user_name',
  username: 'user_name',
  userName: 'user_name',
  gender: 'gender',
  birthday: 'birthday',
  id: null,
};

const identifyUserPropertiesMap = {
  email: 'u_em',
  firstName: 'u_fn',
  lastName: 'u_ln',
  firstname: 'u_fn',
  lastname: 'u_ln',
  phone: 'u_mb',
  username: 'u_n',
  userName: 'u_n',
  gender: 'u_gd',
  birthday: 'u_bd',
  name: 'u_n',
  id: null,
};

class MoEngage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiId = config.apiId;
    this.debug = config.debug;
    this.region = config.region;
    this.identityResolution = config.identityResolution || false;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.calculateMoeDataCenter());
    // Following MoEngage official convention: assign moe() result to global Moengage
    window.Moengage = window.moe({
      app_id: this.apiId,
      debug_logs: this.debug ? 1 : 0,
    });

    this.initialUserId = this.analytics.getUserId();
  }

  isLoaded() {
    // Check if MoEngage is properly initialized following their official pattern
    return !!window.Moengage && typeof window.Moengage.track_event === 'function';
  }

  isReady() {
    return this.isLoaded();
  }

  calculateMoeDataCenter() {
    // Calculate the MoEngage data center based on the region
    switch (this.region) {
      case 'EU':
        return 'dc_2';
      case 'IN':
        return 'dc_3';
      default:
        return 'dc_1'; // Default to US data center
    }
  }

  track(rudderElement) {
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error('Payload not correct');
      return;
    }

    const { event, properties, userId } = rudderElement.message;
    if (userId && this.initialUserId !== userId) {
      this.resetSession().then(() => {
        // Continue after reset is complete
        this.trackEvent(event, properties);
      });
      return;
    }
    this.trackEvent(event, properties);
  }

  trackEvent(event, properties) {
    // track event : https://docs.moengage.com/docs/tracking-events
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

  resetSession() {
    this.initialUserId = this.analytics.getUserId();
    return window.Moengage.destroy_session();
  }

  identifyOld(rudderElement) {
    const { userId, context } = rudderElement.message;
    let traits = null;
    if (context) {
      traits = context.traits;
    }

    // check if user id is same or not
    if (this.initialUserId !== userId) {
      this.resetSession().then(() => {
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

    // track user attributes : https://docs.moengage.com/docs/tracking-web-user-attributes
    if (traits) {
      each((value, key) => {
        // check if name is present
        if (key === 'name') {
          window.Moengage.add_user_name(value);
        }
        if (Object.hasOwn(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          window.Moengage[method](value);
        } else {
          window.Moengage.add_user_attribute(key, value);
        }
      }, traits);
    }
  }

  // We are destroying the session if userId is changed or initialUserId is not empty and userId is empty
  // This is a log out scenario
  shouldResetSession(userId) {
    return (
      (this.initialUserId !== '' && this.initialUserId !== userId) ||
      (this.initialUserId !== '' && userId === '')
    );
  }

  identify(rudderElement) {
    if (!this.identityResolution) {
      this.identifyOld(rudderElement);
      return;
    }

    const { userId, context } = rudderElement.message;
    let traits = null;
    if (context) {
      traits = context.traits;
    }

    if (this.shouldResetSession(userId)) {
      this.resetSession().then(() => {
        // Continue after reset is complete
        this.processIdentify(userId, traits);
      });
      return;
    }

    this.processIdentify(userId, traits);
  }

  processIdentify(userId, traits) {
    // If initialUserId is empty, set it to the current userId this happens when an anonymous user loggedIn for the first time
    if (this.initialUserId === '' && userId) {
      this.initialUserId = userId;
    }

    const userAttributes = {};
    each((value, key) => {
      if (Object.hasOwn(identifyUserPropertiesMap, key)) {
        const method = identifyUserPropertiesMap[key];
        userAttributes[method] = value;
      } else {
        userAttributes[key] = value; // For any other attributes not in the map
      }
    }, traits);

    const payload = {
      anonymousId: this.analytics.getAnonymousId(),
      ...(userId && { uid: userId }),
      ...userAttributes,
    };

    // track user attributes : https://developers.moengage.com/hc/en-us/articles/360061114832-Web-SDK-User-Attributes-Tracking
    window.Moengage.identifyUser(payload);
  }
}

export default MoEngage;

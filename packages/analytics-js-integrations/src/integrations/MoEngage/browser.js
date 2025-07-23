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
    this.moeClient = window.moe({
      app_id: this.apiId,
      debug_logs: this.debug ? 1 : 0,
    });
    this.initialUserId = this.analytics.getUserId();
    if (this.identityResolution) {
      this.analytics.identify(this.initialUserId);
    }
  }

  isLoaded() {
    return !!window.moeBannerText;
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
      this.reset();
    }
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

  reset() {
    this.initialUserId = this.analytics.getUserId();
    window.Moengage.destroy_session();
  }

  identifyOld(rudderElement) {
    const { userId, context } = rudderElement.message;
    let traits = null;
    if (context) {
      traits = context.traits;
    }
    // check if user id is same or not
    if (this.initialUserId !== userId) {
      this.reset();
    }
    // if user is present map
    if (userId) {
      this.moeClient.add_unique_user_id(userId);
    }

    // track user attributes : https://docs.moengage.com/docs/tracking-web-user-attributes
    if (traits) {
      each((value, key) => {
        // check if name is present
        if (key === 'name') {
          this.moeClient.add_user_name(value);
        }
        if (Object.prototype.hasOwnProperty.call(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          this.moeClient[method](value);
        } else {
          this.moeClient.add_user_attribute(key, value);
        }
      }, traits);
    }
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

    // We are destroying the session if userId is changed or initialUserId is not empty and userId is empty
    // This is a log out scenario
    if (
      (this.initialUserId !== '' && this.initialUserId !== userId) ||
      (this.initialUserId !== '' && userId === '')
    ) {
      this.reset();
    }

    // If initialUserId is empty, set it to the current userId this happens when an anonymous user loggedIn for the first time
    if (this.initialUserId === '' && userId) {
      this.initialUserId = userId;
    }

    const userAttributes = {};
    each((value, key) => {
      if (Object.prototype.hasOwnProperty.call(identifyUserPropertiesMap, key)) {
        const method = identifyUserPropertiesMap[key];
        userAttributes[method] = value;
      }
    }, traits);

    const payload = {
      anonymousId: this.analytics.getAnonymousId(),
      ...(userId && { uid: userId }),
      ...userAttributes,
    };
    window.Moengage.identifyUser(payload);

    // track user attributes : https://developers.moengage.com/hc/en-us/articles/360061114832-Web-SDK-User-Attributes-Tracking
    if (traits) {
      each((value, key) => {
        // check if name is present
        if (key === 'name') {
          window.Moengage.add_user_name(value);
        }
        if (Object.prototype.hasOwnProperty.call(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          window.Moengage[method](value);
        } else {
          window.Moengage.add_user_attribute(key, value);
        }
      }, traits);
    }
  }
}

export default MoEngage;

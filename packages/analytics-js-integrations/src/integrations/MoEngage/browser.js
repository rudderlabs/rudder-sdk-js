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
    this.anonymousId = this.analytics.getAnonymousId();
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
    window.Moengage.destroy_session()
  }

  identify(rudderElement) {
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

    let idPayload = {};
    if (userId !== '') {
      idPayload = { uid: userId, anonymousId: this.analytics.getAnonymousId() };
    } else {
      idPayload = { anonymousId: this.analytics.getAnonymousId() };
    }

    // It may happen that userId is not present so we will use anonymousId as uid
    // https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/supported-api/#set-a-blank-user-id
    const payload = {
      // uid: userId ? userId : this.analytics.getAnonymousId(),
      ...idPayload,
      ...userAttributes,
    };
    window.Moengage.identifyUser(payload);


    // track user attributes : https://docs.moengage.com/docs/tracking-web-user-attributes
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

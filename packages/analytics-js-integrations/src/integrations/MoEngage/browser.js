/* eslint-disable class-methods-use-this */
import each from '@ndhoule/each';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/MoEngage/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
    loadNativeSdk();
    // setting the region if us then not needed.
    if (this.region !== 'US') {
      this.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
        cluster: this.region === 'EU' ? 'eu' : 'in',
      });
    } else {
      this.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
      });
    }
    this.initialUserId = this.analytics.getUserId();
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.moeBannerText;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.moeBannerText;
  }

  track(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} track`);
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error(`${DISPLAY_NAME} : Payload not correct`);
      return;
    }
    const { event, properties, userId } = rudderElement.message;
    if (userId && this.initialUserId !== userId) {
      this.reset();
    }
    // track event : https://docs.moengage.com/docs/tracking-events
    if (!event) {
      logger.error(`${DISPLAY_NAME} : Event name is not present`);
      return;
    }
    if (properties) {
      this.moeClient.track_event(event, properties);
    } else {
      this.moeClient.track_event(event);
    }
  }

  reset() {
    logger.debug(`${DISPLAY_NAME} : inside reset`);
    // reset the user id
    this.initialUserId = this.analytics.getUserId();
    this.moeClient.destroy_session();
  }

  identify(rudderElement) {
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
}

export default MoEngage;

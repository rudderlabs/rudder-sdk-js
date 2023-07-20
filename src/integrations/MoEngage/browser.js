import each from '@ndhoule/each';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    const self = this;
    logger.debug('===in init MoEngage===');
    // loading the script for moengage web sdk
    /* eslint-disable */
    loadNativeSdk();
    /* eslint-enable */

    // setting the region if us then not needed.
    if (this.region !== 'US') {
      self.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
        cluster: this.region === 'EU' ? 'eu' : 'in',
      });
    } else {
      self.moeClient = window.moe({
        app_id: this.apiId,
        debug_logs: this.debug ? 1 : 0,
      });
    }
    this.initialUserId = this.analytics.getUserId();
  }

  isLoaded = () => {
    logger.debug('in MoEngage isLoaded');
    return !!window.moeBannerText;
  };

  isReady = () => {
    logger.debug('in MoEngage isReady');
    return !!window.moeBannerText;
  };

  track(rudderElement) {
    logger.debug('inside track');
    // Check if the user id is same as previous session if not a new session will start
    if (!rudderElement.message) {
      logger.error('Payload not correct');
      return;
    }
    const { event, properties, userId } = rudderElement.message;
    if (userId) {
      if (this.initialUserId !== userId) {
        this.reset();
      }
    }
    // track event : https://docs.moengage.com/docs/tracking-events
    if (!event) {
      logger.error('Event name not present');
      return;
    }
    if (properties) {
      this.moeClient.track_event(event, properties);
    } else {
      this.moeClient.track_event(event);
    }
  }

  reset() {
    logger.debug('inside reset');
    // reset the user id
    this.initialUserId = this.analytics.getUserId();
    this.moeClient.destroy_session();
  }

  identify(rudderElement) {
    const self = this;
    const { userId } = rudderElement.message;
    let traits = null;
    if (rudderElement.message.context) {
      traits = rudderElement.message.context.traits;
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
      each(function add(value, key) {
        // check if name is present
        if (key === 'name') {
          self.moeClient.add_user_name(value);
        }
        if (Object.prototype.hasOwnProperty.call(traitsMap, key)) {
          const method = `add_${traitsMap[key]}`;
          self.moeClient[method](value);
        } else {
          self.moeClient.add_user_attribute(key, value);
        }
      }, traits);
    }
  }
}

export default MoEngage;

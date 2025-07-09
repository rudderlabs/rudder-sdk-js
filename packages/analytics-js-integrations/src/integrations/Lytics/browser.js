/* eslint-disable class-methods-use-this */
// disabled these for Lytics js tag
/* eslint-disable no-plusplus */
/* eslint-disable block-scoped-var */
/* eslint-disable no-sequences */
/* eslint-disable yoda */
/* eslint-disable prefer-spread */
// disabling these eslint which are caused by the Lytics js tag

/* eslint-disable prefer-rest-params */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable no-void */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
/* eslint-disable lines-around-directive */
/* eslint-disable strict */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Lytics {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.accountId = config.accountId;
    this.stream = config.stream;
    this.blockload = config.blockload;
    this.loadid = config.loadid;
    this.name = NAME;
    this.forFirstName = ['firstname', 'firstName'];
    this.forLastName = ['lastname', 'lastName'];
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadLyticsScript() {
    loadNativeSdk(this.loadid, this.blockload, this.stream, this.accountId);
  }

  init() {
    this.loadLyticsScript();
  }

  isLoaded() {
    return !!(window.jstag && window.jstag.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    const { traits } = rudderElement.message.context;
    let payload = { user_id: userId, ...traits };
    payload = this.handleName(payload);
    window.jstag.send(this.stream, payload);
  }

  page(rudderElement) {
    const { properties, name } = rudderElement.message;
    let payload = { event: name, ...properties };
    payload = this.handleName(payload);
    window.jstag.pageView(this.stream, payload);
  }

  track(rudderElement) {
    const { properties, event } = rudderElement.message;
    let payload = { _e: event, ...properties };
    payload = this.handleName(payload);
    window.jstag.send(this.stream, payload);
  }

  handleName(payload) {
    const params = payload;
    this.forFirstName.forEach(key => {
      if (params[key]) {
        params.first_name = payload[key];
        delete params[key];
      }
    });
    this.forLastName.forEach(key => {
      if (params[key]) {
        params.last_name = payload[key];
        delete params[key];
      }
    });
    return params;
  }
}
export default Lytics;

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
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Lytics/constants';
import { loadNativeSdk } from './nativeSdkLoader';

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
    logger.debug('===in init Lytics===');
  }

  isLoaded() {
    logger.debug('in Lytics isLoaded');
    logger.debug(!!(window.jstag && window.jstag.push !== Array.prototype.push));
    return !!(window.jstag && window.jstag.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('in Lytics isReady');
    return !!(window.jstag && window.jstag.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    logger.debug('in Lytics identify');
    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    const { traits } = rudderElement.message.context;
    let payload = { user_id: userId, ...traits };
    payload = this.handleName(payload);
    window.jstag.send(this.stream, payload);
  }

  page(rudderElement) {
    logger.debug('in Lytics page');
    const { properties } = rudderElement.message;
    let payload = { event: rudderElement.message.name, ...properties };
    payload = this.handleName(payload);
    window.jstag.pageView(this.stream, payload);
  }

  track(rudderElement) {
    logger.debug('in Lytics track');
    const { properties } = rudderElement.message;
    let payload = { _e: rudderElement.message.event, ...properties };
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

/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
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
    // eslint-disable-next-line camelcase
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
    this.forFirstName.forEach((key) => {
      if (params[key]) {
        params.first_name = payload[key];
        delete params[key];
      }
    });
    this.forLastName.forEach((key) => {
      if (params[key]) {
        params.last_name = payload[key];
        delete params[key];
      }
    });
    return params;
  }
}
export default Lytics;

/* eslint-disable class-methods-use-this */
import processHeapProperties from './util';
import { NAME } from './constants';
import logger from '../../utils/logUtil';
import { loadNativeSdk } from './nativeSdkLoader';

class Heap {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.appId = config.appId;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  /**
   * Initialise Heap
   * DOC: https://developers.heap.io/docs/web
   */

  init() {
    loadNativeSdk(this.appId);
  }

  /**
   * Check if loaaded
   */

  isLoaded() {
    return !!(window.heap && window.heap.appid);
  }

  /**
   * Check if Ready
   */

  isReady() {
    return !!(window.heap && window.heap.appid);
  }

  // DOC: https://developers.heap.io/reference#identify

  identify(rudderElement) {
    const { userId, context } = rudderElement.message;
    if (userId) {
      window.heap.identify(userId);
    }
    const { traits } = context;
    // DOC: https://developers.heap.io/reference#adduserproperties
    window.heap.addUserProperties(processHeapProperties(traits));
  }

  // DOC: https://developers.heap.io/reference#track

  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    window.heap.track(event, processHeapProperties(properties));
  }
}

export default Heap;

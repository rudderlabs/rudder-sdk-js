/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Heap/constants';
import Logger from '../../utils/logger';
import processHeapProperties from './util';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
   * Initialize Heap
   * DOC: https://developers.heap.io/docs/web
   */

  init() {
    loadNativeSdk(this.appId);
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!(window.heap && window.heap.appid);
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
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

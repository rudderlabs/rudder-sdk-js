/**
 * Purpose of this integration:
 * GA 360 is the enterprise version of Google Analytics. It is not different from GA. But in order Work GA 360 as
 * device-mode integration and maintain the same structure with others created this integration.
 * This GA360 class inherited all the properties from the GA class and whenever a method of this class is called,
 * underlying GA method will get called.
 */
/* eslint-disable class-methods-use-this */
import { GA } from '../GA';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

class GA360 extends GA {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    super(config, analytics);
    this.name = NAME;
    this.areTransformationsConnected = destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init GA 360 ===');
    return super.init();
  }

  identify(rudderElement) {
    logger.debug('=========in GA 360 identify ==========');
    return super.identify(rudderElement);
  }

  track(rudderElement) {
    logger.debug('=========in GA 360 track ==========');
    return super.track(rudderElement);
  }

  page(rudderElement) {
    logger.debug('=========in GA 360 page ==========');
    return super.page(rudderElement);
  }

  isLoaded() {
    logger.debug('=========in GA 360 load ==========');
    return super.isLoaded();
  }

  isReady() {
    return super.isReady();
  }
}

export { GA360 };

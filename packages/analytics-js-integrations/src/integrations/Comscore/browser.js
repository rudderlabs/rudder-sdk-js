import Logger from '../../utils/logger';
import { NAME, DISPLAY_NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';
import { removeUndefinedAndNullAndEmptyValues } from '../../utils/commonUtils';
import { getDestinationOptions, getMappedData } from './utils';

const logger = new Logger(DISPLAY_NAME);

class Comscore {
  constructor(config, analytics) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.publisherId = config.publisherId;
    this.fieldMapping = config.fieldMapping || [];
    this.name = NAME;
  }

  init() {
    if(!this.publisherId) {
      logger.error('Publisher ID is required for Comscore integration');
      return;
    }
    loadNativeSdk(this.publisherId);
  }

  isLoaded() {
    return !!window.COMSCORE && !!window.COMSCORE.beacon;
  }

  isReady() {
    return this.isLoaded();
  }

  page(rudderElement) {
    const { message } = rudderElement;
    const { name: eventName, properties, integrations } = message;

    // https://direct-support.comscore.com/hc/en-us/articles/360007162413-Tag-Code-and-Tag-ID-parameters
    const url = properties?.url;
    const comscoreInteConf = getDestinationOptions(integrations);
    const consent = comscoreInteConf?.consent;
    const basePayload = {
      c1: '2',
      c2: this.publisherId,
      ...consent,
    };


    const mappedData = getMappedData(rudderElement, this.fieldMapping);
    if (Object.keys(mappedData).length > 0) {
      const payload = removeUndefinedAndNullAndEmptyValues({
        ...basePayload,
        ...mappedData,
      });
      window.COMSCORE.beacon(payload);
      return;
    }

    const payload = removeUndefinedAndNullAndEmptyValues({
      c4: url,
      c5: eventName,
      ...basePayload,
    });
    window.COMSCORE.beacon(payload);
  }
}

export default Comscore;

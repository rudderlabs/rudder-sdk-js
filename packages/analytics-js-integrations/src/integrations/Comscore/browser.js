import Logger from '../../utils/logger';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Comscore/constants';
import { loadNativeSdk } from './nativeSdkLoader';
import { removeUndefinedAndNullAndEmptyValues } from '../../utils/commonUtils';
import { getDestinationOptions, generateExtraData } from './utils';

const logger = new Logger(DISPLAY_NAME);

class Comscore {
  constructor(config, analytics) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.publisherId = config.publisherId;
    this.fieldMapping = config.fieldMapping;
    this.name = NAME;
  }

  init() {
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

    const url = properties?.url;
    const comscoreInteConf = getDestinationOptions(integrations);
    const consent = comscoreInteConf?.consent
    const basePayload = {
      c1: '2',
      c2: this.publisherId,
    };

    if (this.fieldMapping) {
      const mappedData = generateExtraData(rudderElement, this.fieldMapping);
      const payload = removeUndefinedAndNullAndEmptyValues({
        ...basePayload,
        ...mappedData,
        ...consent,
      });
      window.COMSCORE.beacon(payload);
      return;
    }

    const payload = removeUndefinedAndNullAndEmptyValues({
      c4: url,
      c5: eventName,
      ...basePayload,
      ...consent,
    });
    window.COMSCORE.beacon(payload);
  }
}

export default Comscore;

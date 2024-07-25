import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/GA4_V2/constants';
import { isDefinedAndNotNull } from '../../utils/commonUtils';
import Logger from '../../utils/logger';
import { GA4 } from '../GA4';

const logger = new Logger(DISPLAY_NAME);

// eslint-disable-next-line @typescript-eslint/naming-convention
export default class GA4_V2 extends GA4 {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }

    const newConfig = { ...config };
    /**
     * Sample configData
     * "{\"ACCOUNT\":\"321500532\",\"PROPERTY\":\"449999397\",\"DATA_STREAM\":{\"value\":\"G-Q3C88MMDW1\",\"type\":\"gtag\"},\"MEASUREMENT_PROTOCOL_SECRET\":\"sample_secret\"}";
     */

    if (isDefinedAndNotNull(config.configData)) {
      const configDetails = JSON.parse(config.configData);
      newConfig.propertyId = configDetails.PROPERTY;
      newConfig.typesOfClient = configDetails.DATA_STREAM.type;
      if (newConfig.typesOfClient !== 'gtag') {
        logger.error('Invalid typesOfClient. Please select gtag');
      }
      newConfig.measurementId = configDetails.DATA_STREAM.value;
    }

    if (!isDefinedAndNotNull(newConfig.measurementId)) {
      logger.error('Measurement ID is required for GA4');
    }
    
    newConfig.isExtendedGa4_V2 = true;
    super(newConfig, analytics, destinationInfo);
    this.analytics = analytics;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    return super.init();
  }

  isLoaded() {
    return super.isLoaded();
  }

  isReady() {
    return super.isReady();
  }

  identify(rudderElement) {
    return super.identify(rudderElement);
  }

  track(rudderElement) {
    return super.track(rudderElement);
  }

  page(rudderElement) {
    return super.page(rudderElement);
  }

  group(rudderElement) {
    return super.group(rudderElement);
  }

  getDataForIntegrationsObject() {
    const { clientId, sessionId, sessionNumber } = super.getClientDetails();
    return {
      [DISPLAY_NAME]: {
        clientId,
        sessionId,
        sessionNumber,
      },
    };
  }
}

import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/BingAds/constants';
import { buildCommonPayload, buildEcommPayload, EXCLUSION_KEYS } from './utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { extractCustomFields } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

class BingAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.tagID = config.tagID;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
    this.uniqueId = `bing${this.tagID}`;
  }

  init = () => {
    logger.debug('===in init BingAds===');
    loadNativeSdk(this.uniqueId, this.tagID);
  };

  isLoaded = () => {
    logger.debug('in BingAds isLoaded');
    return (
      !!window.UET && !!window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push
    );
  };

  isReady = () => {
    logger.debug('in BingAds isReady');
    return !!(window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push);
  };

  /*
    Visit here(for details Parameter details): https://help.ads.microsoft.com/#apex/3/en/53056/2
    Under: What data does UET collect once I install it on my website?
    Updated syntax doc ref - https://help.ads.microsoft.com/#apex/ads/en/56916/2
    Ecomm parameters ref - https://help.ads.microsoft.com/#apex/ads/en/60118/-1
  */

  track = rudderElement => {
    const { type, properties } = rudderElement.message;
    const eventToSend = properties?.event_action || type;
    if (!eventToSend) {
      logger.error('Event type not present');
      return;
    }
    let payload = {
      ...buildCommonPayload(rudderElement.message),
      ...buildEcommPayload(rudderElement.message),
    };

    // We can pass unmapped UET parameters through custom properties
    const customProperties = extractCustomFields(
      rudderElement.message,
      {},
      ['properties'],
      EXCLUSION_KEYS,
    );

    payload = { ...payload, ...customProperties };
    payload = removeUndefinedAndNullValues(payload);

    window[this.uniqueId].push('event', eventToSend, payload);
  };

  page = () => {
    window[this.uniqueId].push('pageLoad');
  };
}

export { BingAds };

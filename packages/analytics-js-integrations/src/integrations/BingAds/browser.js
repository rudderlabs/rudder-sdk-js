import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';
import { extractCustomFields } from '../../utils/utils';
import {
  buildCommonPayload,
  buildEcommPayload,
  EXCLUSION_KEYS,
  constructPidPayload,
} from './utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

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
    this.enableEnhancedConversions = config.enableEnhancedConversions;
    this.isHashRequired = config.isHashRequired;
  }

  init() {
    loadNativeSdk(this.uniqueId, this.tagID);
  }

  isLoaded() {
    return (
      !!window.UET && !!window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push
    );
  }

  isReady() {
    return !!(window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push);
  }

  /*
    Visit here(for details Parameter details): https://help.ads.microsoft.com/#apex/3/en/53056/2
    Under: What data does UET collect once I install it on my website?
    Updated syntax doc ref - https://help.ads.microsoft.com/#apex/ads/en/56916/2
    Ecomm parameters ref - https://help.ads.microsoft.com/#apex/ads/en/60118/-1
  */

  track = rudderElement => {
    const { type, properties, context } = rudderElement.message;
    const eventToSend = properties?.event_action || type;
    if (!eventToSend) {
      logger.error('Event type is not present');
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
    if (this.enableEnhancedConversions === true) {
      payload.pid = context?.traits?.pid || constructPidPayload(context, this.isHashRequired);
    }
    payload = removeUndefinedAndNullValues(payload);
    window[this.uniqueId].push('event', eventToSend, payload);
  };

  page() {
    window[this.uniqueId].push('pageLoad');
  }
}

export default BingAds;

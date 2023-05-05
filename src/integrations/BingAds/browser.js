import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { NAME } from './constants';
import { buildCommonPayload, buildEcommPayload, EXCLUSION_KEYS } from './utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { extractCustomFields } from '../../utils/utils';

class BingAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.tagID = config.tagID;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    this.uniqueId = `bing${this.tagID}`;
  }

  /* eslint-disable */
  loadBingadsScript = () => {
    ((w, d, t, r, u) => {
      let f;
      let n;
      let i;
      (w[u] = w[u] || []),
        (f = () => {
          const o = {
            ti: this.tagID,
          };
          (o.q = w[u]), w.UET && (w[u] = new UET(o));
        }),
        (n = d.createElement(t)),
        (n.src = r),
        (n.async = 1),
        n.setAttribute('data-loader', LOAD_ORIGIN),
        (n.onload = n.onreadystatechange =
          function () {
            const s = this.readyState;
            (s && s !== 'loaded' && s !== 'complete') ||
              (f(), (n.onload = n.onreadystatechange = null));
          }),
        (i = d.getElementsByTagName(t)[0]),
        i.parentNode.insertBefore(n, i);
    })(window, document, 'script', 'https://bat.bing.com/bat.js', this.uniqueId);
  };
  /* eslint-enable */

  init = () => {
    this.loadBingadsScript();
    logger.debug('===in init BingAds===');
  };

  isLoaded = () => {
    logger.debug('in BingAds isLoaded');
    if (typeof window.UET !== 'function') {
      logger.debug('BingAds: UET class is yet to be loaded. Retrying.');
    } else {
      logger.debug('BingAds: UET class is successfully loaded');
    }
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

  track = (rudderElement) => {
    const { type, properties } = rudderElement.message;
    const { eventAction } = properties;
    const eventToSend = eventAction || type;
    if (!eventToSend) {
      logger.error('Event type not present');
      return;
    }

    let payload = {
      ...buildCommonPayload(rudderElement.message),
      ...buildEcommPayload(rudderElement.message),
    };

    let customProperties = {};
    customProperties = extractCustomFields(
      rudderElement.message,
      customProperties,
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

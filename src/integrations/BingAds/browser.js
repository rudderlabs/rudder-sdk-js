import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../ScriptLoader';
import { NAME } from './constants';
import { buildCommonPayload, buildEcommPayload, EXCLUSION_KEYS } from './utils';
import { removeUndefinedAndNullValues } from '../utils/commonUtils';
import { extractCustomFields } from '../../utils/utils';

class BingAds {
  constructor(config) {
    this.tagID = config.tagID;
    this.name = NAME;
    this.uniqueId = `bing${this.tagID}`;
  }

  /* eslint-disable */
  // Destination ref - https://help.ads.microsoft.com/#apex/ads/en/56686/2
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
          (o.q = w[u]), ((w[u] = new UET(o)));
        }),
        (n = d.createElement(t)),
        (n.src = r),
        (n.async = 1),
        n.setAttribute('data-loader', LOAD_ORIGIN),
        (n.onload = n.onreadystatechange =
          function () {
            let s = this.readyState;
            (s && s !== 'loaded' && s !== 'complete' && typeof w['UET'] === 'function') ||
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

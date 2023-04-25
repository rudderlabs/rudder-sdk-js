import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { NAME } from './constants';

class BingAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.tagID = config.tagID;
    this.name = NAME;
    this.areTransformationsConnected = destinationInfo && destinationInfo.areTransformationsConnected;
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
          (o.q = w[u]), (w[u] = w.UET ? new UET(o): logger.error('Blocker faced in loading UET class. Probable solution is to unblock domain bat.bing.com in your browser'));
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
    return !!window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push;
  };

  isReady = () => {
    logger.debug('in BingAds isReady');
    return !!(window[this.uniqueId] && window[this.uniqueId].push !== Array.prototype.push);
  };

  /*
    Visit here(for details Parameter details): https://help.ads.microsoft.com/#apex/3/en/53056/2
    Under: What data does UET collect once I install it on my website?
    Updated syntax doc ref - https://help.ads.microsoft.com/#apex/ads/en/56916/2
  */

  track = (rudderElement) => {
    const { type, properties, event } = rudderElement.message;
    const { category, currency, value, revenue, total } = properties;
    const eventToSend = type;
    if (!eventToSend) {
      logger.error('Event type not present');
      return;
    }
    const payload = {
      event_label: event,
    };
    if (category) {
      payload.event_category = category;
    }
    if (currency) {
      payload.currency = currency;
    }
    if (value) {
      payload.revenue_value = value;
    }
    if (revenue) {
      payload.revenue_value = revenue;
    }
    if (total) {
      payload.revenue_value = total;
    }
    window[this.uniqueId].push('event', eventToSend, payload);
  };

  page = () => {
    window[this.uniqueId].push('pageLoad');
  };
}

export { BingAds };

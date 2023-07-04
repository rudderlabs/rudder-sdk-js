/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/common/v1.1/utils/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/common/v1.1/utils/constants';
import { NAME } from '@rudderstack/common/constants/integrations/CustomerIO/constants';

class CustomerIO {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteID = config.siteID;
    this.apiKey = config.apiKey;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Customer IO init===');
    window._cio = window._cio || [];
    const { siteID } = this;
    (function () {
      let a;
      let b;
      let c;
      a = function (f) {
        return function () {
          window._cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      b = ['load', 'identify', 'sidentify', 'track', 'page'];
      for (c = 0; c < b.length; c++) {
        window._cio[b[c]] = a(b[c]);
      }
      const t = document.createElement('script');
      const s = document.getElementsByTagName('script')[0];
      t.async = true;
      t.setAttribute('data-loader', LOAD_ORIGIN);
      t.id = 'cio-tracker';
      t.setAttribute('data-site-id', siteID);
      t.src = 'https://assets.customer.io/assets/track.js';
      s.parentNode.insertBefore(t, s);
    })();
  }

  identify(rudderElement) {
    logger.debug('in Customer IO identify');
    const userId = rudderElement.message.userId
      ? rudderElement.message.userId
      : rudderElement.message.anonymousId;
    const traits = rudderElement.message.context.traits ? rudderElement.message.context.traits : {};
    const createAt = traits.createdAt;
    if (createAt) {
      traits.created_at = Math.floor(new Date(createAt).getTime() / 1000);
    }
    traits.id = userId;
    window._cio.identify(traits);
  }

  track(rudderElement) {
    logger.debug('in Customer IO track');

    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    window._cio.track(eventName, properties);
  }

  page(rudderElement) {
    logger.debug('in Customer IO page');

    const name = rudderElement.message.name || rudderElement.message.properties.url;
    window._cio.page(name, rudderElement.message.properties);
  }

  isLoaded() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }
}

export { CustomerIO };

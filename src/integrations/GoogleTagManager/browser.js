/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { NAME } from './constants';

class GoogleTagManager {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.containerID = config.containerID;
    this.name = NAME;
    this.serverUrl = config.serverUrl;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init GoogleTagManager===');

    const defaultUrl = `https://www.googletagmanager.com`;

    // ref: https://developers.google.com/tag-platform/tag-manager/server-side/send-data#update_the_gtmjs_source_domain

    window.finalUrl = this.serverUrl ? this.serverUrl : defaultUrl;

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s);
      const dl = l !== 'dataLayer' ? `&l=${l}` : '';
      j.setAttribute('data-loader', LOAD_ORIGIN);
      j.async = true;
      j.src = `${window.finalUrl}/gtm.js?id=${i}${dl}`;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', this.containerID);
  }

  identify(rudderElement) {
    // set the traits to the datalayer and put everything under the key traits
    // keeping it under the traits key as destructing might conflict with `message.properties`
    const rudderMessage = rudderElement.message;
    const props = { traits: rudderMessage.context.traits };
    this.sendToGTMDatalayer(props);
  }

  track(rudderElement) {
    logger.debug('===in track GoogleTagManager===');
    const rudderMessage = rudderElement.message;
    const props = {
      event: rudderMessage.event,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      // set the traits as well if there is any
      // it'll be null/undefined before identify call is made
      traits: rudderMessage.context.traits,
      ...rudderMessage.properties,
    };
    this.sendToGTMDatalayer(props);
  }

  page(rudderElement) {
    logger.debug('===in page GoogleTagManager===');
    const rudderMessage = rudderElement.message;
    const pageName = rudderMessage.name;
    const pageCategory = rudderMessage.properties ? rudderMessage.properties.category : undefined;

    let eventName;

    if (pageName) {
      eventName = `Viewed ${pageName} page`;
    }

    if (pageCategory && pageName) {
      eventName = `Viewed ${pageCategory} ${pageName} page`;
    }
    if (!eventName) {
      eventName = 'Viewed a Page';
    }
    const props = {
      event: eventName,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      // set the traits as well if there is any
      // it'll be null/undefined before identify call is made
      traits: rudderMessage.context.traits,
      ...rudderMessage.properties,
    };

    this.sendToGTMDatalayer(props);
  }

  isLoaded() {
    return !!(window.dataLayer && Array.prototype.push !== window.dataLayer.push);
  }

  sendToGTMDatalayer(props) {
    window.dataLayer.push(props);
  }

  isReady() {
    return !!(window.dataLayer && Array.prototype.push !== window.dataLayer.push);
  }
}

export { GoogleTagManager };

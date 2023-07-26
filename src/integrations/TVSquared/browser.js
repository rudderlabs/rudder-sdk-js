/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import ScriptLoader from '../../utils/ScriptLoader';
import { getAction } from './utils';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

class TVSquared {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.brandId = config.brandId;
    this.clientId = config.clientId;
    this.eventWhiteList = config.eventWhiteList || [];
    this.customMetrics = config.customMetrics || [];
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init TVSquared===');
    window._tvq = window._tvq || [];
    let url = document.location.protocol === 'https:' ? 'https://' : 'http://';
    url += `collector-${this.clientId}.tvsquared.com/`;
    window._tvq.push(['setSiteId', this.brandId]);
    window._tvq.push(['setTrackerUrl', `${url}tv2track.php`]);
    ScriptLoader('TVSquared-integration', `${url}tv2track.js`);
  }

  isLoaded() {
    logger.debug('in TVSqaured isLoaded');
    return !!(window._tvq && window._tvq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('in TVSqaured isReady');
    return !!(window._tvq && window._tvq.push !== Array.prototype.push);
  }

  page(rudderElement) {
    window._tvq.push([
      function () {
        this.deleteCustomVariable(5, 'page');
      },
    ]);
    window._tvq.push(['trackPageView']);
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const { event, userId, anonymousId } = message;

    const whitelistEvents = this.eventWhiteList.filter((wl) => wl.event !== '');

    const isEventInWhiteList = whitelistEvents.some(
      (whitelistEvent) => whitelistEvent.event.toUpperCase() === event.toUpperCase(),
    );

    if (!isEventInWhiteList) {
      return;
    }

    const session = { user: userId || anonymousId || '' };
    const action = getAction(message, this.customMetrics);

    window._tvq.push([
      function () {
        this.setCustomVariable(5, 'session', JSON.stringify(session), 'visit');
      },
    ]);

    if (event.toUpperCase() !== 'RESPONSE') {
      window._tvq.push([
        function () {
          this.setCustomVariable(5, event, JSON.stringify(action), 'page');
        },
      ]);
      window._tvq.push(['trackPageView']);
    } else {
      window._tvq.push([
        function () {
          this.deleteCustomVariable(5, 'page');
        },
      ]);
    }
  }
}
export default TVSquared;

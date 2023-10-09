/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import { NAME, DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/TVSquared/constants';
import Logger from '../../utils/logger';
import { getAction } from './utils';

const logger = new Logger(NAME);

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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window._tvq = window._tvq || [];
    let url = document.location.protocol === 'https:' ? 'https://' : 'http://';
    url += `collector-${this.clientId}.tvsquared.com/`;
    window._tvq.push(['setSiteId', this.brandId]);
    window._tvq.push(['setTrackerUrl', `${url}tv2track.php`]);
    ScriptLoader('TVSquared-integration', `${url}tv2track.js`);
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!(window._tvq && window._tvq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
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

    const whitelistEvents = this.eventWhiteList.filter(wl => wl.event !== '');

    const isEventInWhiteList = whitelistEvents.some(
      whitelistEvent => whitelistEvent.event.toUpperCase() === event.toUpperCase(),
    );

    if (!isEventInWhiteList && whitelistEvents.length > 0) {
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

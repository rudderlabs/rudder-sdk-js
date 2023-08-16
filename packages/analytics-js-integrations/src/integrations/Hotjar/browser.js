/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/utilsV1/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Hotjar/constants';

class Hotjar {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteID;
    this.name = NAME;
    this._ready = false;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===In init Hotjar===');

    window.hotjarSiteId = this.siteId;
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: h.hotjarSiteId, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.setAttribute('data-loader', LOAD_ORIGIN);
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    this._ready = true;
  }

  identify(rudderElement) {
    logger.debug('===In Hotjar identify===');

    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId) {
      logger.debug('[Hotjar] identify:: user id is required');
      return;
    }

    const { traits } = rudderElement.message.context;

    window.hj('identify', rudderElement.message.userId, traits);
  }

  track(rudderElement) {
    logger.debug('===In Hotjar track===');

    const { event } = rudderElement.message;

    if (!event) {
      logger.error('Event name not present');
      return;
    }

    // event name must not exceed 750 characters and can only contain alphanumeric, underscores, and dashes.
    // Ref - https://help.hotjar.com/hc/en-us/articles/4405109971095#the-events-api-call
    window.hj('event', event.replace(/\s\s+/g, ' ').substring(0, 750).replaceAll(' ', '_'));
  }

  page() {
    logger.debug('===In Hotjar page===');
    logger.debug('[Hotjar] page:: method not supported');
  }

  isLoaded() {
    logger.debug('===In isLoaded Hotjar===');
    return this._ready;
  }

  isReady() {
    logger.debug('===In isReady Hotjar===');
    return this._ready;
  }
}

export { Hotjar };

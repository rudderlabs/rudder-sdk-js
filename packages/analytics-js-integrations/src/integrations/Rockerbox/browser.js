/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Rockerbox/constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { getHashFromArray } from '../../utils/commonUtils';

class Rockerbox {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.clientAuthId = config.clientAuthId;
    this.name = NAME;
    this.customDomain = config.customDomain;
    this.enableCookieSync = config.enableCookieSync;
    this.eventsMap = config.eventsMap || [];
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.connectionMode = config.connectionMode;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('=== In init Rockerbox ===');
    const host = this.customDomain ? this.customDomain : 'getrockerbox.com';
    const library = this.customDomain && this.enableCookieSync ? 'wxyz.rb' : 'wxyz.v2';
    (function (d, RB) {
      if (!window.RB) {
        window.RB = RB;
        RB.queue = RB.queue || [];
        RB.track =
          RB.track ||
          function () {
            RB.queue.push(Array.prototype.slice.call(arguments));
          };
        RB.initialize = function (s) {
          RB.source = s;
        };
        const a = d.createElement('script');
        a.type = 'text/javascript';
        a.async = !0;
        a.src = `https://${host}/assets/${library}.js`;
        a.dataset.loader = LOAD_ORIGIN;
        const f = d.getElementsByTagName('script')[0];
        f.parentNode.insertBefore(a, f);
      }
    })(document, window.RB || {});
    window.RB.disablePushState = true;
    window.RB.queue = [];
    window.RB.initialize(this.clientAuthId);
  }

  isLoaded() {
    logger.debug('===In isLoaded Rockerbox===');
    return !!window.RB && !!window.RB.loaded;
  }

  isReady() {
    logger.debug('===In isReady Rockerbox===');
    return !!window.RB;
  }

  identify(rudderElement) {
    logger.debug('===In Rockerbox Identify===');
    const { message } = rudderElement;
    const { userId, anonymousId, traits, context } = message;
    if (!userId) {
      logger.debug('userId is needed. A primary identifier is expected by RockerBox');
    }
    const email = traits?.email || context?.traits?.email;
    window.RB.track('identify', {
      external_id: userId,
      anonymousId,
      email,
      phone_number: traits?.phone || context?.traits?.phone,
    });
  }

  track(rudderElement) {
    if (this.connectionMode === 'hybrid') {
      logger.info(
        'The connectionMode is set to hybrid. Track call will not be sent via device mode.',
      );
      return;
    }
    logger.debug('===In Rockerbox track===');

    const { message } = rudderElement;
    const { event, anonymousId, properties } = message;
    if (!event) {
      logger.error('Event name not present');
      return;
    }
    const eventsHashmap = getHashFromArray(this.eventsMap);
    const rbEvent = eventsHashmap[event.toLowerCase()];
    if (rbEvent) {
      window.RB.track(rbEvent, { ...properties, anonymousId });
    } else {
      logger.error(`The event ${event} is not mapped to any Rockerbox Event. Aborting!`);
    }
  }

  page(rudderElement) {
    logger.debug('=== In Rockerbox Page ===');
    const { message } = rudderElement;
    const { anonymousId, properties } = message;
    window.RB.track('view', { ...properties, anonymousId });
  }
}

export default Rockerbox;

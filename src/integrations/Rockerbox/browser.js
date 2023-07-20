/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { getHashFromArray } from '../../utils/commonUtils';

class Rockerbox {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) logger.setLogLevel(analytics.logLevel);
    this.clientAuthId = config.clientAuthId;
    this.name = NAME;
    this.customDomain = config.customDomain;
    this.enableCookieSync = config.enableCookieSync;
    this.eventsMap = config.eventsMap || [];
    this.useNativeSDKToSend = config.useNativeSDKToSend;
    this.areTransformationsConnected = destinationInfo && destinationInfo.areTransformationsConnected;
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
    const { userId, anonymousId } = message;
    if (!userId) {
      logger.debug('userId is needed. A primary identifier is expected by RockerBox');
    }
    const email = message.traits?.email || message.context?.traits?.email;
    window.RB.track('identify', {
      external_id: userId,
      anonymousId,
      email,
      phone_number: message.traits?.phone || message.context?.traits?.phone,
    });
  }

  track(rudderElement) {
    if (!this.useNativeSDKToSend) {
      logger.info(
        'The useNativeSDKToSend toggle is disabled. Track call will not be sent via device mode.',
      );
      return;
    }
    logger.debug('===In Rockerbox track===');

    const { message } = rudderElement;
    const { event, anonymousId } = message;
    if (!event) {
      logger.error('Event name not present');
      return;
    }
    const eventsHashmap = getHashFromArray(this.eventsMap);
    const rbEvent = eventsHashmap[event.toLowerCase()];
    if (rbEvent) {
      window.RB.track(rbEvent, { ...message.properties, anonymousId });
    } else {
      logger.error(`The event ${message.event} is not mapped to any Rockerbox Event. Aborting!`);
    }
  }

  page(rudderElement) {
    logger.debug('=== In Rockerbox Page ===');
    const { message } = rudderElement;
    const { anonymousId } = message;
    window.RB.track('view', { ...message.properties, anonymousId });
  }
}

export default Rockerbox;

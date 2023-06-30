/* eslint-disable*/
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME, eventNameMapping } from './constants';
import {
  getHashFromArrayWithDuplicate,
  getDestinationExternalID,
  isDefinedAndNotNull,
} from '../../utils/commonUtils';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { getTrackResponse } from './util';

// Docs : https://ads.tiktok.com/gateway/docs/index
class TiktokAds {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.analytics = analytics;
    this.eventsToStandard = config.eventsToStandard;
    this.pixelCode = config.pixelCode;
    this.shouldApplyDeviceModeTransformation =
      destinationInfo && destinationInfo.shouldApplyDeviceModeTransformation;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Tiktok Ads===');
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      (ttq.methods = [
        'page',
        'track',
        'identify',
        'instances',
        'debug',
        'on',
        'off',
        'once',
        'ready',
        'alias',
        'group',
        'enableCookie',
        'disableCookie',
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = i),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement('script');
          o.setAttribute('data-loader', LOAD_ORIGIN);
          (o.type = 'text/javascript'), (o.async = !0), (o.src = i + '?sdkid=' + e + '&lib=' + t);
          var a = document.getElementsByTagName('script')[0];
          a.parentNode.insertBefore(o, a);
        });
    })(window, document, 'ttq');
    ttq.load(this.pixelCode);
  }

  isLoaded() {
    logger.debug('===In isLoaded Tiktok Ads===');
    return !!window.ttq;
  }

  isReady() {
    logger.debug('===In isReady Tiktok Ads===');
    return !!window.ttq;
  }

  identify(rudderElement) {
    logger.debug('===In Tiktok Ads Identify===');
    const { message } = rudderElement;
    const { traits } = message.context;
    const { email, phone, number } = traits;
    const payload = {};
    if (isDefinedAndNotNull(email)) {
      payload.email = email;
    }
    if (isDefinedAndNotNull(phone) || isDefinedAndNotNull(number)) {
      payload.phone = phone || number;
    }
    if (Object.keys(payload).length > 0) {
      const externalId = getDestinationExternalID(message, 'tiktokExternalId');
      if (isDefinedAndNotNull(externalId)) {
        window.ttq.identify(externalId, payload);
      } else {
        window.ttq.identify(payload);
      }
    }
  }

  track(rudderElement) {
    logger.debug('===In Tiktok Ads Track===');
    const { message } = rudderElement;
    let event = message?.event;
    if (!event) {
      logger.error('Event name is required');
      return;
    }
    event = event.toLowerCase().trim();
    const standardEventsMap = getHashFromArrayWithDuplicate(this.eventsToStandard);
    if (eventNameMapping[event] === undefined && !standardEventsMap[event]) {
      logger.error(`Event name (${event}) is not valid, must be mapped to one of standard events`);
      return;
    }
    if (standardEventsMap[event]) {
      Object.keys(standardEventsMap).forEach((key) => {
        if (key === event) {
          standardEventsMap[event].forEach((eventName) => {
            const updatedProperties = getTrackResponse(message);
            window.ttq.track(eventName, updatedProperties);
          });
        }
      });
    } else {
      event = eventNameMapping[event];
      const updatedProperties = getTrackResponse(message, Config, event);
      window.ttq.track(event, updatedProperties);
    }
  }

  page(rudderElement) {
    logger.debug('===In Tiktok Ads Page===');
    window.ttq.page();
  }
}

export default TiktokAds;

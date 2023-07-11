/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/LiveChat/constants';
import { recordingLiveChatEvents } from './util';
import { isObject } from '../../utils/utils';
import { flattenJson } from '../../utils/commonUtils';

class LiveChat {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.licenseId = config.licenseId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Livechat===');
    window.__lc = window.__lc || {};
    window.__lc.license = this.licenseId;
    (function (n, t, c) {
      function i(n) {
        return e._h ? e._h.apply(null, n) : e._q.push(n);
      }
      var e = {
        _q: [],
        _h: null,
        _v: '2.0',
        on: function () {
          i(['on', c.call(arguments)]);
        },
        once: function () {
          i(['once', c.call(arguments)]);
        },
        off: function () {
          i(['off', c.call(arguments)]);
        },
        get: function () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(['get', c.call(arguments)]);
        },
        call: function () {
          i(['call', c.call(arguments)]);
        },
        init: function () {
          var n = t.createElement('script');
          (n.async = !0),
            (n.type = 'text/javascript'),
            (n.src = 'https://cdn.livechatinc.com/tracking.js'),
            t.head.appendChild(n);
        },
      };
      !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
    })(window, document, [].slice);
  }

  isLoaded() {
    logger.debug('===In isLoaded LiveChat===');
    return !!(window.LiveChatWidget && isObject(window.LiveChatWidget));
  }

  isReady() {
    logger.debug('===In isReady LiveChat===');

    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      recordingLiveChatEvents(
        this.updateEventNames,
        this.eventsList,
        this.eventsToStandard,
        this.analytics,
      );
    }
    return !!window.LiveChatWidget;
  }

  identify(rudderElement) {
    logger.debug('===In LiveChat Identify===');
    const { message } = rudderElement;
    const { userId, context } = message;
    const { traits } = context;
    const email = get(message, 'context.traits.email');

    if (email) {
      window.LiveChatWidget.call('set_customer_email', email);
    } else {
      logger.error('User parameter (email) ,required for identify call, not found.');
    }

    const name = get(message, 'context.traits.name');

    if (name) {
      window.LiveChatWidget.call('set_customer_name', name);
    }
    if (traits) {
      const flattenTraits = flattenJson(traits);
      if (userId) flattenTraits.userId = userId;
      window.LiveChatWidget.call('set_session_variables', flattenTraits);
    }
  }
}

export default LiveChat;

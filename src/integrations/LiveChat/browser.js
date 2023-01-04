/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';

import { recordingLiveChatEvents } from './util';
import { flattenJson, isObject } from '../../utils/commonUtils';
import { NAME } from './constants';

class LiveChat {
  constructor(config) {
    this.name = NAME;
    this.licenseId = config.licenseId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
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
        on () {
          i(['on', c.call(arguments)]);
        },
        once () {
          i(['once', c.call(arguments)]);
        },
        off () {
          i(['off', c.call(arguments)]);
        },
        get () {
          if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
          return i(['get', c.call(arguments)]);
        },
        call () {
          i(['call', c.call(arguments)]);
        },
        init () {
          const n = t.createElement('script');
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

    // Dasboard Other Settings
    if (this.recordLiveChatEvents) {
      recordingLiveChatEvents(this.updateEventNames, this.eventsList, this.eventsToStandard);
    }
    return !!window.LiveChatWidget;
  }

  identify(rudderElement) {
    logger.debug('===In LiveChat Identify===');
    const { message } = rudderElement;
    const { userId } = message;
    const { traits } = rudderElement.message.context;
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

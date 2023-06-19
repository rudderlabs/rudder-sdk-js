/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from './constants';
import Logger from '../../utils/logger';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { recordingLiveChatEvents } from './utils';
import { getHashFromArray } from '../../utils/commonUtils';
import { getDefinedTraits } from '../../utils/utils';

const logger = new Logger(NAME);
class Olark {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteId;
    this.groupId = config.groupId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.standardToEvent = config.standardToEvent;
    this.updateEventNames = config.updateEventNames;
    this.name = NAME;
    this.enableTransformationForDeviceMode =
      destinationInfo && destinationInfo.enableTransformationForDeviceMode;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    (function (o, l, a, r, k, y) {
      if (o.olark) return;
      r = 'script';
      y = l.createElement(r);
      r = l.getElementsByTagName(r)[0];
      y.async = 1;
      y.src = '//' + a;
      y.setAttribute('data-loader', LOAD_ORIGIN);
      r.parentNode.insertBefore(y, r);
      y = o.olark = function () {
        k.s.push(arguments);
        k.t.push(+new Date());
      };
      y.extend = function (i, j) {
        y('extend', i, j);
      };
      y.identify = function (i) {
        y('identify', (k.i = i));
      };
      y.configure = function (i, j) {
        y('configure', i, j);
        k.c[i] = j;
      };
      k = y._ = { s: [], t: [+new Date()], c: {}, l: a };
    })(window, document, 'static.olark.com/jsclient/loader.js');
    /* custom configuration goes here (www.olark.com/documentation) */
    window.olark.identify(this.siteId);

    if (this.groupId) {
      window.olark('api.chat.setOperatorGroup', { group: this.groupId });
    }
  }

  init() {
    logger.debug('===In init Olark===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Olark===');
    return !!window.olark;
  }

  isReady() {
    logger.debug('===In isReady Olark===');

    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.standardToEvent, 'from', 'to', false);

      recordingLiveChatEvents(this.updateEventNames, standardEventsMap, this.analytics);
    }
    return !!window.olark;
  }

  identify(rudderElement) {
    logger.debug('===In Olark Identify===');
    const { message } = rudderElement;
    const { context } = message;

    const userTraits = getDefinedTraits(message);

    if (context.traits) {
      const { traits } = context;
      window.olark('api.visitor.updateCustomFields', traits);
    }

    if (userTraits?.email) {
      window.olark('api.visitor.updateEmailAddress', {
        emailAddress: userTraits.email,
      });
    }

    if (userTraits?.name) {
      window.olark('api.visitor.updateFullName', {
        fullName: userTraits.name,
      });
    }

    if (userTraits?.phone) {
      window.olark('api.visitor.updatePhoneNumber', {
        phoneNumber: userTraits.phone,
      });
    }
  }
}

export default Olark;

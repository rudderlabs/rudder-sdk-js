/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
// disabled these for Lytics js tag
/* eslint-disable no-plusplus */
/* eslint-disable block-scoped-var */
/* eslint-disable no-sequences */
/* eslint-disable yoda */
/* eslint-disable prefer-spread */
// disabling these eslint which are caused by the Lytics js tag

/* eslint-disable prefer-rest-params */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
/* eslint-disable no-void */
/* eslint-disable no-unused-expressions */
/* eslint-disable one-var */
/* eslint-disable lines-around-directive */
/* eslint-disable strict */
/* eslint-disable import/no-relative-packages */
import logger from '../../../../analytics-v1.1/src/utils/logUtil';
import { LOAD_ORIGIN } from '../../../../analytics-v1.1/src/utils/ScriptLoader';
import { NAME } from './constants';

class Lytics {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.accountId = config.accountId;
    this.stream = config.stream;
    this.blockload = config.blockload;
    this.loadid = config.loadid;
    this.name = NAME;
    this.forFirstName = ['firstname', 'firstName'];
    this.forLastName = ['lastname', 'lastName'];
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadLyticsScript() {
    (function () {
      'use strict';
      var o = window.jstag || (window.jstag = {}),
        r = [];
      function n(e) {
        o[e] = function () {
          for (var n = arguments.length, t = new Array(n), i = 0; i < n; i++) t[i] = arguments[i];
          r.push([e, t]);
        };
      }
      n('send'),
        n('mock'),
        n('identify'),
        n('pageView'),
        n('unblock'),
        n('getid'),
        n('setid'),
        n('loadEntity'),
        n('getEntity'),
        n('on'),
        n('once'),
        n('call'),
        (o.loadScript = function (n, t, i) {
          var e = document.createElement('script');
          (e.async = !0),
            (e.src = n),
            (e.onload = t),
            (e.onerror = i),
            e.setAttribute('data-loader', LOAD_ORIGIN);
          var o = document.getElementsByTagName('script')[0],
            r = (o && o.parentNode) || document.head || document.body,
            c = o || r.lastChild;
          return null != c ? r.insertBefore(e, c) : r.appendChild(e), this;
        }),
        (o.init = function n(t) {
          return (
            (this.config = t),
            this.loadScript(t.src, function () {
              if (o.init === n) throw new Error('Load error!');
              // eslint-disable-next-line no-unused-expressions
              o.init(o.config),
                // eslint-disable-next-line func-names
                (function () {
                  for (var n = 0; n < r.length; n++) {
                    var t = r[n][0],
                      i = r[n][1];
                    o[t].apply(o, i);
                  }
                  r = void 0;
                })();
            }),
            this
          );
        });
    })();

    // Define config and initialize Lytics tracking tag.
    window.jstag.init({
      loadid: this.loadid,
      blocked: this.blockload,
      stream: this.stream,
      sessecs: 1800,
      src:
        document.location.protocol === 'https:'
          ? `https://c.lytics.io/api/tag/${this.accountId}/latest.min.js`
          : `http://c.lytics.io/api/tag/${this.accountId}/latest.min.js`,
      pageAnalysis: {
        dataLayerPull: {
          disabled: true,
        },
      },
    });
  }

  init() {
    this.loadLyticsScript();
    logger.debug('===in init Lytics===');
  }

  isLoaded() {
    logger.debug('in Lytics isLoaded');
    logger.debug(!!(window.jstag && window.jstag.push !== Array.prototype.push));
    return !!(window.jstag && window.jstag.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('in Lytics isReady');
    return !!(window.jstag && window.jstag.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    logger.debug('in Lytics identify');
    // eslint-disable-next-line camelcase
    const user_id = rudderElement.message.userId || rudderElement.message.anonymousId;
    const { traits } = rudderElement.message.context;
    const payload = { user_id, ...traits };
    this.handleName(payload);
    window.jstag.send(this.stream, payload);
  }

  page(rudderElement) {
    logger.debug('in Lytics page');
    const { properties } = rudderElement.message;
    const payload = { event: rudderElement.message.name, ...properties };
    this.handleName(payload);
    window.jstag.pageView(this.stream, payload);
  }

  track(rudderElement) {
    logger.debug('in Lytics track');
    const { properties } = rudderElement.message;
    const payload = { _e: rudderElement.message.event, ...properties };
    this.handleName(payload);
    window.jstag.send(this.stream, payload);
  }

  handleName(payload) {
    this.forFirstName.forEach(key => {
      if (payload[key]) {
        payload.first_name = payload[key];
        delete payload[key];
      }
    });
    this.forLastName.forEach(key => {
      if (payload[key]) {
        payload.last_name = payload[key];
        delete payload[key];
      }
    });
    return payload;
  }
}
export default Lytics;

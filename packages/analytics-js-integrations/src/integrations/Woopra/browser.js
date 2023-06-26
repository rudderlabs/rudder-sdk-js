/* eslint-disable*/
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/common/utils/logUtil';
import { NAME } from './constants';
import { LOAD_ORIGIN } from '@rudderstack/common/utils/constants';

class Woopra {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.projectName = config.projectName;
    this.name = NAME;
    this.cookieName = config.cookieName;
    this.cookiePath = config.cookiePath;
    this.cookieDomain = config.cookieDomain;
    this.clickTracking = config.clickTracking;
    this.downloadTracking = config.downloadTracking;
    this.hideCampaign = config.hideCampaign;
    this.idleTimeout = config.idleTimeout;
    this.ignoreQueryUrl = config.ignoreQueryUrl;
    this.outgoingIgnoreSubdomain = config.outgoingIgnoreSubdomain;
    this.outgoingTracking = config.outgoingTracking;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Woopra===');
    !(function () {
      var t,
        o,
        c,
        e = window,
        n = document,
        r = arguments,
        a = 'script',
        i = [
          'call',
          'cancelAction',
          'config',
          'identify',
          'push',
          'track',
          'trackClick',
          'trackForm',
          'update',
          'visit',
        ],
        s = function () {
          var t,
            o = this,
            c = function (t) {
              o[t] = function () {
                return o._e.push([t].concat(Array.prototype.slice.call(arguments, 0))), o;
              };
            };
          for (o._e = [], t = 0; t < i.length; t++) c(i[t]);
        };
      for (e.__woo = e.__woo || {}, t = 0; t < r.length; t++)
        e.__woo[r[t]] = e[r[t]] = e[r[t]] || new s();
      ((o = n.createElement(a)).async = 1),
        (o.src = 'https://static.woopra.com/w.js'),
        o.setAttribute('data-loader', LOAD_ORIGIN),
        (c = n.getElementsByTagName(a)[0]).parentNode.insertBefore(o, c);
    })('Woopra');
    window.Woopra.config({
      domain: this.projectName,
      cookie_name: this.cookieName,
      cookie_path: this.cookiePath,
      cookie_domain: this.cookieDomain,
      click_tracking: this.clickTracking,
      download_tracking: this.downloadTracking,
      hide_campaign: this.hideCampaign,
      idle_timeout: this.idleTimeout,
      ignore_query_url: this.ignoreQueryUrl,
      outgoing_ignore_subdomain: this.outgoingIgnoreSubdomain,
      outgoing_tracking: this.outgoingTracking,
    });
  }

  isLoaded() {
    logger.debug('===In isLoaded Woopra===');
    return !!(window.Woopra && window.Woopra.loaded);
  }

  isReady() {
    logger.debug('===In isReady Woopra===');
    return !!window.Woopra;
  }

  identify(rudderElement) {
    logger.debug('===In Woopra Identify===');
    const { traits } = rudderElement.message.context;
    if (traits) {
      window.Woopra.identify(traits).push();
    }
  }

  track(rudderElement) {
    logger.debug('===In Woopra Track===');
    const { event, properties } = rudderElement.message;
    window.Woopra.track(event, properties);
  }

  page(rudderElement) {
    logger.debug('===In Woopra Page ===');
    const { name, properties, category } = rudderElement.message;
    const pageCat = category ? `${category} ` : '';
    const pageName = name ? `${name} ` : '';
    const eventName = `Viewed ${pageCat}${pageName}Page`;
    window.Woopra.track(eventName, properties);
  }
}

export default Woopra;

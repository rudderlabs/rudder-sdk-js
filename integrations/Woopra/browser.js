/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
// Research Spec: https://www.notion.so/rudderstacks/Woopra-Device-Mode-Research-Spec-adc482ccf8094965b539bce2453822a7

import logger from '../../utils/logUtil';

import { NAME } from './constants';

class Woopra {
  constructor(config) {
    this.projectName = config.projectName;
    this.name = NAME;
  }

  loadScript() {
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
        (c = n.getElementsByTagName(a)[0]).parentNode.insertBefore(o, c);
    })('Woopra');
    window.Woopra.config({
      domain: this.projectName, // This is the minimum required config
    });
  }

  init() {
    logger.debug('===In init Woopra===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Woopra===');
    return !!(window.Woopra && window.Woopra.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug('===In isReady Woopra===');
    return window.Woopra;
  }

  identify(rudderElement) {
    console.log('in identify sdk');
    logger.debug('===In Woopra Identify===');
    const { traits } = rudderElement.message;
    window.Woopra.identify(traits).push();
  }

  track(rudderElement) {
    logger.debug('===In Woopra track===');
    const { event, properties } = rudderElement.message;
    window.Woopra.track(event, properties);
  }

  page(rudderElement) {
    const { name, properties } = rudderElement.message;
    window.Woopra.track(name, properties);
  }
}

export default Woopra;

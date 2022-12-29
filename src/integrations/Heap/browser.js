/* eslint-disable class-methods-use-this */

import processHeapProperties from './util';
import { NAME } from './constants';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

class Heap {
  constructor(config) {
    this.appId = config.appId;
    this.name = NAME;
  }

  /**
   * Initialise Heap
   * DOC: https://developers.heap.io/docs/web
   */

  init() {
    (window.heap = window.heap || []),
      (heap.load = function (e, t) {
        (window.heap.appid = e), (window.heap.config = t = t || {});
        const r = document.createElement('script');
        (r.type = 'text/javascript'),
          (r.async = !0),
          r.setAttribute('data-loader', LOAD_ORIGIN),
          (r.src = `https://cdn.heapanalytics.com/js/heap-${e}.js`);
        const a = document.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(r, a);
        for (
          let n = function (e) {
              return function () {
                heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
              };
            },
            p = [
              'addEventProperties',
              'addUserProperties',
              'clearEventProperties',
              'identify',
              'resetIdentity',
              'removeEventProperty',
              'setEventProperties',
              'track',
              'unsetEventProperty',
            ],
            o = 0;
          o < p.length;
          o++
        )
          heap[p[o]] = n(p[o]);
      });
    window.heap.load(this.appId);
  }

  /**
   * Check if loaaded
   */

  isLoaded() {
    return !!(window.heap && window.heap.appid);
  }

  /**
   * Check if Ready
   */

  isReady() {
    return !!(window.heap && window.heap.appid);
  }

  // DOC: https://developers.heap.io/reference#identify

  identify(rudderElement) {
    const { userId, context } = rudderElement.message;
    if (userId) {
      window.heap.identify(userId);
    }
    const { traits } = context;
    // DOC: https://developers.heap.io/reference#adduserproperties
    window.heap.addUserProperties(processHeapProperties(traits));
  }

  // DOC: https://developers.heap.io/reference#track

  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    window.heap.track(event, processHeapProperties(properties));
  }
}

export default Heap;

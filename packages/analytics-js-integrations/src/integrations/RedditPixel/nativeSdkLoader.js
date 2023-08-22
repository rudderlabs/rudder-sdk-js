import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(advertiserId) {
  !(function (w, d) {
    if (!w.rdt) {
      var p = (w.rdt = function () {
        p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
      });
      p.callQueue = [];
      var t = d.createElement('script');
      (t.src = 'https://www.redditstatic.com/ads/pixel.js'), (t.async = !0);
      t.setAttribute('data-loader', LOAD_ORIGIN);
      var s = d.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(t, s);
    }
  })(window, document);

  window.rdt('init', advertiserId);
}

export { loadNativeSdk };

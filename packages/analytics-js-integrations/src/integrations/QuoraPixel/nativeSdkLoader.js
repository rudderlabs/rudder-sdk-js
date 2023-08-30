import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(pixelId) {
  !(function (q, e, v, n, t, s) {
    if (q.qp) return;
    n = q.qp = function () {
      n.qp ? n.qp.apply(n, arguments) : n.queue.push(arguments);
    };
    n.queue = [];
    t = document.createElement(e);
    t.async = !0;
    t.src = v;
    t.setAttribute('data-loader', LOAD_ORIGIN);
    s = document.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, 'script', 'https://a.quora.com/qevents.js');
  window.qp('init', pixelId);
  window.qp('track', 'ViewContent');
}

export { loadNativeSdk };

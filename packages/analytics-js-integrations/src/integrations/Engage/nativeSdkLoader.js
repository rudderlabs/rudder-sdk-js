import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk() {
  !(function (n) {
    if (!window.Engage) {
      (window[n] = window[n] || {}),
        (window[n].queue = window[n].queue || []),
        (window.Engage = window.Engage || {});
      for (var e = ['init', 'identify', 'addAttribute', 'track'], i = 0; i < e.length; i++)
        window.Engage[e[i]] = w(e[i]);
      var d = document.createElement('script');
      (d.src = '//d2969mkc0xw38n.cloudfront.net/next/engage.min.js'),
        d.setAttribute('data-loader', LOAD_ORIGIN),
        (d.async = !0),
        document.head.appendChild(d);
    }
    function w(e) {
      return function () {
        window[n].queue.push([e].concat([].slice.call(arguments)));
      };
    }
  })('engage');
}

export { loadNativeSdk };

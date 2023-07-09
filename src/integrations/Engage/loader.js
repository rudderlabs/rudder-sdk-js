import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(n) {
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
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

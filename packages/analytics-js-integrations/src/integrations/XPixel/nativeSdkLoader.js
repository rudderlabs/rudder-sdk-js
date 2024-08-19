import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(pixelId) {
  !(function (e, t, n, s, u, a) {
    e.twq ||
      ((s = e.twq =
        function () {
          s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
        }),
      (s.version = '1.1'),
      (s.queue = []),
      (u = t.createElement(n)),
      (u.async = !0),
      (u.src = 'https://static.ads-twitter.com/uwt.js'),
      (a = t.getElementsByTagName(n)[0]),
      u.setAttribute('data-loader', LOAD_ORIGIN),
      a.parentNode.insertBefore(u, a));
  })(window, document, 'script');
  twq('config', pixelId);
}

export { loadNativeSdk };

import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(customDomain, enableCookieSync, clientAuthId) {
  const host = customDomain ? customDomain : 'getrockerbox.com';
  const library = customDomain && enableCookieSync ? 'wxyz.rb' : 'wxyz.v2';
  (function (d, RB) {
    if (!window.RB) {
      window.RB = RB;
      RB.queue = RB.queue || [];
      RB.track =
        RB.track ||
        function () {
          RB.queue.push(Array.prototype.slice.call(arguments));
        };
      RB.initialize = function (s) {
        RB.source = s;
      };
      const a = d.createElement('script');
      a.type = 'text/javascript';
      a.async = !0;
      a.src = `https://${host}/assets/${library}.js`;
      a.dataset.loader = LOAD_ORIGIN;
      const f = d.getElementsByTagName('script')[0];
      f.parentNode.insertBefore(a, f);
    }
  })(document, window.RB || {});
  window.RB.disablePushState = true;
  window.RB.queue = [];
  window.RB.initialize(clientAuthId);
}

export { loadNativeSdk };

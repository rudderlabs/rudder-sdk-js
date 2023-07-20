import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk() {
  (function (e, t, n) {
    if (e.snaptr) return;
    var a = (e.snaptr = function () {
      a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments);
    });
    a.queue = [];
    const s = 'script';
    const r = t.createElement(s);
    r.async = !0;
    r.src = n;
    r.setAttribute('data-loader', LOAD_ORIGIN);
    const u = t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');
}

export { loadNativeSdk };

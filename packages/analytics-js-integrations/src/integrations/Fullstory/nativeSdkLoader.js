import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(fs_debug_mode, fs_host, fs_org) {
  window._fs_debug = fs_debug_mode;
  window._fs_host = fs_host;
  window._fs_script = 'edge.fullstory.com/s/fs.js';
  window._fs_org = fs_org;
  window._fs_namespace = 'FS';

  (function (m, n, e, t, l, o, g, y) {
    if (e in m) {
      if (m.console && m.console.log) {
        m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
      }
      return;
    }
    g = m[e] = function (a, b, s) {
      g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
    };
    g.q = [];
    o = n.createElement(t);
    o.async = 1;
    o.crossOrigin = 'anonymous';
    o.src = `https://${_fs_script}`;
    o.setAttribute('data-loader', LOAD_ORIGIN);
    y = n.getElementsByTagName(t)[0];
    y.parentNode.insertBefore(o, y);
    g.identify = function (i, v, s) {
      g(l, { uid: i }, s);
      if (v) g(l, v, s);
    };
    g.setUserVars = function (v, s) {
      g(l, v, s);
    };
    g.event = function (i, v, s) {
      g('event', { n: i, p: v }, s);
    };
    g.shutdown = function () {
      g('rec', !1);
    };
    g.restart = function () {
      g('rec', !0);
    };
    g.log = function (a, b) {
      g('log', [a, b]);
    };
    g.consent = function (a) {
      g('consent', !arguments.length || a);
    };
    g.identifyAccount = function (i, v) {
      o = 'account';
      v = v || {};
      v.acctId = i;
      g(o, v);
    };
    g.clearUserCookie = function () {};
    g._w = {};
    y = 'XMLHttpRequest';
    g._w[y] = m[y];
    y = 'fetch';
    g._w[y] = m[y];
    if (m[y])
      m[y] = function () {
        return g._w[y].apply(this, arguments);
      };
  })(window, document, window._fs_namespace, 'script', 'user');
}

export { loadNativeSdk };

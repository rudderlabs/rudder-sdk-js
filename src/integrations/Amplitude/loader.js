import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
// START-NO-SONAR-SCAN
/* eslint-disable */

function loader(e, t) {
  'use strict';
  var n = e.amplitude || { _q: [], _iq: {} };
  if (n.invoked)
    e.console && console.error && console.error('Amplitude snippet has been loaded.');
  else {
    var r = function (e, t) {
      e.prototype[t] = function () {
        return (
          this._q.push({ name: t, args: Array.prototype.slice.call(arguments, 0) }), this
        );
      };
    },
      s = function (e, t, n) {
        return function (r) {
          e._q.push({ name: t, args: Array.prototype.slice.call(n, 0), resolve: r });
        };
      },
      o = function (e, t, n) {
        e[t] = function () {
          if (n)
            return { promise: new Promise(s(e, t, Array.prototype.slice.call(arguments))) };
        };
      },
      i = function (e) {
        for (var t = 0; t < y.length; t++) o(e, y[t], !1);
        for (var n = 0; n < g.length; n++) o(e, g[n], !0);
      };
    n.invoked = !0;
    var a = t.createElement('script');
    a.setAttribute('data-loader', LOAD_ORIGIN),
      (a.type = 'text/javascript'),
      (a.integrity =
        'sha384-TPZhteUkZj8CAyBx+GZZytBdkuKnhKsSKcCoVCq0QSteWf/Kw5Kb9oVFUROLE1l3'),
      (a.crossOrigin = 'anonymous'),
      (a.async = !0),
      (a.src = 'https://cdn.amplitude.com/libs/analytics-browser-1.9.1-min.js.gz'),
      (a.onload = function () {
        e.amplitude.runQueuedFunctions ||
          console.log('[Amplitude] Error: could not load SDK');
      });
    var c = t.getElementsByTagName('script')[0];
    c.parentNode.insertBefore(a, c);
    for (
      var u = function () {
        return (this._q = []), this;
      },
      l = [
        'add',
        'append',
        'clearAll',
        'prepend',
        'set',
        'setOnce',
        'unset',
        'preInsert',
        'postInsert',
        'remove',
        'getUserProperties',
      ],
      p = 0;
      p < l.length;
      p++
    )
      r(u, l[p]);
    n.Identify = u;
    for (
      var d = function () {
        return (this._q = []), this;
      },
      f = [
        'getEventProperties',
        'setProductId',
        'setQuantity',
        'setPrice',
        'setRevenue',
        'setRevenueType',
        'setEventProperties',
      ],
      v = 0;
      v < f.length;
      v++
    )
      r(d, f[v]);
    n.Revenue = d;
    var y = [
      'getDeviceId',
      'setDeviceId',
      'getSessionId',
      'setSessionId',
      'getUserId',
      'setUserId',
      'setOptOut',
      'setTransport',
      'reset',
    ],
      g = [
        'init',
        'add',
        'remove',
        'track',
        'logEvent',
        'identify',
        'groupIdentify',
        'setGroup',
        'revenue',
        'flush',
      ];
    i(n),
      (n.createInstance = function (e) {
        return (n._iq[e] = { _q: [] }), i(n._iq[e]), n._iq[e];
      }),
      (e.amplitude = n);
  }
}
window, document;
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

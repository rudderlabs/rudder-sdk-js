import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(loadid, blockload, stream, accountId) {
  (function () {
    'use strict';
    var o = window.jstag || (window.jstag = {}),
      r = [];
    function n(e) {
      o[e] = function () {
        for (var n = arguments.length, t = new Array(n), i = 0; i < n; i++) t[i] = arguments[i];
        r.push([e, t]);
      };
    }
    n('send'),
      n('mock'),
      n('identify'),
      n('pageView'),
      n('unblock'),
      n('getid'),
      n('setid'),
      n('loadEntity'),
      n('getEntity'),
      n('on'),
      n('once'),
      n('call'),
      (o.loadScript = function (n, t, i) {
        var e = document.createElement('script');
        (e.async = !0),
          (e.src = n),
          (e.onload = t),
          (e.onerror = i),
          e.setAttribute('data-loader', LOAD_ORIGIN);
        var o = document.getElementsByTagName('script')[0],
          r = (o && o.parentNode) || document.head || document.body,
          c = o || r.lastChild;
        return null != c ? r.insertBefore(e, c) : r.appendChild(e), this;
      }),
      (o.init = function n(t) {
        return (
          (this.config = t),
          this.loadScript(t.src, function () {
            if (o.init === n) throw new Error('Load error!');
            // eslint-disable-next-line no-unused-expressions
            o.init(o.config),
              // eslint-disable-next-line func-names
              (function () {
                for (var n = 0; n < r.length; n++) {
                  var t = r[n][0],
                    i = r[n][1];
                  o[t].apply(o, i);
                }
                r = void 0;
              })();
          }),
          this
        );
      });
  })();
  // Define config and initialize Lytics tracking tag.
  window.jstag.init({
    loadid: loadid,
    blocked: blockload,
    stream: stream,
    sessecs: 1800,
    src:
      document.location.protocol === 'https:'
        ? `https://c.lytics.io/api/tag/${accountId}/latest.min.js`
        : `http://c.lytics.io/api/tag/${accountId}/latest.min.js`,
    pageAnalysis: {
      dataLayerPull: {
        disabled: true,
      },
    },
  });
}

export { loadNativeSdk };

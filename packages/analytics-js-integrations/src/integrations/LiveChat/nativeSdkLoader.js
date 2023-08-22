function loadNativeSdk(licenseId) {
  window.__lc = window.__lc || {};
  window.__lc.license = licenseId;
  (function (n, t, c) {
    function i(n) {
      return e._h ? e._h.apply(null, n) : e._q.push(n);
    }
    var e = {
      _q: [],
      _h: null,
      _v: '2.0',
      on: function () {
        i(['on', c.call(arguments)]);
      },
      once: function () {
        i(['once', c.call(arguments)]);
      },
      off: function () {
        i(['off', c.call(arguments)]);
      },
      get: function () {
        if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
        return i(['get', c.call(arguments)]);
      },
      call: function () {
        i(['call', c.call(arguments)]);
      },
      init: function () {
        var n = t.createElement('script');
        (n.async = !0),
          (n.type = 'text/javascript'),
          (n.src = 'https://cdn.livechatinc.com/tracking.js'),
          t.head.appendChild(n);
      },
    };
    !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e);
  })(window, document, [].slice);
}

export { loadNativeSdk };

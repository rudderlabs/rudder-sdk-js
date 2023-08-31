function loadNativeSdk(actId) {
  (function (e, t, o, n, p, r, i) {
    e.visitorGlobalObjectAlias = n;
    e[e.visitorGlobalObjectAlias] =
      e[e.visitorGlobalObjectAlias] ||
      function () {
        (e[e.visitorGlobalObjectAlias].q = e[e.visitorGlobalObjectAlias].q || []).push(arguments);
      };
    e[e.visitorGlobalObjectAlias].l = new Date().getTime();
    r = t.createElement('script');
    r.src = o;
    r.async = true;
    i = t.getElementsByTagName('script')[0];
    i.parentNode.insertBefore(r, i);
  })(window, document, 'https://diffuser-cdn.app-us1.com/diffuser/diffuser.js', 'vgo');
  window.vgo('setAccount', actId);
  window.vgo('setTrackByDefault', true);
  window.vgo('process');
}

export { loadNativeSdk };

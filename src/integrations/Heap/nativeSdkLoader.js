import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(appId) {
  (window.heap = window.heap || []),
    (heap.load = function (e, t) {
      (window.heap.appid = e), (window.heap.config = t = t || {});
      const r = document.createElement('script');
      (r.type = 'text/javascript'),
        (r.async = !0),
        r.setAttribute('data-loader', LOAD_ORIGIN),
        (r.src = `https://cdn.heapanalytics.com/js/heap-${e}.js`);
      const a = document.getElementsByTagName('script')[0];
      a.parentNode.insertBefore(r, a);
      for (
        let n = function (e) {
            return function () {
              heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          },
          p = [
            'addEventProperties',
            'addUserProperties',
            'clearEventProperties',
            'identify',
            'resetIdentity',
            'removeEventProperty',
            'setEventProperties',
            'track',
            'unsetEventProperty',
          ],
          o = 0;
        o < p.length;
        o++
      )
        heap[p[o]] = n(p[o]);
    });
  window.heap.load(appId);
}

export { loadNativeSdk };

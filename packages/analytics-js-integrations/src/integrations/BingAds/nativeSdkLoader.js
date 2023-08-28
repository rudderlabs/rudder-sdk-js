import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(uniqueId, tagID) {
  ((w, d, t, r, u) => {
    let f;
    let n;
    let i;
    (w[u] = w[u] || []),
      (f = () => {
        const o = {
          ti: tagID,
        };
        (o.q = w[u]), (w[u] = new UET(o));
      }),
      (n = d.createElement(t)),
      (n.src = r),
      (n.async = 1),
      n.setAttribute('data-loader', LOAD_ORIGIN),
      (n.onload = n.onreadystatechange =
        function () {
          const s = this.readyState;
          (s && s !== 'loaded' && s !== 'complete' && typeof w['UET'] === 'function') ||
            (f(), (n.onload = n.onreadystatechange = null));
        }),
      (i = d.getElementsByTagName(t)[0]),
      i.parentNode.insertBefore(n, i);
  })(window, document, 'script', 'https://bat.bing.com/bat.js', uniqueId);
}

export { loadNativeSdk };

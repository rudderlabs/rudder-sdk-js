import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(w, d, t, r, u) {
  let f;
  let n;
  let i;
  (w[u] = w[u] || []),
    (f = () => {
      const o = {
        ti: this.tagID,
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
}

export { loadNativeSdk };

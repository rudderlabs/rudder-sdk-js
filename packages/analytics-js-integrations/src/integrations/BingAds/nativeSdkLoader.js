import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(uniqueId, tagID) {
  // Add consent as "granted" immediately when integration initializes
  // If execution reaches here, user has consented or consent is not required
  // UET script will process this consent and set the consent status accordingly
  window[uniqueId] = window[uniqueId] || [];
  window[uniqueId].push('consent', 'default', { ad_storage: 'granted' });

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

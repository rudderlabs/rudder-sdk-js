import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(containerID, serverUrl) {
  const defaultUrl = `https://www.googletagmanager.com`;
  // ref: https://developers.google.com/tag-platform/tag-manager/server-side/send-data#update_the_gtmjs_source_domain

  window.finalUrl = serverUrl ? serverUrl : defaultUrl;
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== 'dataLayer' ? `&l=${l}` : '';
    j.setAttribute('data-loader', LOAD_ORIGIN);
    j.async = true;
    j.src = `${window.finalUrl}/gtm.js?id=${i}${dl}`;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', containerID);
}

export { loadNativeSdk };

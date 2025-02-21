import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(containerID, serverUrl, environmentID, authorizationToken) {
  const defaultUrl = `https://www.googletagmanager.com`;
  // ref: https://developers.google.com/tag-platform/tag-manager/server-side/send-data#update_the_gtmjs_source_domain

  window.finalUrl = serverUrl ? serverUrl : defaultUrl;
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== 'dataLayer' ? `&l=${l}` : '';
    const gtmEnv = environmentID ? `&gtm_preview=${encodeURIComponent(environmentID)}` : '';
    const gtmAuth = authorizationToken ? `&gtm_auth=${encodeURIComponent(authorizationToken)}` : '';
    const gtmCookies = '&gtm_cookies_win=x';
    j.setAttribute('data-loader', LOAD_ORIGIN);
    j.async = true;
    j.src = `${window.finalUrl}/gtm.js?id=${i}${dl}${gtmAuth}${gtmEnv}${gtmCookies}`;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', containerID);
}

export { loadNativeSdk };

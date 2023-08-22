import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(serverUrl, siteId) {
  window._paq = window._paq || [];
  (function (serverUrl, siteId) {
    let u = serverUrl;
    window._paq.push(['setTrackerUrl', `${u}matomo.php`]);
    window._paq.push(['setSiteId', siteId]);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    u = u.replace('https://', '');
    g.src = `//cdn.matomo.cloud/${u}matomo.js`;
    g.setAttribute('data-loader', LOAD_ORIGIN);
    s.parentNode.insertBefore(g, s);
  })(serverUrl, siteId);
}

export { loadNativeSdk };

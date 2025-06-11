import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(matomoVersion, premiseUrl, serverUrl, siteId) {
  window._paq = window._paq || [];
  (function (matomoVersion, premiseUrl, serverUrl, siteId) {
    let u = '';
    if (matomoVersion === 'premise') {
      if (!premiseUrl || typeof premiseUrl !== 'string') {
        throw new Error('premiseUrl is required for premise deployments and must be a string');
      }
      const suffix = 'matomo.js';
      u = premiseUrl.endsWith(suffix)
        ? premiseUrl.slice(0, -suffix.length)
        : premiseUrl;
    } else {
      u = serverUrl || '';
    }
    window._paq.push(['setTrackerUrl', `${u}matomo.php`]);
    window._paq.push(['setSiteId', siteId]);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    u = u.replace('https://', '');
    g.src = matomoVersion === 'premise' ? premiseUrl : `//cdn.matomo.cloud/${u}matomo.js`;
    g.setAttribute('data-loader', LOAD_ORIGIN);
    s.parentNode.insertBefore(g, s);
  })(matomoVersion, premiseUrl, serverUrl, siteId);
}

export { loadNativeSdk };

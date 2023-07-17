import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(serverUrl, siteId) {
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
}

export { loadNativeSdk };

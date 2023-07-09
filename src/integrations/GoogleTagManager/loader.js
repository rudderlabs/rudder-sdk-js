import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s);
  const dl = l !== 'dataLayer' ? `&l=${l}` : '';
  j.setAttribute('data-loader', LOAD_ORIGIN);
  j.async = true;
  j.src = `${window.finalUrl}/gtm.js?id=${i}${dl}`;
  f.parentNode.insertBefore(j, f);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

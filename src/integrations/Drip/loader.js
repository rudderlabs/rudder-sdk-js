import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader() {
  const dc = document.createElement('script');
  dc.type = 'text/javascript';
  dc.setAttribute('data-loader', LOAD_ORIGIN);
  dc.async = true;
  dc.src = `//tag.getdrip.com/${window._dcs.account}.js`;
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(dc, s);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

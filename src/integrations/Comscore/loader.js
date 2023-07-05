import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader() {
  const s = document.createElement('script');
  const el = document.getElementsByTagName('script')[0];
  s.async = true;
  s.setAttribute('data-loader', LOAD_ORIGIN);
  s.src = `${
    document.location.protocol == 'https:' ? 'https://sb' : 'http://b'
  }.scorecardresearch.com/beacon.js`;
  el.parentNode.insertBefore(s, el);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

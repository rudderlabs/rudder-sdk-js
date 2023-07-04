import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// END-NO-SONAR-SCAN
function loader(d, s, clientId) {
  window.axeptioSettings = {
    clientId,
  };
  var t = d.getElementsByTagName(s)[0],
    e = d.createElement(s);
  e.async = true;
  e.src = '//static.axept.io/sdk.js';
  e.setAttribute('data-loader', LOAD_ORIGIN), t.parentNode.insertBefore(e, t);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

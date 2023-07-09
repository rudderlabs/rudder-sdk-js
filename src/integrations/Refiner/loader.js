import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader() {
  var a = document.createElement('script');
  a.setAttribute('data-loader', LOAD_ORIGIN);
  a.type = 'text/javascript';
  a.async = !0;
  a.src = 'https://js.refiner.io/v001/client.js';
  var b = document.getElementsByTagName('script')[0];
  b.parentNode.insertBefore(a, b);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

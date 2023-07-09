import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader() {
  window.satismeter =
    window.satismeter ||
    function () {
      (window.satismeter.q = window.satismeter.q || []).push(arguments);
    };
  window.satismeter.l = 1 * new Date();
  var script = document.createElement('script');
  var parent = document.getElementsByTagName('script')[0].parentNode;
  script.async = 1;
  script.src = 'https://app.satismeter.com/js';
  script.setAttribute('data-loader', LOAD_ORIGIN), parent.appendChild(script);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

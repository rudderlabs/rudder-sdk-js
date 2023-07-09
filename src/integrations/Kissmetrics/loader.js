import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(_kmk) {
  function _kms(u) {
    setTimeout(function () {
      const d = document;
      const f = d.getElementsByTagName('script')[0];
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.setAttribute('data-loader', LOAD_ORIGIN);
      s.src = u;
      f.parentNode.insertBefore(s, f);
    }, 1);
  }
  _kms('//i.kissmetrics.com/i.js');
  _kms(`//scripts.kissmetrics.com/${_kmk}.2.js`);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

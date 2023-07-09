import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(window, tag, o, a, r) {
  var methods = ['init', 'page', 'track', 'identify'];
  window.lmSMTObj = window.lmSMTObj || [];

  for (var i = 0; i < methods.length; i++) {
    lmSMTObj[methods[i]] = (function (methodName) {
      return function () {
        lmSMTObj.push([methodName].concat(Array.prototype.slice.call(arguments)));
      };
    })(methods[i]);
  }
  // eslint-disable-next-line no-param-reassign
  a = o.getElementsByTagName('head')[0];
  // eslint-disable-next-line no-param-reassign
  r = o.createElement('script');
  r.setAttribute('data-loader', LOAD_ORIGIN);
  r.type = 'text/javascript';
  r.async = 1;
  r.src = tag;
  a.appendChild(r);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

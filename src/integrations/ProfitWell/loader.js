import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(i, s, o, g, r, a, m) {
  i[o] =
    i[o] ||
    function () {
      (i[o].q = i[o].q || []).push(arguments);
    };
  a = s.createElement(g);
  m = s.getElementsByTagName(g)[0];
  a.async = 1;
  a.setAttribute('data-loader', LOAD_ORIGIN);
  a.src = `${r}?auth=${window.publicApiKey}`;
  m.parentNode.insertBefore(a, m);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

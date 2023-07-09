import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(c, l, a, r, i, t, y) {
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = 'https://www.clarity.ms/tag/' + i;
  t.setAttribute('data-loader', LOAD_ORIGIN);
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

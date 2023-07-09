import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(o, l, a, r, k, y) {
  if (o.olark) return;
  r = 'script';
  y = l.createElement(r);
  r = l.getElementsByTagName(r)[0];
  y.async = 1;
  y.src = '//' + a;
  y.setAttribute('data-loader', LOAD_ORIGIN);
  r.parentNode.insertBefore(y, r);
  y = o.olark = function () {
    k.s.push(arguments);
    k.t.push(+new Date());
  };
  y.extend = function (i, j) {
    y('extend', i, j);
  };
  y.identify = function (i) {
    y('identify', (k.i = i));
  };
  y.configure = function (i, j) {
    y('configure', i, j);
    k.c[i] = j;
  };
  k = y._ = { s: [], t: [+new Date()], c: {}, l: a };
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

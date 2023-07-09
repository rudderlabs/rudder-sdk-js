import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(apiKey, p, e, n, d, o) {
  let v;
  let w;
  let x;
  let y;
  let z;
  o = p[d] = p[d] || {};
  o._q = [];
  v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
  for (w = 0, x = v.length; w < x; ++w)
    (function (m) {
      o[m] =
        o[m] ||
        function () {
          o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
        };
    })(v[w]);
  y = e.createElement(n);
  y.setAttribute('data-loader', LOAD_ORIGIN);
  y.async = !0;
  y.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
  z = e.getElementsByTagName(n)[0];
  z.parentNode.insertBefore(y, z);
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

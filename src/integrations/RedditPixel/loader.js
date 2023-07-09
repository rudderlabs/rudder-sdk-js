import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(w, d) {
  if (!w.rdt) {
    var p = (w.rdt = function () {
      p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
    });
    p.callQueue = [];
    var t = d.createElement('script');
    (t.src = 'https://www.redditstatic.com/ads/pixel.js'), (t.async = !0);
    t.setAttribute('data-loader', LOAD_ORIGIN);
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  }
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN
function loader(d, RB) {
  if (!window.RB) {
    window.RB = RB;
    RB.queue = RB.queue || [];
    RB.track =
      RB.track ||
      function () {
        RB.queue.push(Array.prototype.slice.call(arguments));
      };
    RB.initialize = function (s) {
      RB.source = s;
    };
    const a = d.createElement('script');
    a.type = 'text/javascript';
    a.async = !0;
    a.src = `https://${host}/assets/${library}.js`;
    a.dataset.loader = LOAD_ORIGIN;
    const f = d.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(a, f);
  }
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

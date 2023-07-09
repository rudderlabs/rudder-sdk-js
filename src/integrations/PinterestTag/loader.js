import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

/* eslint-disable */
// START-NO-SONAR-SCAN

function loader(e) {
  if (!window.pintrk) {
    window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments));
    };
    const n = window.pintrk;
    (n.queue = []), (n.version = '3.0');
    const t = document.createElement('script');
    (t.async = !0), (t.src = e), t.setAttribute('data-loader', LOAD_ORIGIN);
    const r = document.getElementsByTagName('script')[0];
    r.parentNode.insertBefore(t, r);
  }
}
/* eslint-enable */
// END-NO-SONAR-SCAN

export { loader };

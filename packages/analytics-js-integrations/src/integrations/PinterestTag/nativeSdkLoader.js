import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(e) {
  !(function (e) {
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
  })('https://s.pinimg.com/ct/core.js');
}

export { loadNativeSdk };

import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(h, o, t, j, a, r) {
  h.hj =
    h.hj ||
    function () {
      (h.hj.q = h.hj.q || []).push(arguments);
    };
  h._hjSettings = { hjid: h.hotjarSiteId, hjsv: 6 };
  a = o.getElementsByTagName('head')[0];
  r = o.createElement('script');
  r.setAttribute('data-loader', LOAD_ORIGIN);
  r.async = 1;
  r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
  a.appendChild(r);
}

export { loadNativeSdk };

import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(appId) {
  window.intercomSettings = {
    app_id: appId,
  };
  (function () {
    const w = window;
    const ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      const d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      const l = function () {
        const s = d.createElement('script');
        s.setAttribute('data-loader', LOAD_ORIGIN);
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://widget.intercom.io/widget/${window.intercomSettings.app_id}`;
        const x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === 'complete') {
        l();
        window.intercom_code = true;
      } else if (w.attachEvent) {
        w.attachEvent('onload', l);
        window.intercom_code = true;
      } else {
        w.addEventListener('load', l, false);
        window.intercom_code = true;
      }
    }
  })();
}

export { loadNativeSdk };

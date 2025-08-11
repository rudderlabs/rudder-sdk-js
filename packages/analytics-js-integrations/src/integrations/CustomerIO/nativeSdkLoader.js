import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(siteID, datacenter, datacenterEU,dataUseInApp) {
  window._cio = window._cio || [];
  (function () {
    let a;
    let b;
    let c;
    a = function (f) {
      return function () {
        window._cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    b = ['load', 'identify', 'sidentify', 'track', 'page'];
    for (c = 0; c < b.length; c++) {
      window._cio[b[c]] = a(b[c]);
    }
    const t = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    t.async = true;
    t.setAttribute('data-loader', LOAD_ORIGIN);
    t.id = 'cio-tracker';
    t.setAttribute('data-use-in-app',dataUseInApp);
    t.setAttribute('data-site-id', siteID);

    t.src = 'https://assets.customer.io/assets/track.js';
    if (datacenter === 'EU' || datacenterEU === true) {
      t.src = 'https://assets.customer.io/assets/track-eu.js';
    }
    s.parentNode.insertBefore(t, s);
  })();
}
export { loadNativeSdk };

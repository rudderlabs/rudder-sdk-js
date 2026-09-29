import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';
import {
  EU_DATACENTER,
  V2_GLOBAL_NAME,
  V2_GLOBAL_KEY_ATTRIBUTE,
  V2_CDN_HOST,
  V2_CDN_HOST_EU,
  V2_SNIPPET_PATH,
  V2_SNIPPET_FILE,
  V2_STUB_METHODS,
} from './constants';

/**
 * 1.x: Customer.io legacy JavaScript snippet (Journeys Track API, `_cio` global, Site ID).
 */
function loadNativeSdkV1(siteID, datacenter, dataUseInApp) {
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
    t.setAttribute('data-use-in-app', dataUseInApp);
    t.setAttribute('data-site-id', siteID);

    t.src = 'https://assets.customer.io/assets/track.js';
    if (datacenter === 'EU') {
      t.src = 'https://assets.customer.io/assets/track-eu.js';
    }
    s.parentNode.insertBefore(t, s);
  })();
}

const getV2SdkUrl = (writeKey, datacenter) => {
  const host = datacenter === EU_DATACENTER ? V2_CDN_HOST_EU : V2_CDN_HOST;
  return `${host}${V2_SNIPPET_PATH}/${writeKey}/${V2_SNIPPET_FILE}`;
};

/**
 * 2.x: Customer.io JavaScript client (Data Pipelines, `cioanalytics` global, write key).
 * Installs the snippet stub queue and injects the bundle, mirroring Customer.io's documented
 * snippet. The bundle reads the write key and load options from the stub (`_writeKey`,
 * `_loadOptions`) and the global name from the script attribute. Does not call `page()`;
 * RudderStack's own page events drive that.
 */
function loadNativeSdkV2(writeKey, datacenter, loadOptions) {
  window[V2_GLOBAL_NAME] = window[V2_GLOBAL_NAME] || [];
  const analytics = window[V2_GLOBAL_NAME];
  if (analytics.initialize || analytics.invoked) {
    // The client is already loaded or its snippet is already installed on the page.
    return;
  }
  analytics.invoked = true;
  analytics.methods = V2_STUB_METHODS;
  analytics.factory = method =>
    function () {
      analytics.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      return analytics;
    };
  analytics.methods.forEach(method => {
    analytics[method] = analytics.factory(method);
  });
  analytics.load = (key, options) => {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.setAttribute(V2_GLOBAL_KEY_ATTRIBUTE, V2_GLOBAL_NAME);
    scriptElement.setAttribute('data-loader', LOAD_ORIGIN);
    scriptElement.src = getV2SdkUrl(key, datacenter);
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(scriptElement, firstScript);
    analytics._writeKey = key;
    analytics._loadOptions = options;
  };
  analytics.load(writeKey, loadOptions);
}

export { loadNativeSdkV1, loadNativeSdkV2 };

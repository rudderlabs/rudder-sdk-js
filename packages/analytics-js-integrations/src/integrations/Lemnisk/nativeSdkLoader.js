import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(accountId, sdkWriteKey) {
  (function (window, tag, o, a, r) {
    var methods = ['init', 'page', 'track', 'identify'];
    window.lmSMTObj = window.lmSMTObj || [];

    for (var i = 0; i < methods.length; i++) {
      lmSMTObj[methods[i]] = (function (methodName) {
        return function () {
          lmSMTObj.push([methodName].concat(Array.prototype.slice.call(arguments)));
        };
      })(methods[i]);
    }
    // eslint-disable-next-line no-param-reassign
    a = o.getElementsByTagName('head')[0];
    // eslint-disable-next-line no-param-reassign
    r = o.createElement('script');
    r.setAttribute('data-loader', LOAD_ORIGIN);
    r.type = 'text/javascript';
    r.async = 1;
    r.src = tag;
    a.appendChild(r);
  })(
    window,
    document.location.protocol === 'https:'
      ? `https://cdn25.lemnisk.co/ssp/st/${accountId}.js`
      : `http://cdn25.lemnisk.co/ssp/st/${accountId}.js`,
    document,
  );
  window.lmSMTObj.init(sdkWriteKey);
}

export { loadNativeSdk };

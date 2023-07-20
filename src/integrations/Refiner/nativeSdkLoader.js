import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(apiKey) {
  window._refinerQueue = window._refinerQueue || [];
  this._refiner = function () {
    window._refinerQueue.push(arguments);
  };
  (function () {
    var a = document.createElement('script');
    a.setAttribute('data-loader', LOAD_ORIGIN);
    a.type = 'text/javascript';
    a.async = !0;
    a.src = 'https://js.refiner.io/v001/client.js';
    var b = document.getElementsByTagName('script')[0];
    b.parentNode.insertBefore(a, b);
  })();
  this._refiner('setProject', apiKey);
}

export { loadNativeSdk };

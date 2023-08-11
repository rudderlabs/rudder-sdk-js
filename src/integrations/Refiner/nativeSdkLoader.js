import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

function loadNativeSdk(apiKey) {
  window._refinerQueue = window._refinerQueue || [];
  window._refiner = function () {
    window._refinerQueue.push(arguments);
  };
  window._refiner('setProject', apiKey);
  (function () {
    var a = document.createElement('script');
    a.setAttribute('data-loader', LOAD_ORIGIN);
    a.type = 'text/javascript';
    a.async = !0;
    a.src = 'https://js.refiner.io/v001/client.js';
    var b = document.getElementsByTagName('script')[0];
    b.parentNode.insertBefore(a, b);
  })();
}

export { loadNativeSdk };

import { LOAD_ORIGIN } from '@rudderstack/analytics-js-legacy-utilities/constants';

function loadNativeSdk(writeKey) {
  (function () {
    window.satismeter =
      window.satismeter ||
      function () {
        (window.satismeter.q = window.satismeter.q || []).push(arguments);
      };
    window.satismeter.l = 1 * new Date();
    var script = document.createElement('script');
    var parent = document.getElementsByTagName('script')[0].parentNode;
    script.async = 1;
    script.src = 'https://app.satismeter.com/js';
    script.setAttribute('data-loader', LOAD_ORIGIN), parent.appendChild(script);
  })();

  window.satismeter({
    writeKey: writeKey,
  });
}

export { loadNativeSdk };

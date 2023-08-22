import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';

function loadNativeSdk(publicApiKey) {
  window.publicApiKey = publicApiKey;

  const scriptTag = document.createElement('script');
  scriptTag.setAttribute('id', 'profitwell-js');
  scriptTag.setAttribute('data-pw-auth', window.publicApiKey);
  document.body.appendChild(scriptTag);
  (function (i, s, o, g, r, a, m) {
    i[o] =
      i[o] ||
      function () {
        (i[o].q = i[o].q || []).push(arguments);
      };
    a = s.createElement(g);
    m = s.getElementsByTagName(g)[0];
    a.async = 1;
    a.setAttribute('data-loader', LOAD_ORIGIN);
    a.src = `${r}?auth=${window.publicApiKey}`;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'profitwell', 'script', 'https://public.profitwell.com/js/profitwell.js');
}

export { loadNativeSdk };

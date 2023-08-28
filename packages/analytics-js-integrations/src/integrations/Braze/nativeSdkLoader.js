import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/utilsV1/constants';
import { BrazeOperationString } from '@rudderstack/analytics-js-common/constants/integrations/Braze/constants';

const loadNativeSdk = () => {
  // load braze
  +(function (a, p, P, b, y) {
    a.braze = {};
    a.brazeQueue = [];
    for (let s = BrazeOperationString.split(' '), i = 0; i < s.length; i++) {
      for (var m = s[i], k = a.braze, l = m.split('.'), j = 0; j < l.length - 1; j++) k = k[l[j]];
      k[l[j]] = new Function(
        `return function ${m.replace(
          /\./g,
          '_',
        )}(){window.brazeQueue.push(arguments); return true}`,
      )();
    }
    window.braze.getCachedContentCards = function () {
      return new window.braze.ContentCards();
    };
    window.braze.getCachedFeed = function () {
      return new window.braze.Feed();
    };
    window.braze.getUser = function () {
      return new window.braze.User();
    };
    (y = p.createElement(P)).type = 'text/javascript';
    y.src = 'https://js.appboycdn.com/web-sdk/4.2/braze.min.js';
    y.async = 1;
    y.setAttribute('data-loader', LOAD_ORIGIN);
    (b = p.getElementsByTagName(P)[0]).parentNode.insertBefore(y, b);
  })(window, document, 'script');
};

export { loadNativeSdk };

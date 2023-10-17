/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable unicorn/consistent-destructuring */

/* Loading snippet start */
const sdkBaseUrl = 'https://cdn.rudderlabs.com/v3';
const sdkName = 'rsa.min.js';
const asyncScript = true;
window.rudderAnalyticsBuildType = 'legacy';

window.rudderanalytics = [];
const methods: string[] = [
  'setDefaultInstanceKey',
  'load',
  'ready',
  'page',
  'track',
  'identify',
  'alias',
  'group',
  'reset',
  'setAnonymousId',
  'startSession',
  'endSession',
  'consent',
];

for (let i = 0; i < methods.length; i++) {
  const method = methods[i];
  window.rudderanalytics[method] = (methodName =>
    function () {
      window.rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
    })(method);
}

// Feature detection of dynamic imports
try {
  new Function('return import("")');
  window.rudderAnalyticsBuildType = 'modern';
} catch (e) {
  // Do nothing
}

window.rudderAnalyticsMount = () => {
  /* eslint-disable */
  // globalThis polyfill as polyfill.io one does not work in legacy safari
  if (typeof globalThis === 'undefined') {
    Object.defineProperty(Object.prototype, '__globalThis_magic__', {
      get: function get() {
        return this;
      },
      configurable: true,
    });
    // @ts-ignore
    __globalThis_magic__.globalThis = __globalThis_magic__;
    // @ts-ignore
    delete Object.prototype.__globalThis_magic__;
  }
  /* eslint-disable */

  const rudderAnalyticsScript = document.createElement('script');
  rudderAnalyticsScript.src = `${sdkBaseUrl}/${window.rudderAnalyticsBuildType}/${sdkName}`;
  rudderAnalyticsScript.async = asyncScript;
  if (document.head) {
    document.head.appendChild(rudderAnalyticsScript);
  } else {
    document.body.appendChild(rudderAnalyticsScript);
  }
};

if (typeof Promise === 'undefined' || typeof globalThis === 'undefined') {
  const rudderAnalyticsPromisesScript = document.createElement('script');
  rudderAnalyticsPromisesScript.src =
    'https://polyfill.io/v3/polyfill.min.js?features=Symbol%2CPromise&callback=rudderAnalyticsMount';
  rudderAnalyticsPromisesScript.async = asyncScript;
  if (document.head) {
    document.head.appendChild(rudderAnalyticsPromisesScript);
  } else {
    document.body.appendChild(rudderAnalyticsPromisesScript);
  }
} else {
  window.rudderAnalyticsMount();
}
/* Loading snippet end */

const loadOptions = {
  // configure your load options here
};

window.rudderanalytics.load('<write-key>', '<data-plane-url>', loadOptions);

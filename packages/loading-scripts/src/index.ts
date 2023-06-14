/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable unicorn/consistent-destructuring */

/* Loading snippet start */
const sdkBaseUrl = 'https://cdn.rudderlabs.com/beta/v3';
const sdkName = 'rudder-analytics.min.js';
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
  'getAnonymousId',
  'setAnonymousId',
  'startSession',
  'endSession',
  'getSessionId',
];

for (let i = 0; i < methods.length; i++) {
  const method: string = methods[i];
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
  const rudderAnalyticsScript = document.createElement('script');
  rudderAnalyticsScript.src = `${sdkBaseUrl}/${window.rudderAnalyticsBuildType}/${sdkName}`;
  rudderAnalyticsScript.async = asyncScript;
  if (document.head) {
    document.head.appendChild(rudderAnalyticsScript);
  } else {
    document.body.appendChild(rudderAnalyticsScript);
  }
};

if (typeof Promise === 'undefined') {
  const rudderAnalyticsPromisesScript = document.createElement('script');
  rudderAnalyticsPromisesScript.src =
    'https://polyfill.io/v3/polyfill.min.js?features=globalThis%2CPromise&callback=rudderAnalyticsMount';
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

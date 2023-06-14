/* eslint-disable no-new */
/** Loading snippet */
const sdkBaseUrl = 'https://cdn.rudderlabs.com/beta/v3';
const sdkName = 'rudder-analytics.min.js';
const writeKey = '<write-key>';
const dataPlaneUrl = '<data-plane-url>';
const asyncScript = true;
const disableDynamicImports = false;

(window as any).rudderanalytics = [];
const { rudderanalytics } = window as any;
const methods: string[] = [
  'setDefaultInstanceKey',
  'getAnalyticsInstance',
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
  'getUserId',
  'getUserTraits',
  'getGroupId',
  'getGroupTraits',
  'startSession',
  'endSession',
  'getSessionId',
];

// eslint-disable-next-line unicorn/no-for-loop
for (let i = 0; i < methods.length; i++) {
  const method: string = methods[i];
  rudderanalytics[method] = (methodName =>
    function () {
      // eslint-disable-next-line prefer-rest-params
      rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
    })(method);
}

let sdkBuildType = 'legacy';

if (!disableDynamicImports) {
  try {
    // Feature detection of dynamic imports
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function('return import("")');
    sdkBuildType = 'modern';
  } catch (e) {
    // Do nothing
  }
}

(window as any).rudderAnalyticsMount = () => {
  const rudderAnalyticsScript = document.createElement('script');
  rudderAnalyticsScript.src = `${sdkBaseUrl}/${sdkBuildType}/${sdkName}`;
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
  (window as any).rudderAnalyticsMount();
}
const options = {
  // configure your load options here
};
rudderanalytics.load(writeKey, dataPlaneUrl, options);

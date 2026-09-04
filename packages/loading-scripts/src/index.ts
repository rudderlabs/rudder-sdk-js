/* eslint-disable prefer-rest-params */
/* Loading snippet start */
import type {
  PreloadedEventCall,
  RudderAnalytics,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';

window.RudderSnippetVersion = __PACKAGE_VERSION__;
const identifier = 'rudderanalytics';
if (!window[identifier]) {
  window[identifier] = [] as any;
}
const rudderanalytics = window[identifier];

// Proceed to load the SDK only if it is not already loaded
if (Array.isArray(rudderanalytics)) {
  if ((rudderanalytics as any).snippetExecuted === true && window.console && console.error) {
    console.error('RudderStack JavaScript SDK snippet included more than once.');
  } else {
    (rudderanalytics as any).snippetExecuted = true;

    // This file builds two CDN artifacts:
    //
    //   loader.js      self-configuring. Reads the write key and data plane URL
    //                  from data-* attributes on its own script tag, so a page
    //                  needs nothing but the one script tag.
    //   loader-gtm.js  no self-configuration. GTM's injectScript cannot set
    //                  data-* attributes, so the GTM template buffers a load
    //                  call and this build leaves the configuration to it.
    //
    // __IS_GTM_BUILD__ is replaced with a boolean literal at build time and
    // constant-folded away, so neither artifact carries the check.
    //
    // document.currentScript is only valid while this script executes, so the
    // attributes are read up front rather than inside the mount callback.
    let writeKey: string | null = null;
    let dataPlaneUrl: string | null = null;

    if (!__IS_GTM_BUILD__) {
      const loaderScriptTag = document.currentScript as HTMLScriptElement | null;
      if (loaderScriptTag) {
        writeKey = loaderScriptTag.getAttribute('data-rsa-write-key');
        dataPlaneUrl = loaderScriptTag.getAttribute('data-rsa-data-plane-url');
      }
    }
    window.rudderAnalyticsBuildType = 'legacy';

    const sdkBaseUrl = 'https://cdn.rudderlabs.com';
    const sdkVersion = 'v3';
    const sdkFileName = 'rsa.min.js';
    const scriptLoadingMode = 'async'; // Options: 'async', 'defer', 'none'/'' (empty string)

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
      'addCustomIntegration',
      'setCustomContext',
      'clearCustomContext',
    ];

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < methods.length; i++) {
      const method = methods[i] as string;
      (rudderanalytics as unknown as RudderAnalyticsPreloader)[method] = (methodName =>
        // eslint-disable-next-line func-names
        function () {
          if (Array.isArray(window[identifier])) {
            (rudderanalytics as unknown as PreloadedEventCall[]).push(
              [methodName].concat(Array.prototype.slice.call(arguments) as PreloadedEventCall),
            );
          } else {
            (window[identifier] as any)[methodName]?.apply(window[identifier], arguments);
          }
        })(method);
    }

    // Feature detection of dynamic imports and other legacy browser features
    try {
      // eslint-disable-next-line no-new, @typescript-eslint/no-implied-eval
      new Function(
        'class Test{field=()=>{};test({prop=[]}={}){return prop?(prop?.property??[...prop]):import("");}}',
      );
      window.rudderAnalyticsBuildType = 'modern';
    } catch (e) {
      // Do nothing
    }

    const head = document.head || document.getElementsByTagName('head')[0];

    // eslint-disable-next-line compat/compat
    const body = document.body || document.getElementsByTagName('body')[0];

    window.rudderAnalyticsAddScript = (
      url: string,
      extraAttributeKey?: string,
      extraAttributeVal?: string,
    ) => {
      const scriptTag = document.createElement('script');
      scriptTag.src = url;
      scriptTag.setAttribute('data-loader', 'RS_JS_SDK');
      if (extraAttributeKey && extraAttributeVal) {
        scriptTag.setAttribute(extraAttributeKey, extraAttributeVal);
      }

      if (scriptLoadingMode === 'async') {
        scriptTag.async = true;
      } else if (scriptLoadingMode === 'defer') {
        scriptTag.defer = true;
      }

      if (head) {
        head.insertBefore(scriptTag, head.firstChild);
      } else {
        body.insertBefore(scriptTag, body.firstChild);
      }
    };

    window.rudderAnalyticsMount = () => {
      /* eslint-disable */
      // globalThis polyfill as polyfill-fastly.io one does not work in legacy safari
      (function () {
        if (typeof globalThis === 'undefined') {
          const getGlobal = function () {
            if (typeof self !== 'undefined') {
              return self;
            }
            if (typeof window !== 'undefined') {
              return window;
            }
            return null;
          };

          const global = getGlobal();

          if (global) {
            Object.defineProperty(global, 'globalThis', {
              value: global,
              configurable: true,
            });
          }
        }
      })();
      /* eslint-enable */

      // The SDK locates its own URL through this attribute, so it is only
      // useful when a write key is known.
      const sdkUrl = `${sdkBaseUrl}/${sdkVersion}/${window.rudderAnalyticsBuildType}/${sdkFileName}`;
      if (__IS_GTM_BUILD__) {
        window.rudderAnalyticsAddScript(sdkUrl);
      } else {
        window.rudderAnalyticsAddScript(sdkUrl, 'data-rsa-write-key', writeKey || undefined);
      }
    };

    if (typeof Promise === 'undefined' || typeof globalThis === 'undefined') {
      window.rudderAnalyticsAddScript(
        'https://polyfill-fastly.io/v3/polyfill.min.js?version=3.111.0&features=Symbol%2CPromise&callback=rudderAnalyticsMount',
      );
    } else {
      window.rudderAnalyticsMount();
    }
    /* Loading snippet end */

    // With no attributes to read, this build behaves exactly like loader-gtm.js:
    // whoever buffered a load call supplies the configuration.
    if (!__IS_GTM_BUILD__ && writeKey && dataPlaneUrl) {
      (rudderanalytics as unknown as RudderAnalytics).load(writeKey, dataPlaneUrl);
    }
  }
}

/**
 * Initializes the RudderStack JavaScript SDK with the provided configuration.
 * 
 * @param {string} writeKey - The write key for the RudderStack project.
 * @param {string} dpUrl - The data plane URL for sending analytics data.
 * @param {Object} [loadOptions={}] - Optional configuration options for loading the SDK.
 * 
 * @description
 * This function sets up the RudderStack analytics library by:
 * - Ensuring the SDK is only initialized once
 * - Defining global analytics methods for tracking events
 * - Setting up a global context for the SDK
 * - Loading the SDK with the provided configuration
 * 
 * @throws {Error} Logs an error if the SDK snippet is included multiple times.
 * 
 * @example
 * loadingSnippet('your_write_key', 'https://your-dataplane-url.com', { 
 *   integrations: { All: true } 
 * });
 */
function loadingSnippet(writeKey, dpUrl, loadOptions) {
  (function () {
    'use strict';
    window.RudderSnippetVersion = '3.0.10';
    var identifier = 'rudderanalytics';
    if (!window[identifier]) {
      window[identifier] = [];
    }
    var rudderanalytics = window[identifier];
    if (Array.isArray(rudderanalytics)) {
      if (rudderanalytics.snippetExecuted === true && window.console && console.error) {
        console.error('RudderStack JavaScript SDK snippet included more than once.');
      } else {
        rudderanalytics.snippetExecuted = true;
        window.rudderAnalyticsBuildType = 'legacy';
        var methods = [
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
        for (var i = 0; i < methods.length; i++) {
          var method = methods[i];
          rudderanalytics[method] = (function (methodName) {
            return function () {
              if (Array.isArray(window[identifier])) {
                rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
              } else {
                var _methodName;
                (_methodName = window[identifier][methodName]) === null ||
                  _methodName === void 0 ||
                  _methodName.apply(window[identifier], arguments);
              }
            };
          })(method);
        }
        window.rudderAnalyticsMount = function () {
          if (typeof globalThis === 'undefined') {
            Object.defineProperty(Object.prototype, '__globalThis_magic__', {
              get: function get() {
                return this;
              },
              configurable: true,
            });
            __globalThis_magic__.globalThis = __globalThis_magic__;
            delete Object.prototype.__globalThis_magic__;
          }
        };
        window.rudderAnalyticsMount();
        window.rudderanalytics.load(writeKey, dpUrl, loadOptions ?? {});
      }
    }
  })();
}

export { loadingSnippet };

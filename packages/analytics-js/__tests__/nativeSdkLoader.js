function loadingSnippet() {
  (function () {
    'use strict';
    window.RudderSnippetVersion = '3.0.6';
    window.rudderAnalyticsBuildType = 'legacy';
    window.rudderanalytics = [];
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
      window.rudderanalytics[method] = (function (methodName) {
        return function () {
          window.rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
        };
      })(method);
    }
    try {
      new Function('return import("")');
      window.rudderAnalyticsBuildType = 'modern';
    } catch (e) {}
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
    var loadOptions = {};
    window.rudderanalytics.load('WRITE_KEY', 'https://some.reallookingdataplane.url');
  })();
}

export { loadingSnippet };

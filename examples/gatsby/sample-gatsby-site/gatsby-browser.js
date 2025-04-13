// Initialize rudderanalytics buffer
export const onClientEntry = () => {
  if (typeof window !== 'undefined') {
    (function() {
      "use strict";
      window.RudderSnippetVersion = "3.0.60";
      var identifier = "rudderanalytics";
      if (!window[identifier]) {
        window[identifier] = [];
      }
      var rudderanalytics = window[identifier];
      if (Array.isArray(rudderanalytics)) {
        if (rudderanalytics.snippetExecuted === true && window.console && console.error) {
          console.error("RudderStack JavaScript SDK snippet included more than once.");
        } else {
          rudderanalytics.snippetExecuted = true;
          window.rudderAnalyticsBuildType = "legacy";
          var sdkBaseUrl = "https://cdn.rudderlabs.com";
          var sdkVersion = "v3";
          var sdkFileName = "rsa.min.js";
          var scriptLoadingMode = "async";
          var methods = [ 
            "setDefaultInstanceKey", "load", "ready", "page", "track", 
            "identify", "alias", "group", "reset", "setAnonymousId", 
            "startSession", "endSession", "consent" 
          ];
          for (var i = 0; i < methods.length; i++) {
            var method = methods[i];
            rudderanalytics[method] = function(methodName) {
              return function() {
                if (Array.isArray(window[identifier])) {
                  rudderanalytics.push([ methodName ].concat(Array.prototype.slice.call(arguments)));
                } else {
                  var _methodName;
                  (_methodName = window[identifier][methodName]) === null || _methodName === undefined || _methodName.apply(window[identifier], arguments);
                }
              };
            }(method);
          }
        }
      }

      window.rudderanalytics.page('Sample Page Event');
    })();
  }
}; 

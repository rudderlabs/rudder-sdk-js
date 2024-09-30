import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <Script id='bufferEvents' strategy='beforeInteractive'>
          {`
            (function() {
              "use strict";
              window.RudderSnippetVersion = "3.0.30";
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

                  var methods = [ "setDefaultInstanceKey", "load", "ready", "page", "track", "identify", "alias", "group", "reset", "setAnonymousId", "startSession", "endSession", "consent" ];
                  for (var i = 0; i < methods.length; i++) {
                    var method = methods[i];
                    rudderanalytics[method] = function(methodName) {
                      return function() {
                        if (Array.isArray(window[identifier])) {
                          rudderanalytics.push([ methodName ].concat(Array.prototype.slice.call(arguments)));
                        } else {
                          var _methodName;
                          (_methodName = window[identifier][methodName]) === null || _methodName === void 0 || _methodName.apply(window[identifier], arguments);
                        }
                      };
                    }(method);
                  }
                }
              }
            })();
            // Below line is only for demonstration purpose, SPA code is better place for auto page call
            window.rudderanalytics.page('sample page call');
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

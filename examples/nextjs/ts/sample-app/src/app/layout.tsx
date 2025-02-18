import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <Script id='bufferEvents'>
          {`
            (function() {
              "use strict";
              window.RudderSnippetVersion = "3.0.59";
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
                  var methods = [ "setDefaultInstanceKey", "load", "ready", "page", "track", "identify", "alias", "group", "reset", "setAnonymousId", "startSession", "endSession", "consent" ];
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
            })();
            // Below line is only for demonstration purpose, SPA code is better place for auto page call
            window.rudderanalytics.page('sample page call');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

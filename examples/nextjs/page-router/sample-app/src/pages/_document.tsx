import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <Script id='bufferEvents' strategy='beforeInteractive'>
          {`
            window.RudderSnippetVersion = '3.0.1';
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
              'consent'
            ];
            for (var i = 0; i < methods.length; i++) {
              var method = methods[i];
              window.rudderanalytics[method] = (function (methodName) {
                return function () {
                  window.rudderanalytics.push([methodName].concat(Array.prototype.slice.call(arguments)));
                };
              })(method);
            }
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

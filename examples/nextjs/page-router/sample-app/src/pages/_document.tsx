import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <Script id='bufferEvents' strategy='beforeInteractive'>
          {`
            window.rudderanalytics = [];
            var methods = [
              'load',
              'page',
              'track',
              'identify',
              'alias',
              'group',
              'ready',
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

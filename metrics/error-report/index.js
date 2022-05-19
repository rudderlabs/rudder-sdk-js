/* eslint-disable import/prefer-default-export */
/* eslint-disable no-prototype-builtins */
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import ScriptLoader from "../../integrations/ScriptLoader";
// import RudderApp from "../../utils/RudderApp";

const metaData = {
  SDK: {
    name: "RudderStack JavaScript SDK",
    version: "process.package_version",
    installType: process.browser ? "CDN" : "NPM",
  },
};

const credentials = {
  apiKey:
    "U2FsdGVkX182Myeej4DKayK1qKvTaxfa/9g4oz/kMD1hkuPCBKmyrWZB74x3N0qf6xuPtH8QRq4YRnIh15AaNg==", // "0d96a60df267f4a13f808bbaa54e535c"
  appVersion: "1.0.0",
  releaseStage: "development",
  key: "RudderStack",
};

const sdkNames = [
  "browser.js",
  "rudder-analytics.min.js",
  "rudder-analytics-staging.min.js",
  "rudder-analytics.js",
];

const load = () => {
  const pluginName = "bugsnag";
  if (!window.hasOwnProperty(pluginName)) {
    ScriptLoader(
      pluginName,
      "https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"
    );
  }
};

const initialize = (sourceId) => {
  const interval = setInterval(function () {
    if (window.Bugsnag !== undefined) {
      clearInterval(interval);
      window.rsBugsnagClient = window.Bugsnag.start({
        apiKey: AES.decrypt(credentials.apiKey, credentials.key).toString(Utf8),
        metadata: metaData,
        // eslint-disable-next-line consistent-return
        onError(event) {
          if (typeof event.errors[0].stacktrace[0].file === "string") {
            const index = event.errors[0].stacktrace[0].file.lastIndexOf("/");
            if (
              !sdkNames.includes(
                event.errors[0].stacktrace[0].file.substr(index + 1)
              )
            )
              return false; // Return false to discard the event
          }
          event.addMetadata("source", {
            sourceId,
          });
        },
        autoTrackSessions: false,
      });
    }
  }, 100);
};

export { loadBugsnag, initialize };

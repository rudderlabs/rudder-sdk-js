/* eslint-disable import/prefer-default-export */
/* eslint-disable no-prototype-builtins */
import ScriptLoader from "../../integrations/ScriptLoader";
// import RudderApp from "../../utils/RudderApp";
import { MAX_WAIT_FOR_INTEGRATION_LOAD } from "../../utils/constants";

const metaData = {
  SDK: {
    name: "RudderStack JavaScript SDK",
    version: "process.package_version",
    installType: process.browser ? "CDN" : "NPM",
  },
};

const credentials = {
  apiKey: "",
  appVersion: "1.0.0",
  releaseStage: "development",
};

const loadBugsnag = (pluginName = "bugsnag") => {
  if (!window.hasOwnProperty(pluginName)) {
    ScriptLoader(
      pluginName,
      "https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"
    );
  }

  //   const self = this;
  const interval = setInterval(function () {
    if (window.hasOwnProperty(pluginName)) {
      clearInterval(interval);

      if (window.Bugsnag !== undefined) {
        window.errorReporterClient = window.Bugsnag.start({
          apiKey: credentials.apiKey,
          metadata: metaData,
          onError: function (event) {
            console.log(event);
            // Modify event here
            // Return false to discard the event
          },
        });
      }
    }
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
  }, MAX_WAIT_FOR_INTEGRATION_LOAD);
};

export { loadBugsnag };

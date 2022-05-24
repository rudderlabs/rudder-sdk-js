/* eslint-disable import/prefer-default-export */
/* eslint-disable no-prototype-builtins */
import ScriptLoader from "../../integrations/ScriptLoader";

const metaData = {
  SDK: {
    name: "RudderStack JavaScript SDK",
    version: "process.package_version",
    installType: process.browser ? "CDN" : "NPM",
  },
};

const credentials = {
  apiKey: "0d96a60df267f4a13f808bbaa54e535c",
  releaseStage: "production",
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

function initClient(sourceId) {
  if (window.Bugsnag === undefined) return;

  window.rsBugsnagClient = window.Bugsnag.start({
    apiKey: credentials.apiKey,
    metadata: metaData,
    onError: (event) => {
      const errorOrigin = event.errors[0].stacktrace[0].file;
      if (typeof errorOrigin === "string") {
        const index = errorOrigin.lastIndexOf("/");
        if (!sdkNames.includes(errorOrigin.substring(index + 1))) return false; // Return false to discard the event
      }
      event.addMetadata("source", {
        sourceId,
      });
      return true;
    },
    autoTrackSessions: false,
  });

  window.rsBugsnagClient.releaseStage = credentials.releaseStage;
}

const init = (sourceId) => {
  if (window.hasOwnProperty("rsBugsnagClient")) return;

  if (window.Bugsnag !== undefined) {
    initClient(sourceId);
  } else {
    // Check if Bugsnag is loaded every '100'ms
    const interval = setInterval(function () {
      if (window.Bugsnag !== undefined) {
        clearInterval(interval);

        initClient(sourceId);
      }
    }, 100);
  }
};

export { load, init };

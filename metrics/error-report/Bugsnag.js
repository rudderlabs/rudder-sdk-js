/* eslint-disable import/prefer-default-export */
/* eslint-disable no-prototype-builtins */
import ScriptLoader from "../../integrations/ScriptLoader";

const META_DATA = {
  SDK: {
    name: "RudderStack JavaScript SDK",
    version: "process.package_version",
    installType: process.browser ? "CDN" : "NPM",
  },
};

// This API key token is parsed in the CI pipeline
const API_KEY = "{{RS_BUGSNAG_API_KEY}}";

const SDK_FILE_NAMES = [
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

  // If the API key token is not parsed yet, don't proceed to initialize the client
  // This also prevents unnecessary errors sent to Bugsnag during development phase.
  const apiKeyRegex = /{{.+}}/;
  if (API_KEY.match(apiKeyRegex) !== null) return;

  window.rsBugsnagClient = window.Bugsnag.start({
    apiKey: API_KEY,
    metadata: META_DATA,
    onError: (event) => {
      const errorOrigin = event.errors[0].stacktrace[0].file;
      if (typeof errorOrigin === "string") {
        const index = errorOrigin.lastIndexOf("/");
        if (!SDK_FILE_NAMES.includes(errorOrigin.substring(index + 1))) return false; // Return false to discard the event
      }
      event.addMetadata("source", {
        sourceId,
      });
      return true;
    },
    autoTrackSessions: false,
  });

  window.rsBugsnagClient.releaseStage = "production";
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

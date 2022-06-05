/* eslint-disable import/prefer-default-export */
/* eslint-disable no-prototype-builtins */
import ScriptLoader from "../../integrations/ScriptLoader";
import { configToIntNames } from "../../utils/config_to_integration_names";
import { MAX_WAIT_FOR_INTEGRATION_LOAD } from "../../utils/constants";
import { get } from "../../utils/utils";

// This SDK meta data will be send along with the error for more insight
const META_DATA = {
  SDK: {
    name: "JS",
    installType: process.browser ? "cdn" : "npm",
  },
};

// This API key token is parsed in the CI pipeline
const API_KEY = "{{RS_BUGSNAG_API_KEY}}";

// Errors only from Below SDKs are allowed to reach Bugsnag
const SDK_FILE_NAMES = [
  "browser.js",
  "rudder-analytics.min.js",
  "rudder-analytics-staging.min.js",
  "rudder-analytics.js",
  ...Object.values(configToIntNames).map((intgName) => `${intgName}.js`),
  ...Object.values(configToIntNames).map((intgName) => `${intgName}.min.js`),
  ...Object.values(configToIntNames).map(
    (intgName) => `${intgName}-staging.min.js`
  ),
];

/**
 * This function will load the Bugsnag native SDK through CDN
 * Once loaded it will be available in window.Bugsnag
 */
const load = () => {
  const pluginName = "bugsnag";
  if (!window.hasOwnProperty(pluginName)) {
    ScriptLoader(
      pluginName,
      "https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"
    );
  }
};

/**
 * This function is to initialize the bugsnag with apiKey, SDK meta data
 * and custom configuration for onError method.
 * After initialization Bugsnag instance will be available in window.rsBugsnagClient
 * @param {string} sourceId
 */
function initClient(sourceId) {
  if (window.Bugsnag === undefined) return;

  // If the API key token is not parsed yet, don't proceed to initialize the client
  // This also prevents unnecessary errors sent to Bugsnag during development phase.
  const apiKeyRegex = /{{.+}}/;
  if (API_KEY.match(apiKeyRegex) !== null) return;

  window.rsBugsnagClient = window.Bugsnag.start({
    apiKey: API_KEY,
    appVersion: "process.package_version", // Set SDK version as the app version
    metadata: META_DATA,
    onError: (event) => {
      const errorOrigin = get(event.errors[0], "stacktrace.0.file");
      // Skip errors that do not have a valid stack trace
      if (!errorOrigin || typeof errorOrigin !== "string") return false;

      const srcFileName = errorOrigin.substring(
        errorOrigin.lastIndexOf("/") + 1
      );
      if (!SDK_FILE_NAMES.includes(srcFileName))
        // Discard the event if it's not originated at the SDK
        return false;

      event.addMetadata("source", {
        sourceId,
      });
      // eslint-disable-next-line no-param-reassign
      event.severity = "error";
      return true;
    },
    autoTrackSessions: false, // auto tracking sessions is disabled
    collectUserIp: false, // collecting user's IP is disabled
    enabledBreadcrumbTypes: ["error", "log", "user"],
  });

  window.rsBugsnagClient.releaseStage = "production"; // set the release stage
}

/**
 * The responsibility of this function is to check Bugsnag native SDK
 * has been loaded or not in a certain interval.
 * If already loaded initialize the SDK.
 * @param {*} sourceId
 */
const init = (sourceId) => {
  if (window.hasOwnProperty("rsBugsnagClient")) return; // return if already initialized

  if (window.Bugsnag !== undefined) {
    initClient(sourceId);
  } else {
    // Check if Bugsnag is loaded every '100'ms
    const interval = setInterval(() => {
      if (window.Bugsnag !== undefined) {
        clearInterval(interval);

        initClient(sourceId);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
    }, MAX_WAIT_FOR_INTEGRATION_LOAD);
  }
};

export { load, init };

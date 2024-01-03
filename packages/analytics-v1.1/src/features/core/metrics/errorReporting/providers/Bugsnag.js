/* eslint-disable no-underscore-dangle */
import { configToIntNames } from '@rudderstack/analytics-js-common/v1.1/utils/config_to_integration_names';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME,
  MAX_WAIT_FOR_INTEGRATION_LOAD,
} from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import get from 'get-value';

// Using the Bugsnag integration version to avoid version issues
const BUGSNAG_CDN_URL = '__RS_BUGSNAG_SDK_URL__';
const BUGSNAG_VALID_MAJOR_VERSION = '6';
const ERROR_REPORT_PROVIDER_NAME_BUGSNAG = 'rs-bugsnag';
const BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME = 'bugsnag'; // For version 6 and bellow
const BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME = 'Bugsnag';
const GLOBAL_LIBRARY_OBJECT_NAMES = [
  BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME,
  BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME,
];

// This API key token is parsed in the CI pipeline
const API_KEY = '__RS_BUGSNAG_API_KEY__';

// Errors only from Below SDKs are allowed to reach Bugsnag
const SDK_FILE_NAMES = [
  'rudder-analytics.min.js',
  'rudder-analytics.js',
  ...Object.keys(configToIntNames).map(intgName => `${configToIntNames[intgName]}.min.js`),
  ...Object.keys(configToIntNames).map(intgName => `${configToIntNames[intgName]}.js`),
];
const BUGSNAG_ERROR_FILE_ORIGIN_KEY = 'stacktrace.0.file';

const getReleaseStage = () => {
  const host = window.location.hostname;
  const devHosts = ['www.test-host.com', 'localhost', '127.0.0.1', '[::1]'];

  return host && devHosts.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const isValidVersion = globalLibInstance => {
  // For version 7
  let version =
    globalLibInstance &&
    globalLibInstance._client &&
    globalLibInstance._client._notifier &&
    globalLibInstance._client._notifier.version;

  // For versions older than 7
  if (!version) {
    let tempInstance = globalLibInstance({
      apiKey: API_KEY,
      releaseStage: 'version-test',
      // eslint-disable-next-line func-names, object-shorthand
      beforeSend: function () {
        return false;
      },
    });
    version = tempInstance.notifier && tempInstance.notifier.version;
    tempInstance = undefined;
  }

  return version && version.charAt(0) === BUGSNAG_VALID_MAJOR_VERSION;
};

const isRudderSDKError = event => {
  const errorOrigin = get(event, BUGSNAG_ERROR_FILE_ORIGIN_KEY);

  if (!errorOrigin || typeof errorOrigin !== 'string') {
    return false;
  }

  const srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
  return SDK_FILE_NAMES.includes(srcFileName);
};

const enhanceErrorEventMutator = (event, metadataSource) => {
  event.updateMetaData('source', {
    metadataSource,
  });

  const { errorMessage } = event;
  // eslint-disable-next-line no-param-reassign
  event.context = errorMessage;

  // Hack for easily grouping the script load errors
  // on the dashboard
  if (errorMessage.includes('error in script loading')) {
    // eslint-disable-next-line no-param-reassign
    event.context = 'Script load failures';
  }

  // eslint-disable-next-line no-param-reassign
  event.severity = 'error';
};

const loadBugsnagSDKScript = name => {
  const isNotLoaded = GLOBAL_LIBRARY_OBJECT_NAMES.every(
    globalKeyName => !Object.hasOwn(window, globalKeyName),
  );

  if (isNotLoaded) {
    ScriptLoader(name, BUGSNAG_CDN_URL, {
      isNonNativeSDK: 'true',
      skipDatasetAttributes: true,
    });
  }
};

class BugsnagProvider {
  constructor(sourceId, writeKey, onClientReady) {
    this.pluginName = ERROR_REPORT_PROVIDER_NAME_BUGSNAG;
    this.sourceId = sourceId;
    this.writeKey = writeKey;
    this.onClientReady = onClientReady;
    this.initClientOnLibReadyInterval = undefined;
    this.init();
  }

  /**
   * The responsibility of this function is to check Bugsnag native SDK
   * has been loaded or not in a certain interval.
   * If already loaded initialize the SDK.
   */
  init() {
    // Return if RS Bugsnag instance is already initialized or should not init
    if (
      window.RudderStackGlobals &&
      window.RudderStackGlobals[ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME]
    ) {
      return;
    }

    if (!BUGSNAG_CDN_URL) {
      return;
    }

    const apiKeyRegex = /{{.+}}/;
    const isAPIKeyValid = !API_KEY.match(apiKeyRegex);

    // If API key token is not parsed or invalid, don't proceed to initialize the client
    if (!isAPIKeyValid) {
      return;
    }

    /**
     * This function will load the Bugsnag native SDK through CDN
     * Once loaded it will be available in window.Bugsnag
     */
    loadBugsnagSDKScript(this.pluginName);

    const globalBugsnagLibInstance = window[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

    // Initialize if SDK is loaded and has valid version else return if other version exists
    if (typeof globalBugsnagLibInstance === 'function') {
      if (isValidVersion(globalBugsnagLibInstance)) {
        this.initClient();
      }

      return;
    }

    // Check if Bugsnag is loaded with valid version every '100'ms
    this.initClientOnLibReadyInterval = setInterval(() => {
      const globalBugsnagLibInstanceOnInterval = window[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

      if (typeof globalBugsnagLibInstanceOnInterval === 'function') {
        if (isValidVersion(globalBugsnagLibInstanceOnInterval)) {
          this.initClient();
        }

        clearInterval(this.initClientOnLibReadyInterval);
      }
    }, 100);

    // Abort checking for the library after timeout expires
    setTimeout(() => {
      clearInterval(this.initClientOnLibReadyInterval);
    }, MAX_WAIT_FOR_INTEGRATION_LOAD);
  }

  /**
   * This function is to initialize the bugsnag with apiKey, SDK metadata
   * and custom configuration for onError method.
   * After initialization Bugsnag instance will be available in window.rsBugsnagClient
   */
  initClient() {
    const globalBugsnagLibInstance = window[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

    this.client = globalBugsnagLibInstance({
      apiKey: API_KEY,
      appVersion: '__PACKAGE_VERSION__', // Set SDK version as the app version from build config
      metaData: {
        SDK: {
          name: 'JS',
          installType: '__MODULE_TYPE__',
        },
      },
      beforeSend: this.onError(),
      autoTrackSessions: false, // auto tracking sessions is disabled
      collectUserIp: false, // collecting user's IP is disabled
      enabledBreadcrumbTypes: ['error', 'log', 'user'],
      maxEvents: 100,
      releaseStage: getReleaseStage(),
      networkBreadcrumbsEnabled: false,
      user: {
        id: this.writeKey,
      },
    });

    this.onClientReady();
  }

  onError() {
    const metadataSource = this.sourceId;

    return event => {
      try {
        // Discard the event if it's not originated at the SDK
        if (!isRudderSDKError(event)) {
          return false;
        }

        enhanceErrorEventMutator(event, metadataSource);

        return true;
      } catch {
        // Drop the error event if it couldn't be filtered as
        // it is most likely a non-SDK error
        return false;
      }
    };
  }

  notify(error) {
    if (this.client) {
      this.client.notify(error);
    }
  }

  leaveBreadcrumb(error) {
    if (this.client) {
      this.client.leaveBreadcrumb(error);
    }
  }
}

export { ERROR_REPORT_PROVIDER_NAME_BUGSNAG, BugsnagProvider };

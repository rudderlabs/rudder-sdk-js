import { CDN_INT_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { json } from '../shared-chunks/common';
import { BUGSNAG_SDK_LOAD_ERROR, BUGSNAG_SDK_LOAD_TIMEOUT_ERROR } from './logMessages';
import {
  API_KEY,
  APP_STATE_EXCLUDE_KEYS,
  BUGSNAG_CDN_URL,
  BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME,
  BUGSNAG_PLUGIN,
  BUGSNAG_VALID_MAJOR_VERSION,
  DEV_HOSTS,
  ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
  GLOBAL_LIBRARY_OBJECT_NAMES,
  MAX_WAIT_FOR_SDK_LOAD_MS,
  SDK_FILE_NAME_PREFIXES,
  SDK_LOAD_POLL_INTERVAL_MS,
} from './constants';
const isValidVersion = globalLibInstance => {
  var _a, _b, _c;
  // For version 7
  // eslint-disable-next-line no-underscore-dangle
  let version =
    (_b =
      (_a =
        globalLibInstance === null || globalLibInstance === void 0
          ? void 0
          : globalLibInstance._client) === null || _a === void 0
        ? void 0
        : _a._notifier) === null || _b === void 0
      ? void 0
      : _b.version;
  // For versions older than 7
  if (!version) {
    const tempInstance = globalLibInstance({
      apiKey: API_KEY,
      releaseStage: 'version-test',
      // eslint-disable-next-line func-names, object-shorthand
      beforeSend: function () {
        return false;
      },
    });
    version = (_c = tempInstance.notifier) === null || _c === void 0 ? void 0 : _c.version;
  }
  return version && version.charAt(0) === BUGSNAG_VALID_MAJOR_VERSION;
};
const isRudderSDKError = event => {
  var _a, _b;
  const errorOrigin =
    (_b = (_a = event.stacktrace) === null || _a === void 0 ? void 0 : _a[0]) === null ||
    _b === void 0
      ? void 0
      : _b.file;
  if (!errorOrigin || typeof errorOrigin !== 'string') {
    return false;
  }
  // Prefix folder for all the destination SDK scripts
  const isDestinationIntegrationBundle = errorOrigin.includes(CDN_INT_DIR);
  const srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
  return (
    isDestinationIntegrationBundle ||
    SDK_FILE_NAME_PREFIXES().some(
      prefix => srcFileName.startsWith(prefix) && srcFileName.endsWith('.js'),
    )
  );
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
const onError = state => {
  var _a;
  const metadataSource = (_a = state.source.value) === null || _a === void 0 ? void 0 : _a.id;
  return event => {
    try {
      // Discard the event if it's not originated at the SDK
      if (!isRudderSDKError(event)) {
        return false;
      }
      enhanceErrorEventMutator(event, metadataSource);
      return true;
    } catch (_a) {
      // Drop the error event if it couldn't be filtered as
      // it is most likely a non-SDK error
      return false;
    }
  };
};
const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  return host && DEV_HOSTS.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};
const getGlobalBugsnagLibInstance = () => globalThis[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];
const getNewClient = (state, logger) => {
  const globalBugsnagLibInstance = getGlobalBugsnagLibInstance();
  const clientConfig = {
    apiKey: API_KEY,
    appVersion: '__PACKAGE_VERSION__',
    metaData: {
      SDK: {
        name: 'JS',
        installType: '__MODULE_TYPE__',
      },
    },
    beforeSend: onError(state),
    autoCaptureSessions: false,
    collectUserIp: false,
    // enabledBreadcrumbTypes: ['error', 'log', 'user'], // for v7 and above
    maxEvents: 100,
    maxBreadcrumbs: 40,
    releaseStage: getReleaseStage(),
    user: {
      id: state.lifecycle.writeKey.value,
    },
    logger,
    networkBreadcrumbsEnabled: false,
  };
  const client = globalBugsnagLibInstance(clientConfig);
  return client;
};
const isApiKeyValid = apiKey => {
  const isAPIKeyValid = !(apiKey.startsWith('{{') || apiKey.endsWith('}}') || apiKey.length === 0);
  return isAPIKeyValid;
};
const loadBugsnagSDK = (externalSrcLoader, logger) => {
  const isNotLoaded = GLOBAL_LIBRARY_OBJECT_NAMES.every(
    globalKeyName => !globalThis[globalKeyName],
  );
  if (!isNotLoaded) {
    return;
  }
  externalSrcLoader.loadJSFile({
    url: BUGSNAG_CDN_URL,
    id: ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
    callback: id => {
      if (!id) {
        logger === null || logger === void 0
          ? void 0
          : logger.error(BUGSNAG_SDK_LOAD_ERROR(BUGSNAG_PLUGIN));
      }
    },
  });
};
const initBugsnagClient = (state, promiseResolve, promiseReject, logger, time = 0) => {
  const globalBugsnagLibInstance = getGlobalBugsnagLibInstance();
  if (typeof globalBugsnagLibInstance === 'function') {
    if (isValidVersion(globalBugsnagLibInstance)) {
      const client = getNewClient(state, logger);
      promiseResolve(client);
    }
  } else if (time >= MAX_WAIT_FOR_SDK_LOAD_MS) {
    promiseReject(new Error(BUGSNAG_SDK_LOAD_TIMEOUT_ERROR(MAX_WAIT_FOR_SDK_LOAD_MS)));
  } else {
    // Try to initialize the client after a delay
    globalThis.setTimeout(
      initBugsnagClient,
      SDK_LOAD_POLL_INTERVAL_MS,
      state,
      promiseResolve,
      promiseReject,
      logger,
      time + SDK_LOAD_POLL_INTERVAL_MS,
    );
  }
};
const getAppStateForMetadata = state => {
  const stateStr = json.stringifyWithoutCircular(state, false, APP_STATE_EXCLUDE_KEYS);
  return stateStr !== null ? JSON.parse(stateStr) : undefined;
};
export {
  isValidVersion,
  getNewClient,
  isApiKeyValid,
  loadBugsnagSDK,
  getGlobalBugsnagLibInstance,
  initBugsnagClient,
  getReleaseStage,
  isRudderSDKError,
  enhanceErrorEventMutator,
  onError,
  getAppStateForMetadata,
};

import { ApplicationState, IExternalSrcLoader, ILogger } from '../types/common';
import {
  API_KEY,
  BUGSNAG_CDN_URL,
  BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME,
  BUGSNAG_VALID_MAJOR_VERSION,
  ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
  GLOBAL_LIBRARY_OBJECT_NAMES,
  MAX_WAIT_FOR_SDK_LOAD_MS,
  SDK_FILE_NAME_PREFIXES,
  SDK_LOAD_POLL_INTERVAL_MS,
} from './constants';

const isValidVersion = (globalLibInstance: any) => {
  // For version 7
  // eslint-disable-next-line no-underscore-dangle
  let version = globalLibInstance?._client?._notifier?.version;

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
    version = tempInstance.notifier?.version;
  }

  return version && version.charAt(0) === BUGSNAG_VALID_MAJOR_VERSION;
};

const isRudderSDKError = (event: any) => {
  const errorOrigin = event.stacktrace?.[0]?.file;

  if (!errorOrigin || typeof errorOrigin !== 'string') {
    return false;
  }

  const srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
  return SDK_FILE_NAME_PREFIXES.some(
    prefix => srcFileName.startsWith(prefix) && srcFileName.endsWith('.js'),
  );
};

const enhanceErrorEventMutator = (event: any, metadataSource: any) => {
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

const onError = (state: ApplicationState) => {
  const metadataSource = state.source.value?.id;

  return (event: any) => {
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
};

const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  const devHosts = ['www.test-host.com', 'localhost', '127.0.0.1', '[::1]'];

  return host && devHosts.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const getNewClient = (state: ApplicationState): any => {
  const globalBugsnagLibInstance = (globalThis as any)[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

  const client = globalBugsnagLibInstance({
    apiKey: API_KEY,
    appVersion: '__PACKAGE_VERSION__', // Set SDK version as the app version from build config
    metaData: {
      SDK: {
        name: 'JS',
        installType: '__MODULE_TYPE__',
      },
    },
    beforeSend: onError(state),
    autoTrackSessions: false, // auto tracking sessions is disabled
    collectUserIp: false, // collecting user's IP is disabled
    enabledBreadcrumbTypes: ['error', 'log', 'user'],
    maxEvents: 100,
    releaseStage: getReleaseStage(),
  });

  return client;
};

const isApiKeyValid = (apiKey: string): boolean => {
  const isAPIKeyValid = !(apiKey.startsWith('{{') || apiKey.endsWith('}}') || apiKey.length === 0);
  return isAPIKeyValid;
};

const loadBugsnagSDK = (externalSrcLoader: IExternalSrcLoader, logger?: ILogger) => {
  const isNotLoaded = GLOBAL_LIBRARY_OBJECT_NAMES.every(
    globalKeyName => !(globalThis as any)[globalKeyName],
  );

  if (!isNotLoaded) {
    return;
  }

  externalSrcLoader
    .loadJSFile({
      url: BUGSNAG_CDN_URL,
      id: ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
      callback: () => {
        logger?.debug('Bugsnag script loaded');
      },
    })
    .catch(e => {
      logger?.error(`Script load failed for Bugsnag. Error message: ${e.message}`);
    });
};

const getGlobalBugsnagLibInstance = () => (globalThis as any)[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

const initBugsnagClient = (
  state: ApplicationState,
  promiseResolve: (value: any) => void,
  promiseReject: (reason?: any) => void,
  logger?: ILogger,
  time = 0,
) => {
  const globalBugsnagLibInstance = getGlobalBugsnagLibInstance();
  if (typeof globalBugsnagLibInstance === 'function') {
    if (isValidVersion(globalBugsnagLibInstance)) {
      const client = getNewClient(state);
      promiseResolve(client);
    }
  } else if (time >= MAX_WAIT_FOR_SDK_LOAD_MS) {
    promiseReject(new Error('Bugsnag SDK load timed out.'));
  } else {
    // Try to initialize the client after a delay
    setTimeout(
      initBugsnagClient,
      SDK_LOAD_POLL_INTERVAL_MS,
      state,
      promiseResolve,
      promiseReject,
      time + SDK_LOAD_POLL_INTERVAL_MS,
    );
  }
};

export {
  isValidVersion,
  getNewClient,
  isApiKeyValid,
  loadBugsnagSDK,
  getGlobalBugsnagLibInstance,
  initBugsnagClient,
};

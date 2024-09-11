import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CDN_INT_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { json } from '../shared-chunks/common';
import type { BugsnagLib } from '../types/plugins';
import {
  BUGSNAG_SDK_LOAD_ERROR,
  BUGSNAG_SDK_LOAD_TIMEOUT_ERROR,
  FAILED_TO_FILTER_ERROR,
} from './logMessages';
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

const isRudderSDKError = (event: BugsnagLib.Report) => {
  const errorOrigin = event.stacktrace?.[0]?.file;

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

const getAppStateForMetadata = (state: ApplicationState): Record<string, any> | undefined => {
  const stateStr = json.stringifyWithoutCircular(state, false, APP_STATE_EXCLUDE_KEYS);
  return stateStr !== null ? JSON.parse(stateStr) : undefined;
};

const enhanceErrorEventMutator = (state: ApplicationState, event: BugsnagLib.Report): void => {
  event.updateMetaData('source', {
    snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
  });
  event.updateMetaData('state', getAppStateForMetadata(state) ?? {});

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

const onError =
  (state: ApplicationState, logger?: ILogger): BugsnagLib.BeforeSend =>
  (event: BugsnagLib.Report): boolean => {
    try {
      // Discard the event if it's not originated at the SDK
      if (!isRudderSDKError(event)) {
        return false;
      }

      enhanceErrorEventMutator(state, event);

      return true;
    } catch {
      logger?.error(FAILED_TO_FILTER_ERROR(BUGSNAG_PLUGIN));
      // Drop the error event if it couldn't be filtered as
      // it is most likely a non-SDK error
      return false;
    }
  };

const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  return host && DEV_HOSTS.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const getGlobalBugsnagLibInstance = () => (globalThis as any)[BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME];

const getNewClient = (state: ApplicationState, logger?: ILogger): BugsnagLib.Client => {
  const globalBugsnagLibInstance = getGlobalBugsnagLibInstance();

  const clientConfig: BugsnagLib.IConfig = {
    apiKey: API_KEY,
    appVersion: state.context.app.value.version,
    metaData: {
      SDK: {
        name: 'JS',
        installType: state.context.app.value.installType,
      },
    },
    beforeSend: onError(state, logger),
    autoCaptureSessions: false, // auto capture sessions is disabled
    collectUserIp: false, // collecting user's IP is disabled
    // enabledBreadcrumbTypes: ['error', 'log', 'user'], // for v7 and above
    maxEvents: 100,
    maxBreadcrumbs: 40,
    releaseStage: getReleaseStage(),
    user: {
      id: state.source.value?.id || state.lifecycle.writeKey.value,
    },
    logger,
    networkBreadcrumbsEnabled: false,
  };

  const client: BugsnagLib.Client = globalBugsnagLibInstance(clientConfig);

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

  externalSrcLoader.loadJSFile({
    url: BUGSNAG_CDN_URL,
    id: ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
    callback: (id?: string, error?: Error) => {
      if (!id && error) {
        logger?.error(BUGSNAG_SDK_LOAD_ERROR(BUGSNAG_PLUGIN, error.message));
      }
    },
  });
};

const initBugsnagClient = (
  state: ApplicationState,
  promiseResolve: (value: BugsnagLib.Client) => void,
  promiseReject: (reason?: Error) => void,
  logger?: ILogger,
  time = 0,
): void => {
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
    (globalThis as typeof window).setTimeout(
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

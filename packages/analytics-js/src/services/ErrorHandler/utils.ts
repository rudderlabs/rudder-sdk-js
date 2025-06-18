import type {
  ApplicationState,
  Breadcrumb,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  ErrorType,
  type ErrorState,
  type SDKError,
} from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { clone } from 'ramda';
import type {
  ErrorEventPayload,
  Exception,
  MetricServicePayload,
} from '@rudderstack/analytics-js-common/types/Metrics';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { CDN_INT_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { METRICS_PAYLOAD_VERSION } from '@rudderstack/analytics-js-common/constants/metrics';
import {
  ERROR_MESSAGES_TO_BE_FILTERED,
  SCRIPT_LOAD_FAILURE_MESSAGES,
} from '@rudderstack/analytics-js-common/constants/errors';
import { SDK_CDN_BASE_URL } from '../../constants/urls';
import {
  APP_STATE_EXCLUDE_KEYS,
  DEV_HOSTS,
  NOTIFIER_NAME,
  SDK_FILE_NAME_PREFIXES,
  SDK_GITHUB_URL,
  SOURCE_NAME,
} from './constants';
import {
  isDefined,
  isString,
  isUndefined,
} from '@rudderstack/analytics-js-common/utilities/checks';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { normalizeError } from './ErrorEvent/event';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { detectAdBlockers } from '../../components/capabilitiesManager/detection/adBlockers';
import { effect } from '@preact/signals-core';

const getErrInstance = (err: SDKError, errorType: string) => {
  switch (errorType) {
    case ErrorType.UNHANDLEDEXCEPTION: {
      const { error } = err as ErrorEvent;
      return error || err;
    }
    case ErrorType.UNHANDLEDREJECTION: {
      return (err as PromiseRejectionEvent).reason;
    }
    case ErrorType.HANDLEDEXCEPTION:
    default:
      return err;
  }
};

const createNewBreadcrumb = (message: string): Breadcrumb => ({
  type: 'manual',
  name: message,
  timestamp: new Date(),
  metaData: {},
});

/**
 * A function to get the Bugsnag release stage for the current environment
 * @returns 'development' if the host is empty (for file:// protocol etc.) or a dev host (localhost, 127.0.0.1, etc.), otherwise '__RS_BUGSNAG_RELEASE_STAGE__' (it'll be replaced with the actual release stage during the build)
 */
const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  return !host || (host && DEV_HOSTS.includes(host))
    ? 'development'
    : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const getAppStateForMetadata = (state: ApplicationState): Record<string, any> => {
  const stateStr = stringifyWithoutCircular(state, false, APP_STATE_EXCLUDE_KEYS);
  return stateStr !== null ? JSON.parse(stateStr) : {};
};

const getURLWithoutQueryString = () => {
  const url = globalThis.location.href.split('?');
  return url[0];
};

const getUserDetails = (
  source: ApplicationState['source'],
  session: ApplicationState['session'],
  lifecycle: ApplicationState['lifecycle'],
  autoTrack: ApplicationState['autoTrack'],
) => ({
  id: `${source.value?.id ?? (lifecycle.writeKey.value as string)}..${session.sessionInfo.value.id ?? 'NA'}..${autoTrack.pageLifecycle.pageViewId.value ?? 'NA'}`,
  name: source.value?.name ?? 'NA',
});

const getDeviceDetails = (
  locale: ApplicationState['context']['locale'],
  userAgent: ApplicationState['context']['userAgent'],
) => ({
  locale: locale.value ?? 'NA',
  userAgent: userAgent.value ?? 'NA',
  time: new Date(),
});

const getBugsnagErrorEvent = (
  exception: Exception,
  errorState: ErrorState,
  state: ApplicationState,
  groupingHash?: string,
): ErrorEventPayload => {
  const { context, lifecycle, session, source, reporting, autoTrack } = state;
  const { app, locale, userAgent, timezone, screen, library } = context;

  return {
    payloadVersion: '5',
    notifier: {
      name: NOTIFIER_NAME,
      version: app.value.version,
      url: SDK_GITHUB_URL,
    },
    events: [
      {
        exceptions: [clone(exception)],
        severity: errorState.severity,
        unhandled: errorState.unhandled,
        severityReason: errorState.severityReason,
        app: {
          version: app.value.version,
          releaseStage: getReleaseStage(),
          type: app.value.installType,
        },
        device: getDeviceDetails(locale, userAgent),
        request: {
          url: getURLWithoutQueryString() as string,
          clientIp: '[NOT COLLECTED]',
        },
        breadcrumbs: clone(reporting.breadcrumbs.value),
        context: exception.message,
        groupingHash,
        metaData: {
          app: {
            snippetVersion: library.value.snippetVersion,
          },
          device: { ...screen.value, timezone: timezone.value },
          // Add rest of the state groups as metadata
          // so that they show up as separate tabs in the dashboard
          ...getAppStateForMetadata(state),
        },
        user: getUserDetails(source, session, lifecycle, autoTrack),
      },
    ],
  };
};

/**
 * A function to determine whether the error should be promoted to notify or not.
 * For plugin and integration errors from RS CDN, if it is due to CSP blocked URLs or AdBlockers,
 * it will not be promoted to notify.
 * If it is due to other reasons, it will be promoted to notify.
 * @param {Error} exception The error object
 * @param {ApplicationState} state The application state
 * @param {IHttpClient} httpClient The HTTP client instance
 * @returns A promise that resolves to a boolean indicating whether the error should be promoted to notify or not
 */
const checkIfAllowedToBeNotified = (
  exception: Exception,
  state: ApplicationState,
  httpClient: IHttpClient,
): Promise<boolean> => {
  const errMsg = exception.message;

  return new Promise(resolve => {
    // Filter out script load failures that are not from the RS CDN.
    if (SCRIPT_LOAD_FAILURE_MESSAGES.some((regex: RegExp) => regex.test(errMsg))) {
      const extractedURL = errMsg.match(/https?:\/\/\S+/)?.[0];
      if (isString(extractedURL)) {
        if (extractedURL.startsWith(SDK_CDN_BASE_URL)) {
          // Filter out errors that are from CSP blocked URLs.
          if (state.capabilities.cspBlockedURLs.value.includes(extractedURL)) {
            resolve(false);
          } else {
            // Filter out errors that are from AdBlockers.
            // Initiate ad blocker detection if not done previously and not already in progress.
            if (isUndefined(state.capabilities.isAdBlocked.value)) {
              if (state.capabilities.isAdBlockerDetectionInProgress.value === false) {
                detectAdBlockers(httpClient);
              }

              effect(() => {
                if (isDefined(state.capabilities.isAdBlocked.value)) {
                  // If ad blocker is not detected, notify.
                  resolve(state.capabilities.isAdBlocked.value === false);
                }
              });
            } else {
              // If ad blocker is not detected, notify.
              resolve(state.capabilities.isAdBlocked.value === false);
            }
          }
        } else {
          // Filter out errors that are not from the RS CDN.
          resolve(false);
        }
      } else {
        // Allow the error to be notified if no URL could be extracted from the error message
        resolve(true);
      }
    } else {
      resolve(!ERROR_MESSAGES_TO_BE_FILTERED.some((e: RegExp) => e.test(errMsg)));
    }
  });
};

/**
 * A function to determine if the error is from Rudder SDK
 * @param {Error} exception
 * @returns
 */
const isSDKError = (exception: Exception) => {
  const errorOrigin = exception.stacktrace[0]?.file;

  if (!errorOrigin || typeof errorOrigin !== 'string') {
    return false;
  }

  const srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
  const paths = errorOrigin.split('/');
  // extract the parent folder name from the error origin file path
  // Ex: parentFolderName will be 'sample' for url: https://example.com/sample/file.min.js
  const parentFolderName = paths[paths.length - 2];

  return (
    parentFolderName === CDN_INT_DIR ||
    SDK_FILE_NAME_PREFIXES().some(
      prefix => srcFileName.startsWith(prefix) && srcFileName.endsWith('.js'),
    )
  );
};

const getErrorDeliveryPayload = (payload: ErrorEventPayload, state: ApplicationState): string => {
  const data = {
    version: METRICS_PAYLOAD_VERSION,
    message_id: generateUUID(),
    source: {
      name: SOURCE_NAME,
      sdk_version: state.context.app.value.version,
      write_key: state.lifecycle.writeKey.value as string,
      install_type: state.context.app.value.installType,
    },
    errors: payload,
  };
  return stringifyWithoutCircular<MetricServicePayload>(data) as string;
};

/**
 * A function to get the grouping hash value to be used for the error event.
 * Grouping hash is suppressed for non-cdn installs.
 * If the grouping hash is an error instance, the normalized error message is used as the grouping hash.
 * If the grouping hash is an empty string or not specified, the default grouping hash is used.
 * If the grouping hash is a string, it is used as is.
 * @param curErrGroupingHash The grouping hash value part of the error event
 * @param defaultGroupingHash The default grouping hash value. It is the error message.
 * @param state The application state
 * @param logger The logger instance
 * @returns The final grouping hash value to be used for the error event
 */
const getErrorGroupingHash = (
  curErrGroupingHash: undefined | string | SDKError,
  defaultGroupingHash: string,
  state: ApplicationState,
  logger: ILogger,
) => {
  let normalizedGroupingHash: string | undefined;
  if (state.context.app.value.installType !== 'cdn') {
    return normalizedGroupingHash;
  }

  if (!isDefined(curErrGroupingHash)) {
    normalizedGroupingHash = defaultGroupingHash;
  } else if (isString(curErrGroupingHash)) {
    normalizedGroupingHash = curErrGroupingHash;
  } else {
    const normalizedErrorInstance = normalizeError(curErrGroupingHash, logger);
    if (isDefined(normalizedErrorInstance)) {
      normalizedGroupingHash = normalizedErrorInstance.message;
    } else {
      normalizedGroupingHash = defaultGroupingHash;
    }
  }
  return normalizedGroupingHash;
};

export {
  getErrInstance,
  createNewBreadcrumb,
  getReleaseStage,
  getAppStateForMetadata,
  getBugsnagErrorEvent,
  getURLWithoutQueryString,
  isSDKError,
  getErrorDeliveryPayload,
  checkIfAllowedToBeNotified,
  getUserDetails, // for testing
  getDeviceDetails, // for testing
  getErrorGroupingHash,
};

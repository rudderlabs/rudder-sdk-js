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
  INTEGRATIONS_LOAD_FAILURE_MESSAGES,
  PLUGINS_LOAD_FAILURE_MESSAGES,
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
 * A function to determine whether the error should be promoted to notify or not
 * @param {Error} exception
 * @returns
 */
const isAllowedToBeNotified = (exception: Exception) => {
  const errMsg = exception.message;

  // Filter out plugin load errors from non-RudderStack CDN URLs
  if (PLUGINS_LOAD_FAILURE_MESSAGES.some((regex: RegExp) => regex.test(errMsg))) {
    return errMsg.includes(SDK_CDN_BASE_URL);
  }

  // Filter out integration load errors from non-RudderStack CDN URLs
  if (INTEGRATIONS_LOAD_FAILURE_MESSAGES.some((regex: RegExp) => regex.test(errMsg))) {
    return errMsg.includes(SDK_CDN_BASE_URL);
  }

  return !ERROR_MESSAGES_TO_BE_FILTERED.some((e: RegExp) => e.test(errMsg));
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

export {
  getErrInstance,
  createNewBreadcrumb,
  getReleaseStage,
  getAppStateForMetadata,
  getBugsnagErrorEvent,
  getURLWithoutQueryString,
  isSDKError,
  getErrorDeliveryPayload,
  isAllowedToBeNotified,
  getUserDetails, // for testing
  getDeviceDetails, // for testing
};

import type {
  ApplicationState,
  Breadcrumb,
  BreadcrumbMetaData,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  ErrorType,
  type ErrorState,
  type SDKError,
} from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { CDN_INT_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { clone } from 'ramda';
import type {
  ErrorEventPayload,
  MetricServicePayload,
} from '@rudderstack/analytics-js-common/types/Metrics';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { METRICS_PAYLOAD_VERSION } from '@rudderstack/analytics-js-common/constants/metrics';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import {
  APP_STATE_EXCLUDE_KEYS,
  DEV_HOSTS,
  SDK_FILE_NAME_PREFIXES,
  SDK_GITHUB_URL,
  NOTIFIER_NAME,
  SOURCE_NAME,
} from './constants';
import { json } from '../shared-chunks/common';
import type { ErrorFormat } from './event/event';

const getConfigForPayloadCreation = (err: SDKError, errorType: string) => {
  switch (errorType) {
    case ErrorType.UNHANDLEDEXCEPTION: {
      const { error } = err as ErrorEvent;
      return {
        component: 'unhandledException handler',
        tolerateNonErrors: true,
        errorFramesToSkip: 1,
        normalizedError: error || err,
      };
    }
    case ErrorType.UNHANDLEDREJECTION: {
      const error = err as PromiseRejectionEvent;
      return {
        component: 'unhandledrejection handler',
        tolerateNonErrors: false,
        errorFramesToSkip: 1,
        normalizedError: error.reason,
      };
    }
    case ErrorType.HANDLEDEXCEPTION:
    default:
      return {
        component: 'notify()',
        tolerateNonErrors: true,
        errorFramesToSkip: 2,
        normalizedError: err,
      };
  }
};

const createNewBreadcrumb = (message: string, metaData?: BreadcrumbMetaData): Breadcrumb => ({
  type: 'manual',
  name: message,
  timestamp: new Date(),
  metaData: metaData ?? {},
});

const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  return host && DEV_HOSTS.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const getAppStateForMetadata = (state: ApplicationState): Record<string, any> => {
  const stateStr = json.stringifyWithoutCircular(state, false, APP_STATE_EXCLUDE_KEYS);
  return stateStr !== null ? JSON.parse(stateStr) : {};
};

const getURLWithoutQueryString = () => {
  const url = globalThis.location.href.split('?');
  return url[0];
};

const getErrorContext = (event: any) => {
  const { message } = event;
  let context = message;

  // Hack for easily grouping the script load errors
  // on the dashboard
  if (message.includes('Error in loading a third-party script')) {
    context = 'Script load failures';
  }
  return context;
};

const getBugsnagErrorEvent = (
  payload: ErrorFormat,
  errorState: ErrorState,
  state: ApplicationState,
): ErrorEventPayload => ({
  notifier: {
    name: NOTIFIER_NAME,
    version: state.context.app.value.version,
    url: SDK_GITHUB_URL,
  },
  events: [
    {
      payloadVersion: '5',
      exceptions: clone(payload.errors),
      severity: errorState.severity,
      unhandled: errorState.unhandled,
      severityReason: errorState.severityReason,
      app: {
        version: state.context.app.value.version,
        releaseStage: getReleaseStage(),
      },
      device: {
        locale: state.context.locale.value ?? undefined,
        userAgent: state.context.userAgent.value || undefined,
        time: new Date(),
      },
      request: {
        url: getURLWithoutQueryString() as string,
        clientIp: '[NOT COLLECTED]',
      },
      breadcrumbs: clone(state.reporting.breadcrumbs.value),
      context: getErrorContext(payload.errors[0]),
      metaData: {
        sdk: {
          name: 'JS',
          installType: state.context.app.value.installType,
        },
        state: getAppStateForMetadata(state) ?? {},
        source: {
          snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
        },
      },
      user: {
        id: state.source.value?.id || (state.lifecycle.writeKey.value as string),
      },
    },
  ],
});

const isRudderSDKError = (event: any) => {
  const errorOrigin = event.stacktrace?.[0]?.file;

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
  getConfigForPayloadCreation,
  createNewBreadcrumb,
  getReleaseStage,
  getAppStateForMetadata,
  getBugsnagErrorEvent,
  getURLWithoutQueryString,
  isRudderSDKError,
  getErrorDeliveryPayload,
  getErrorContext,
};

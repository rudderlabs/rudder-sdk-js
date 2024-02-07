import type {
  ApplicationState,
  BreadCrumb,
  BreadCrumbMetaData,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ErrorState, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { CDN_INT_DIR } from '@rudderstack/analytics-js-common/constants/urls';
import { clone } from 'ramda';
import type {
  ErrorEventPayload,
  MetricServicePayload,
} from '@rudderstack/analytics-js-common/types/Metrics';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { METRIC_PAYLOAD_VERSION } from '@rudderstack/analytics-js-common/constants/metrics';
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
import type { ErrorFormat } from './event';

const getConfigForPayloadCreation = (err: SDKError, errorType: string) => {
  switch (errorType) {
    case 'unhandledException': {
      const { error } = err as ErrorEvent;
      return {
        component: 'unhandledException handler',
        tolerateNonErrors: true,
        errorFramesToSkip: 1,
        normalizedError: error,
      };
    }
    case 'unhandledPromiseRejection': {
      const error = err as PromiseRejectionEvent;
      return {
        component: 'unhandledrejection handler',
        tolerateNonErrors: false,
        errorFramesToSkip: 1,
        normalizedError: error.reason,
      };
    }
    case 'handledException':
    default:
      return {
        component: 'notify()',
        tolerateNonErrors: true,
        errorFramesToSkip: 2,
        normalizedError: err,
      };
  }
};

const createNewBreadCrumb = (message: string, metaData?: BreadCrumbMetaData): BreadCrumb => ({
  type: 'manual',
  name: message,
  timestamp: new Date(),
  metaData: metaData || {},
});

const getReleaseStage = () => {
  const host = globalThis.location.hostname;
  return host && DEV_HOSTS.includes(host) ? 'development' : '__RS_BUGSNAG_RELEASE_STAGE__';
};

const getAppStateForMetadata = (state: ApplicationState): Record<string, any> => {
  const stateStr = json.stringifyWithoutCircular(state, false, APP_STATE_EXCLUDE_KEYS);
  return stateStr !== null ? JSON.parse(stateStr) : {};
};

const getURLWithoutSearchParam = () => {
  const url = globalThis.location.href.split('?');
  return url[0];
};

const getErrorContext = (event: any) => {
  const { message } = event;
  let context = message;

  // Hack for easily grouping the script load errors
  // on the dashboard
  if (message.includes('error in script loading')) {
    context = 'Script load failures';
  }
  return context;
};

const enhanceErrorEvent = (
  payload: ErrorFormat,
  errorState: ErrorState,
  state: ApplicationState,
): ErrorEventPayload => ({
  notifier: {
    name: NOTIFIER_NAME,
    version: '__PACKAGE_VERSION__',
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
        locale: state.context.locale.value || undefined,
        userAgent: state.context.userAgent.value || undefined,
        time: new Date(),
      },
      request: {
        url: getURLWithoutSearchParam() as string,
        clientIp: '[NOT COLLECTED]',
      },
      breadcrumbs: clone(state.reporting.breadCrumbs.value),
      context: getErrorContext(payload.errors[0]),
      metaData: {
        SDK: {
          name: 'JS',
          installType: '__MODULE_TYPE__',
        },
        STATE: getAppStateForMetadata(state),
        SOURCE: {
          id: state.source.value?.id,
          snippetVersion: (globalThis as typeof window).RudderSnippetVersion,
        },
      },
      user: {
        id: state.lifecycle.writeKey.value as string,
      },
    },
  ],
});

const isRudderSDKError = (event: any) => {
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

const getErrorDeliveryPayload = (payload: ErrorEventPayload, state: ApplicationState): string => {
  const data = {
    version: METRIC_PAYLOAD_VERSION,
    message_id: generateUUID(),
    source: {
      name: SOURCE_NAME,
      sdk_version: state.context.app.value.version,
      write_key: state.lifecycle.writeKey.value as string,
      install_type: '__MODULE_TYPE__',
    },
    errors: payload,
  };
  return stringifyWithoutCircular<MetricServicePayload>(data) as string;
};

const hasStack = (err: any) =>
  !!err &&
  (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
  typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
  err.stack !== `${err.name}: ${err.message}`;

const isError = (value: any) => {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
};

export {
  getConfigForPayloadCreation,
  createNewBreadCrumb,
  getReleaseStage,
  getAppStateForMetadata,
  enhanceErrorEvent,
  getURLWithoutSearchParam,
  isRudderSDKError,
  getErrorDeliveryPayload,
  getErrorContext,
  hasStack,
  isError,
};

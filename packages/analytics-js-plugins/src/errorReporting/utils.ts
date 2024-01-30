import type {
  ApplicationState,
  BreadCrumb,
  BreadCrumbMetaData,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ErrorState, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Event } from '@bugsnag/core';
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
  message,
  timestamp: new Date(),
  metadata: metaData || {},
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
  const { errorMessage } = event;
  let context = errorMessage;

  // Hack for easily grouping the script load errors
  // on the dashboard
  if (errorMessage.includes('error in script loading')) {
    context = 'Script load failures';
  }
  return context;
};

const enhanceErrorEvent = (
  payload: Event,
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
        version: '__PACKAGE_VERSION__',
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
      breadcrumbs: payload.breadcrumbs,
      context: getErrorContext(payload.errors[0]),
      metaData: {
        SDK: {
          name: 'JS',
          installType: '__MODULE_TYPE__',
        },
        STATE: getAppStateForMetadata(state),
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
      sdk_version: '__PACKAGE_VERSION__',
      write_key: state.lifecycle.writeKey.value as string,
      install_type: '__MODULE_TYPE__',
    },
    errors: payload,
  };
  return stringifyWithoutCircular<MetricServicePayload>(data) as string;
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
};

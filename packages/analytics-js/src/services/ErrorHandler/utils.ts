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
  DEFAULT_ERROR_CATEGORY,
  ERROR_MESSAGES_TO_BE_FILTERED,
  INTEGRATIONS_ERROR_CATEGORY,
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
import { isDefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { normalizeError } from './ErrorEvent/event';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';

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
 * @param getHostName Optional function to get the hostname (primarily for testing)
 * @returns 'development' if the host is empty (for file:// protocol etc.) or a dev host (localhost, 127.0.0.1, etc.), otherwise '__RS_BUGSNAG_RELEASE_STAGE__' (it'll be replaced with the actual release stage during the build)
 */
const getReleaseStage = (getHostName = () => window.location.hostname) => {
  const host = getHostName();
  return !host || (host && DEV_HOSTS.includes(host)) ? 'development' : __RS_BUGSNAG_RELEASE_STAGE__;
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
 * Whether a URL is the blocked one or sits beneath it.
 *
 * Browsers strip a cross-origin blockedURI down to its origin, so a stored entry
 * is often a prefix of the failing URL rather than equal to it. Matching on a
 * bare string prefix is too loose: an origin entry would swallow a look-alike
 * host, and a script entry would swallow its own source map. The prefix only
 * counts when the next character starts a new path, query or fragment.
 */
const isSameOrUnder = (url: string, blockedURL: string): boolean => {
  if (url === blockedURL) {
    return true;
  }

  if (!url.startsWith(blockedURL)) {
    return false;
  }

  const boundary = url.charAt(blockedURL.length);
  return boundary === '/' || boundary === '?' || boundary === '#';
};

// Probes already in flight, keyed by URL. Concurrent failures share one request
// rather than each firing its own HEAD and possibly reaching different verdicts
// about the same URL.
const inFlightProbes = new Map<string, (() => void)[]>();

/**
 * Probes the URL that failed to load and records what came back, so the report
 * can tell a request that never left the client from one the CDN answered with
 * an error. The failed URL is probed rather than a fixed path: plugins and
 * integrations sit under different prefixes and can be blocked independently.
 */
const probeSdkCdn = (
  state: ApplicationState,
  httpClient: IHttpClient,
  url: string,
  done: () => void,
): void => {
  if (isDefined(state.capabilities.sdkCdnProbe.value[url])) {
    done();
    return;
  }

  const waiting = inFlightProbes.get(url);
  if (waiting) {
    waiting.push(done);
    return;
  }
  inFlightProbes.set(url, [done]);

  httpClient.getAsyncData({
    url,
    // The CDN refuses preflight, so this has to stay a simple request: a HEAD
    // carrying none of the headers the client would otherwise add.
    skipAuthHeader: true,
    options: {
      method: 'HEAD',
      headers: {
        'Content-Type': undefined,
        Accept: undefined,
      },
    },
    isRawResponse: true,
    callback: (_result: any, details: any) => {
      // A request that never reached the CDN reports status 0. A blocker that
      // answers instead of dropping it lands on a URL outside the CDN. An
      // ordinary redirect that stays under the CDN -- canonicalisation, a signed
      // URL -- is the CDN answering and must not be mistaken for one.
      const status = details?.xhr?.status ?? 0;
      const responseURL = details?.xhr?.responseURL;

      state.capabilities.sdkCdnProbe.value = {
        ...state.capabilities.sdkCdnProbe.value,
        [url]: {
          status,
          timedOut: details?.timedOut === true,
          redirectedOffCdn:
            status !== 0 &&
            isString(responseURL) &&
            responseURL !== url &&
            !isSameOrUnder(responseURL, SDK_CDN_BASE_URL),
        },
      };

      const waiters = inFlightProbes.get(url) ?? [];
      inFlightProbes.delete(url);
      waiters.forEach(waiter => waiter());
    },
  });
};

/**
 * A function to determine whether the error should be promoted to notify or not.
 * Script load failures from a host other than the RS CDN are not promoted.
 * For those from the RS CDN, a probe of the failed URL is awaited so its result
 * is carried in the report, and the error is suppressed in exactly two cases: a
 * CSP violation covering that URL, or a probe whose shape nothing server side
 * produces -- a request that never reached the CDN, or one answered by
 * something else. Any status the CDN itself returned is promoted.
 * The generic ad blocker signal is deliberately not consulted: it probes the
 * source config host, and a client that cannot reach the CDN cannot be told
 * apart from a CDN outage.
 * Errors from other causes are promoted unless explicitly denylisted.
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
      const extractedURL = /https?:\/\/[^\s"'(),;<>[\]{}]+/.exec(errMsg)?.[0];
      if (isString(extractedURL)) {
        if (isSameOrUnder(extractedURL, SDK_CDN_BASE_URL)) {
          // Wait for the CDN reachability probe so its result is carried in the
          // report. The generic ad blocker signal is deliberately not consulted:
          // it probes the source config host rather than the CDN, and a client
          // that cannot reach the CDN is indistinguishable from a CDN outage, so
          // it must not suppress the error.
          probeSdkCdn(state, httpClient, extractedURL, () => {
            const isCspBlocked = state.capabilities.cspBlockedURLs.value.some(
              (blockedURL: string) => isSameOrUnder(extractedURL, blockedURL),
            );

            // A probe that never reached the CDN, or that was answered by
            // something else, is a client-side failure: nothing server side
            // produces either shape. A timeout is not attributable, and any
            // status the CDN itself returned is worth reporting.
            const probe = state.capabilities.sdkCdnProbe.value[extractedURL];
            const isClientSideFailure =
              probe !== undefined && !probe.timedOut && (probe.status === 0 || probe.redirectedOffCdn);

            resolve(!isCspBlocked && !isClientSideFailure);
          });
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
 * A function to get the directory name from a file path.
 * @param {string} filePath The file path
 * @returns The directory name or undefined if the file path is invalid
 */
const getDirectoryName = (filePath: string | undefined): string | undefined => {
  if (!filePath) {
    return undefined;
  }
  const paths = filePath.split('/');
  return paths.at(-2);
};

/**
 * A function to get the top stack path from the exception.
 * @param {Exception} exception The exception object
 * @returns The top stack path or undefined if the exception is invalid
 */
const getTopStackPath = (exception: Exception) => {
  const errorOrigin = exception.stacktrace[0]?.file;
  if (!errorOrigin || typeof errorOrigin !== 'string') {
    return undefined;
  }
  return errorOrigin;
};

/**
 * A function to determine if the error is from Rudder SDK
 * @param {Error} exception
 * @returns
 */
const isSDKError = (exception: Exception) => {
  const errorOrigin = getTopStackPath(exception);

  if (!errorOrigin) {
    return false;
  }

  const srcFileName = errorOrigin.substring(errorOrigin.lastIndexOf('/') + 1);
  const parentFolderName = getDirectoryName(errorOrigin);

  return (
    parentFolderName === CDN_INT_DIR ||
    SDK_FILE_NAME_PREFIXES().some(
      prefix => srcFileName.startsWith(prefix) && srcFileName.endsWith('.js'),
    )
  );
};

const getErrorCategory = (exception: Exception, category: string | undefined): string => {
  if (category) {
    return category;
  }

  const errorOrigin = getTopStackPath(exception);
  const directoryName = getDirectoryName(errorOrigin);
  if (directoryName === CDN_INT_DIR) {
    return INTEGRATIONS_ERROR_CATEGORY;
  }

  return DEFAULT_ERROR_CATEGORY;
};

const getErrorDeliveryPayload = (
  payload: ErrorEventPayload,
  state: ApplicationState,
  category: string,
): string => {
  const data = {
    version: METRICS_PAYLOAD_VERSION,
    message_id: generateUUID(),
    source: {
      name: SOURCE_NAME,
      sdk_version: state.context.app.value.version,
      write_key: state.lifecycle.writeKey.value as string,
      install_type: state.context.app.value.installType,
      category,
    },
    errors: payload,
  };
  return stringifyWithoutCircular<MetricServicePayload>(data) as string;
};

/**
 * A function to get the grouping hash value to be used for the error event.
 * If the grouping hash is an error instance, the normalized error message is used as the grouping hash.
 * If the grouping hash is an empty string or not specified, the default grouping hash is used.
 * If the grouping hash is a string, it is used as is.
 * @param curErrGroupingHash The grouping hash value part of the error event
 * @param defaultGroupingHash The default grouping hash value. It is the error message.
 * @param logger The logger instance
 * @returns The final grouping hash value to be used for the error event
 */
const getErrorGroupingHash = (
  curErrGroupingHash: undefined | string | SDKError,
  defaultGroupingHash: string,
  logger: ILogger,
) => {
  let normalizedGroupingHash: string | undefined;

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
  getErrorCategory,
};

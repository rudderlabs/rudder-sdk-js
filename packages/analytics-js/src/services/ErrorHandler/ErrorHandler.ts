import { isString, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  ErrorType,
  type ErrorInfo,
  type ErrorState,
  type IErrorHandler,
} from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import {
  getStacktrace,
  MANUAL_ERROR_IDENTIFIER,
} from '@rudderstack/analytics-js-common/utilities/errors';
import { BREADCRUMB_ERROR, HANDLE_ERROR_FAILURE } from '../../constants/logMessages';
import { state } from '../../state';
import { defaultLogger } from '../Logger';
import { createBugsnagException, normalizeError } from './ErrorEvent/event';
import { defaultHttpClient } from '../HttpClient';
import {
  createNewBreadcrumb,
  getBugsnagErrorEvent,
  getErrInstance,
  getErrorDeliveryPayload,
  getErrorGroupingHash,
  checkIfAllowedToBeNotified,
  isSDKError,
} from './utils';
import { SDK_CDN_BASE_URL } from '../../constants/urls';

/**
 * A service to handle errors
 */
class ErrorHandler implements IErrorHandler {
  httpClient: IHttpClient;
  logger: ILogger;
  private initialized = false;

  // If no logger is passed errors will be thrown as unhandled error
  constructor(httpClient: IHttpClient, logger: ILogger) {
    this.httpClient = httpClient;
    this.logger = logger;
  }

  /**
   * Initializes the error handler by attaching global error listeners.
   * This method should be called once after construction.
   */
  public init() {
    if (this.initialized) {
      return;
    }

    this.attachErrorListeners();
    this.initialized = true;
  }

  /**
   * Attach error listeners to the global window object
   */
  attachErrorListeners() {
    (globalThis as typeof window).addEventListener('error', (event: ErrorEvent | Event) => {
      this.onError({
        error: event,
        context: ERROR_HANDLER,
        errorType: ErrorType.UNHANDLEDEXCEPTION,
      });
    });

    (globalThis as typeof window).addEventListener(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        this.onError({
          error: event,
          context: ERROR_HANDLER,
          errorType: ErrorType.UNHANDLEDREJECTION,
        });
      },
    );

    // Listen to CSP violations and add the blocked URL to the state
    // if those URLs are from RS CDN.
    document.addEventListener('securitypolicyviolation', (event: SecurityPolicyViolationEvent) => {
      const blockedURL = isString(event.blockedURI) ? event.blockedURI : '';
      if (
        event.disposition === 'enforce' &&
        blockedURL.startsWith(SDK_CDN_BASE_URL) &&
        !state.capabilities.cspBlockedURLs.value.includes(blockedURL)
      ) {
        state.capabilities.cspBlockedURLs.value = [
          ...state.capabilities.cspBlockedURLs.value,
          blockedURL,
        ];
      }
    });
  }

  /**
   * Handle errors
   * @param errorInfo - The error information
   * @param errorInfo.error - The error to handle
   * @param errorInfo.context - The context of where the error occurred
   * @param errorInfo.customMessage - The custom message of the error
   * @param errorInfo.errorType - The type of the error (handled or unhandled)
   * @param errorInfo.groupingHash - The grouping hash of the error
   */
  async onError(errorInfo: ErrorInfo) {
    try {
      const { error, context, customMessage, groupingHash } = errorInfo;
      const errorType = errorInfo.errorType ?? ErrorType.HANDLEDEXCEPTION;

      const errInstance = getErrInstance(error, errorType);
      const normalizedError = normalizeError(errInstance, this.logger);
      if (isUndefined(normalizedError)) {
        return;
      }

      const customMsgVal = customMessage ? `${customMessage} - ` : '';
      const errorMsgPrefix = `${context}${LOG_CONTEXT_SEPARATOR}${customMsgVal}`;
      const bsException = createBugsnagException(normalizedError, errorMsgPrefix);

      const stacktrace = getStacktrace(normalizedError) as string;
      const isSdkDispatched = stacktrace.includes(MANUAL_ERROR_IDENTIFIER);

      // Filter errors that are not originated in the SDK.
      // In case of NPM installations, the unhandled errors from the SDK cannot be identified
      // and will NOT be reported unless they occur in plugins or integrations.
      if (
        !isSdkDispatched &&
        !isSDKError(bsException) &&
        errorType !== ErrorType.HANDLEDEXCEPTION
      ) {
        return;
      }

      if (state.reporting.isErrorReportingEnabled.value) {
        const isAllowed = await checkIfAllowedToBeNotified(bsException, state, this.httpClient);
        if (isAllowed) {
          const errorState: ErrorState = {
            severity: 'error',
            unhandled: errorType !== ErrorType.HANDLEDEXCEPTION,
            severityReason: { type: errorType },
          };

          // Set grouping hash only for CDN installations (as an experiment)
          // This will allow us to group errors by the message instead of the surrounding code.
          // In case of NPM installations, the default grouping by surrounding code does not make sense as each user application is different.
          // References:
          // https://docs.bugsnag.com/platforms/javascript/customizing-error-reports/#groupinghash
          // https://docs.bugsnag.com/product/error-grouping/#user_defined
          const normalizedGroupingHash = getErrorGroupingHash(
            groupingHash,
            bsException.message,
            state,
            this.logger,
          );

          // Get the final payload to be sent to the metrics service
          const bugsnagPayload = getBugsnagErrorEvent(
            bsException,
            errorState,
            state,
            normalizedGroupingHash,
          );

          // send it to metrics service
          this.httpClient.getAsyncData({
            url: state.metrics.metricsServiceUrl.value as string,
            options: {
              method: 'POST',
              data: getErrorDeliveryPayload(bugsnagPayload, state),
              sendRawData: true,
            },
            isRawResponse: true,
          });
        }
      }

      // Log handled errors and errors dispatched by the SDK
      if (errorType === ErrorType.HANDLEDEXCEPTION || isSdkDispatched) {
        this.logger.error(bsException.message);
      }
    } catch (err) {
      // If an error occurs while handling an error, log it
      this.logger.error(HANDLE_ERROR_FAILURE(ERROR_HANDLER), err);
    }
  }

  /**
   * Add breadcrumbs to add insight of a user's journey before an error
   * occurred and send to external error monitoring service via a plugin
   *
   * @param {string} breadcrumb breadcrumbs message
   */
  leaveBreadcrumb(breadcrumb: string) {
    try {
      state.reporting.breadcrumbs.value = [
        ...state.reporting.breadcrumbs.value,
        createNewBreadcrumb(breadcrumb),
      ];
    } catch (err) {
      this.onError({
        error: err,
        context: ERROR_HANDLER,
        customMessage: BREADCRUMB_ERROR,
        groupingHash: BREADCRUMB_ERROR,
      });
    }
  }
}

// Note: Remember to call defaultErrorHandler.init() before using it
const defaultErrorHandler = new ErrorHandler(defaultHttpClient, defaultLogger);

export { ErrorHandler, defaultErrorHandler };

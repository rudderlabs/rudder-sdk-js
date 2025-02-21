import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  ErrorType,
  type ErrorState,
  type IErrorHandler,
  type SDKError,
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
  isAllowedToBeNotified,
  isSDKError,
} from './utils';

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
      this.onError(event, ERROR_HANDLER, undefined, ErrorType.UNHANDLEDEXCEPTION);
    });

    (globalThis as typeof window).addEventListener(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        this.onError(event, ERROR_HANDLER, undefined, ErrorType.UNHANDLEDREJECTION);
      },
    );
  }

  /**
   * Handle errors
   * @param error - The error to handle
   * @param context - The context of where the error occurred
   * @param customMessage - The custom message of the error
   * @param errorType - The type of the error (handled or unhandled)
   */
  onError(
    error: SDKError,
    context = '',
    customMessage = '',
    errorType = ErrorType.HANDLEDEXCEPTION,
  ) {
    try {
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

      if (state.reporting.isErrorReportingEnabled.value && isAllowedToBeNotified(bsException)) {
        const errorState: ErrorState = {
          severity: 'error',
          unhandled: errorType !== ErrorType.HANDLEDEXCEPTION,
          severityReason: { type: errorType },
        };

        // enrich error payload
        const bugsnagPayload = getBugsnagErrorEvent(bsException, errorState, state);

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
      this.onError(err, BREADCRUMB_ERROR(ERROR_HANDLER));
    }
  }
}

// Note: Remember to call defaultErrorHandler.init() before using it
const defaultErrorHandler = new ErrorHandler(defaultHttpClient, defaultLogger);

export { ErrorHandler, defaultErrorHandler };

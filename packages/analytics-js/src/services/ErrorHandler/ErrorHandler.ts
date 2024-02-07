import type { IPluginEngine } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { removeDoubleSpaces } from '@rudderstack/analytics-js-common/utilities/string';
import { isTypeOfError } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  ErrorState,
  IErrorHandler,
  PreLoadErrorData,
  SDKError,
} from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { BufferQueue } from '@rudderstack/analytics-js-common/services/BufferQueue/BufferQueue';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { NOTIFY_FAILURE_ERROR } from '../../constants/logMessages';
import { state } from '../../state';
import { defaultPluginEngine } from '../PluginEngine';
import { defaultLogger } from '../Logger';
import { isAllowedToBeNotified, processError } from './processError';

/**
 * A service to handle errors
 */
class ErrorHandler implements IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  httpClient?: IHttpClient;
  errReportingClient?: any;
  errorBuffer: BufferQueue<PreLoadErrorData>;

  // If no logger is passed errors will be thrown as unhandled error
  constructor(logger?: ILogger, pluginEngine?: IPluginEngine, httpClient?: IHttpClient) {
    this.logger = logger;
    this.pluginEngine = pluginEngine;
    this.errorBuffer = new BufferQueue();
    this.httpClient = httpClient;
    this.attachEffect();
  }

  attachEffect() {
    if (state.reporting.isErrorReportingPluginLoaded.value === true) {
      while (this.errorBuffer.size() > 0) {
        const errorToProcess = this.errorBuffer.dequeue();

        if (errorToProcess) {
          // send it to the plugin
          this.notifyError(errorToProcess.error, errorToProcess.errorState);
        }
      }
    }
  }

  attachErrorListeners() {
    if ('addEventListener' in (globalThis as typeof window)) {
      (globalThis as typeof window).addEventListener('error', (event: ErrorEvent | Event) => {
        this.onError(event, undefined, undefined, undefined, 'unhandledException');
      });

      (globalThis as typeof window).addEventListener(
        'unhandledrejection',
        (event: PromiseRejectionEvent) => {
          this.onError(event, undefined, undefined, undefined, 'unhandledPromiseRejection');
        },
      );
    } else {
      this.logger?.debug(`Failed to attach global error listeners.`);
    }
  }

  init(httpClient?: IHttpClient) {
    this.httpClient = httpClient;
  }

  onError(
    error: SDKError,
    context = '',
    customMessage = '',
    shouldAlwaysThrow = false,
    errorType = 'handledException',
  ) {
    // Error handling is already implemented in processError method
    let errorMessage = processError(error);

    // If no error message after we normalize, then we swallow/ignore the errors
    if (!errorMessage) {
      return;
    }
    const errorState: ErrorState = {
      severity: 'error',
      unhandled: errorType !== 'handledException',
      severityReason: { type: errorType },
    };
    errorMessage = removeDoubleSpaces(
      `${context}${LOG_CONTEXT_SEPARATOR}${customMessage} ${errorMessage}`,
    );

    let normalizedError = new Error(errorMessage);
    if (isTypeOfError(error)) {
      normalizedError = Object.create(error, {
        message: { value: errorMessage },
      });
    }

    const isErrorReportingEnabled = state.reporting.isErrorReportingEnabled.value;
    const isErrorReportingPluginLoaded = state.reporting.isErrorReportingPluginLoaded.value;
    try {
      if (isErrorReportingEnabled) {
        const errorToBeSend = errorType === 'handledException' ? normalizedError : error;
        if (!isErrorReportingPluginLoaded) {
          // buffer the error
          this.errorBuffer.enqueue({
            error: errorToBeSend,
            errorState,
          });
        } else {
          this.notifyError(errorToBeSend, errorState);
        }
      }
    } catch (e) {
      this.logger?.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER), e);
    }

    if (errorType === 'handledException') {
      if (this.logger) {
        this.logger.error(errorMessage);

        if (shouldAlwaysThrow) {
          throw normalizedError;
        }
      } else {
        throw normalizedError;
      }
    }
  }

  /**
   * Add breadcrumbs to add insight of a user's journey before an error
   * occurred and send to external error monitoring service via a plugin
   *
   * @param {string} breadcrumb breadcrumbs message
   */
  leaveBreadcrumb(breadcrumb: string) {
    if (this.pluginEngine) {
      try {
        this.pluginEngine.invokeSingle('errorReporting.breadcrumb', breadcrumb, state);
      } catch (err) {
        this.onError(err, ERROR_HANDLER, 'errorReporting.breadcrumb');
      }
    }
  }

  /**
   * Send handled errors to external error monitoring service via a plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error: SDKError, errorState: ErrorState) {
    if (this.pluginEngine && isAllowedToBeNotified(error)) {
      try {
        this.pluginEngine?.invokeSingle(
          'errorReporting.notify',
          error,
          errorState,
          state,
          this.httpClient,
          this.logger,
        );
      } catch (err) {
        // Not calling onError here as we don't want to go into infinite loop
        this.logger?.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER), err);
      }
    }
  }
}

const defaultErrorHandler = new ErrorHandler(defaultLogger, defaultPluginEngine);

export { ErrorHandler, defaultErrorHandler };

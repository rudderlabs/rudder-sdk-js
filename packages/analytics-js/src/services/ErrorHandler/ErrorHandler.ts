import type { IPluginEngine } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { removeDoubleSpaces } from '@rudderstack/analytics-js-common/utilities/string';
import { isTypeOfError } from '@rudderstack/analytics-js-common/utilities/checks';
import {
  ErrorType,
  type ErrorState,
  type IErrorHandler,
  type PreLoadErrorData,
  type SDKError,
} from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { BufferQueue } from '@rudderstack/analytics-js-common/services/BufferQueue/BufferQueue';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import {
  NOTIFY_FAILURE_ERROR,
  REPORTING_PLUGIN_INIT_FAILURE_ERROR,
} from '../../constants/logMessages';
import { state } from '../../state';
import { defaultPluginEngine } from '../PluginEngine';
import { defaultLogger } from '../Logger';
import {
  isAllowedToBeNotified,
  getNormalizedErrorForUnhandledError,
  processError,
} from './processError';

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
  constructor(logger?: ILogger, pluginEngine?: IPluginEngine) {
    this.logger = logger;
    this.pluginEngine = pluginEngine;
    this.errorBuffer = new BufferQueue();
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
        this.onError(event, undefined, undefined, undefined, ErrorType.UNHANDLEDEXCEPTION);
      });

      (globalThis as typeof window).addEventListener(
        'unhandledrejection',
        (event: PromiseRejectionEvent) => {
          this.onError(event, undefined, undefined, undefined, ErrorType.UNHANDLEDREJECTION);
        },
      );
    } else {
      this.logger?.debug(`Failed to attach global error listeners.`);
    }
  }

  init(httpClient: IHttpClient, externalSrcLoader: IExternalSrcLoader) {
    this.httpClient = httpClient;
    // Below lines are only kept for backward compatibility
    // TODO: Remove this in the next major release
    if (!this.pluginEngine) {
      return;
    }

    try {
      const extPoint = 'errorReporting.init';
      const errReportingInitVal = this.pluginEngine.invokeSingle(
        extPoint,
        state,
        this.pluginEngine,
        externalSrcLoader,
        this.logger,
        true,
      );
      if (errReportingInitVal instanceof Promise) {
        errReportingInitVal
          .then((client: any) => {
            this.errReportingClient = client;
          })
          .catch(err => {
            this.logger?.error(REPORTING_PLUGIN_INIT_FAILURE_ERROR(ERROR_HANDLER), err);
          });
      }
    } catch (err) {
      this.onError(err, ERROR_HANDLER);
    }
  }

  onError(
    error: SDKError,
    context = '',
    customMessage = '',
    shouldAlwaysThrow = false,
    errorType = ErrorType.HANDLEDEXCEPTION,
  ) {
    let normalizedError;
    let errorMessage;
    if (errorType === ErrorType.HANDLEDEXCEPTION) {
      errorMessage = processError(error);

      // If no error message after we normalize, then we swallow/ignore the errors
      if (!errorMessage) {
        return;
      }

      errorMessage = removeDoubleSpaces(
        `${context}${LOG_CONTEXT_SEPARATOR}${customMessage} ${errorMessage}`,
      );

      normalizedError = new Error(errorMessage);
      if (isTypeOfError(error)) {
        normalizedError = Object.create(error, {
          message: { value: errorMessage },
        });
      }
    } else {
      normalizedError = getNormalizedErrorForUnhandledError(error);
    }

    const isErrorReportingEnabled = state.reporting.isErrorReportingEnabled.value;
    const isErrorReportingPluginLoaded = state.reporting.isErrorReportingPluginLoaded.value;
    try {
      if (isErrorReportingEnabled) {
        const errorState: ErrorState = {
          severity: 'error',
          unhandled: errorType !== ErrorType.HANDLEDEXCEPTION,
          severityReason: { type: errorType },
        };

        if (!isErrorReportingPluginLoaded) {
          // buffer the error
          this.errorBuffer.enqueue({
            error: normalizedError,
            errorState,
          });
        } else if (normalizedError) {
          this.notifyError(normalizedError, errorState);
        }
      }
    } catch (e) {
      this.logger?.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER), e);
    }

    if (errorType === ErrorType.HANDLEDEXCEPTION) {
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
        this.pluginEngine.invokeSingle(
          'errorReporting.breadcrumb',
          this.pluginEngine, // deprecated parameter
          this.errReportingClient, // deprecated parameter
          breadcrumb,
          this.logger,
          state,
        );
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
    if (this.pluginEngine && this.httpClient && isAllowedToBeNotified(error)) {
      try {
        this.pluginEngine.invokeSingle(
          'errorReporting.notify',
          this.pluginEngine, // deprecated parameter
          this.errReportingClient, // deprecated parameter
          error,
          state,
          this.logger,
          this.httpClient,
          errorState,
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

import { serializeError } from 'serialize-error';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { pluginEngineInstance } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { processError, SDKError } from './processError';

class ErrorHandler {
  logger?: Logger;

  // If no logger is passed errors will be thrown as unhandled instead of logged
  constructor(logger?: Logger) {
    this.logger = logger;
  }

  onError(error: SDKError, context = '', customMessage = '') {
    const isTypeOfError = error instanceof Error;
    let errorMessage = '';

    try {
      errorMessage = processError(error);
    } catch (err) {
      this.notifyError(err as Error);

      if (this.logger) {
        this.logger.error(`[Analytics] Exception:: ${(err as Error).message}`);
        // TODO: JSON.stringify goes into circular dependency if window object exist in firefox, fix this known issue, trying serializeError
        this.logger.error(`[Analytics] Original error:: ${serializeError(error)}`);
      } else {
        throw err;
      }
    }

    // If no error message after we normalize, then we swallow/ignore the errors
    if (!errorMessage) {
      return;
    }

    errorMessage = `[Analytics] ${context}:: ${customMessage} ${errorMessage}`.replace(
      / {2,}/g,
      ' ',
    ); // remove double spaces

    // Enhance error message
    if (isTypeOfError) {
      // eslint-disable-next-line no-param-reassign
      (error as Error).message = errorMessage;
    }

    this.notifyError(isTypeOfError ? error : new Error(errorMessage));

    if (this.logger) {
      this.logger.error(errorMessage);
    } else {
      throw error;
    }
  }

  /**
   * Add breadcrumbs to add insight of a user's journey before an error
   * occurred and send to external error monitoring service via plugin
   *
   * @param {string} breadcrumb breadcrumbs message
   */
  leaveBreadcrumb(breadcrumb: string) {
    pluginEngineInstance.invoke('errorMonitoring.breadcrumb', breadcrumb, this.logger);
  }

  /**
   * Send handled errors to external error monitoring service via plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error: Error) {
    pluginEngineInstance.invoke('errorMonitoring.notify', error, this.logger);
  }
}

const defaultErrorHandler = new ErrorHandler(defaultLogger);

export { ErrorHandler, defaultErrorHandler };

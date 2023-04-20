import { serializeError } from 'serialize-error';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { IPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { removeDoubleSpaces } from '@rudderstack/analytics-js/components/utilities/string';
import { processError } from './processError';
import { IErrorHandler, SDKError } from './types';

/**
 * A service to handle errors
 */
class ErrorHandler implements IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;

  // If no logger is passed errors will be thrown as unhandled error
  constructor(logger?: ILogger, pluginEngine?: IPluginEngine) {
    this.logger = logger;
    this.pluginEngine = pluginEngine;
  }

  onError(error: SDKError, context = '', customMessage = '', shouldAlwaysThrow = false) {
    const isTypeOfError = error instanceof Error;
    let errorMessage = '';

    try {
      errorMessage = processError(error);
    } catch (err) {
      this.notifyError(err as Error);

      if (this.logger) {
        this.logger.error(`[Analytics] Exception:: ${(err as Error).message}`);
        // TODO: JSON.stringify goes into circular dependency if window object exist in firefox, fix this known issue, trying serializeError
        this.logger.error(`[Analytics] Original error:: ${JSON.stringify(serializeError(error))}`);
      } else {
        throw err;
      }
    }

    // If no error message after we normalize, then we swallow/ignore the errors
    if (!errorMessage) {
      return;
    }

    errorMessage = removeDoubleSpaces(`[Analytics] ${context}:: ${customMessage} ${errorMessage}`);

    // Enhance error message
    if (isTypeOfError) {
      // eslint-disable-next-line no-param-reassign
      (error as Error).message = errorMessage;
    }

    const normalisedError = isTypeOfError ? error : new Error(errorMessage);

    this.notifyError(normalisedError);

    if (this.logger) {
      this.logger.error(errorMessage);

      if (shouldAlwaysThrow) {
        throw normalisedError;
      }
    } else {
      throw normalisedError;
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
        this.pluginEngine.invoke('errorMonitoring.breadcrumb', breadcrumb, this.logger);
      } catch (err) {
        this.onError(err, 'errorMonitoring.breadcrumb');
      }
    }
  }

  /**
   * Send handled errors to external error monitoring service via a plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error: Error) {
    if (this.pluginEngine) {
      try {
        this.pluginEngine.invoke('errorMonitoring.notify', error, this.logger);
      } catch (err) {
        this.onError(err, 'errorMonitoring.notify');
      }
    }
  }
}

const defaultErrorHandler = new ErrorHandler(defaultLogger, defaultPluginEngine);

export { ErrorHandler, defaultErrorHandler };

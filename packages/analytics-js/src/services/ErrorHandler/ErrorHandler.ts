import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { IPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine/types';
import { removeDoubleSpaces } from '@rudderstack/analytics-js/components/utilities/string';
import { state } from '@rudderstack/analytics-js/state';
import { IExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/types';
import { isAllowedToBeNotified, processError } from './processError';
import { IErrorHandler, SDKError } from './types';

/**
 * A service to handle errors
 */
class ErrorHandler implements IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  errReportingClient?: any;

  // If no logger is passed errors will be thrown as unhandled error
  constructor(logger?: ILogger, pluginEngine?: IPluginEngine) {
    this.logger = logger;
    this.pluginEngine = pluginEngine;
  }

  init(externalSrcLoader: IExternalSrcLoader) {
    if (!this.pluginEngine) {
      return;
    }

    try {
      const errReportingInitVal = this.pluginEngine.invokeSingle(
        'errorReporting.init',
        state,
        this.pluginEngine,
        externalSrcLoader,
        this.logger,
      );
      if (errReportingInitVal === null) {
        this.logger?.error('Something went wrong during error reporting plugin invocation.');
      } else if (errReportingInitVal instanceof Promise) {
        errReportingInitVal
          .then((client: any) => {
            this.errReportingClient = client;
          })
          .catch(err => {
            this.logger?.error('Unable to initialize error reporting plugin.', err);
          });
      }
    } catch (err) {
      this.onError(err, 'errorReporting.init');
    }
  }

  onError(error: SDKError, context = '', customMessage = '', shouldAlwaysThrow = false) {
    const isTypeOfError = error instanceof Error;
    // Error handling is already implemented in processError method
    let errorMessage = processError(error);

    // If no error message after we normalize, then we swallow/ignore the errors
    if (!errorMessage) {
      return;
    }

    errorMessage = removeDoubleSpaces(`${context}:: ${customMessage} ${errorMessage}`);

    // Enhance error message
    if (isTypeOfError) {
      // eslint-disable-next-line no-param-reassign
      (error as Error).message = errorMessage;
    }

    const normalizeError = isTypeOfError ? error : new Error(errorMessage);

    this.notifyError(normalizeError);

    if (this.logger) {
      this.logger.error(errorMessage);

      if (shouldAlwaysThrow) {
        throw normalizeError;
      }
    } else {
      throw normalizeError;
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
          this.pluginEngine,
          this.errReportingClient,
          breadcrumb,
          this.logger,
        );
      } catch (err) {
        this.onError(err, 'errorReporting.breadcrumb');
      }
    }
  }

  /**
   * Send handled errors to external error monitoring service via a plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error: Error) {
    if (this.pluginEngine && isAllowedToBeNotified(error)) {
      try {
        this.pluginEngine.invokeSingle(
          'errorReporting.notify',
          this.pluginEngine,
          this.errReportingClient,
          error,
          this.logger,
        );
      } catch (err) {
        // Not calling onError here as we don't want to go into infinite loop
        this.logger?.error('Error while notifying error', err);
      }
    }
  }
}

const defaultErrorHandler = new ErrorHandler(defaultLogger, defaultPluginEngine);

export { ErrorHandler, defaultErrorHandler };

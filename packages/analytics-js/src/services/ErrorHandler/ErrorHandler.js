import { removeDoubleSpaces } from '@rudderstack/analytics-js-common/utilities/string';
import { isTypeOfError } from '@rudderstack/analytics-js-common/utilities/checks';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import {
  NOTIFY_FAILURE_ERROR,
  REPORTING_PLUGIN_INIT_FAILURE_ERROR,
} from '../../constants/logMessages';
import { state } from '../../state';
import { defaultPluginEngine } from '../PluginEngine';
import { defaultLogger } from '../Logger';
import { isAllowedToBeNotified, processError } from './processError';
/**
 * A service to handle errors
 */
class ErrorHandler {
  // If no logger is passed errors will be thrown as unhandled error
  constructor(logger, pluginEngine) {
    this.logger = logger;
    this.pluginEngine = pluginEngine;
  }
  init(externalSrcLoader) {
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
      );
      if (errReportingInitVal instanceof Promise) {
        errReportingInitVal
          .then(client => {
            this.errReportingClient = client;
          })
          .catch(err => {
            var _a;
            (_a = this.logger) === null || _a === void 0
              ? void 0
              : _a.error(REPORTING_PLUGIN_INIT_FAILURE_ERROR(ERROR_HANDLER), err);
          });
      }
    } catch (err) {
      this.onError(err, ERROR_HANDLER);
    }
  }
  onError(error, context = '', customMessage = '', shouldAlwaysThrow = false) {
    // Error handling is already implemented in processError method
    let errorMessage = processError(error);
    // If no error message after we normalize, then we swallow/ignore the errors
    if (!errorMessage) {
      return;
    }
    errorMessage = removeDoubleSpaces(
      `${context}${LOG_CONTEXT_SEPARATOR}${customMessage} ${errorMessage}`,
    );
    let normalizedError = error;
    // Enhance error message
    if (isTypeOfError(error)) {
      normalizedError.message = errorMessage;
    } else {
      normalizedError = new Error(errorMessage);
    }
    this.notifyError(normalizedError);
    if (this.logger) {
      this.logger.error(errorMessage);
      if (shouldAlwaysThrow) {
        throw normalizedError;
      }
    } else {
      throw normalizedError;
    }
  }
  /**
   * Add breadcrumbs to add insight of a user's journey before an error
   * occurred and send to external error monitoring service via a plugin
   *
   * @param {string} breadcrumb breadcrumbs message
   */
  leaveBreadcrumb(breadcrumb) {
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
        this.onError(err, ERROR_HANDLER, 'errorReporting.breadcrumb');
      }
    }
  }
  /**
   * Send handled errors to external error monitoring service via a plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error) {
    var _a;
    if (this.pluginEngine && isAllowedToBeNotified(error)) {
      try {
        this.pluginEngine.invokeSingle(
          'errorReporting.notify',
          this.pluginEngine,
          this.errReportingClient,
          error,
          state,
          this.logger,
        );
      } catch (err) {
        // Not calling onError here as we don't want to go into infinite loop
        (_a = this.logger) === null || _a === void 0
          ? void 0
          : _a.error(NOTIFY_FAILURE_ERROR(ERROR_HANDLER), err);
      }
    }
  }
}
const defaultErrorHandler = new ErrorHandler(defaultLogger, defaultPluginEngine);
export { ErrorHandler, defaultErrorHandler };

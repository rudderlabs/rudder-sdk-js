import { IPluginEngine } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IErrorHandler, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
/**
 * A service to handle errors
 */
declare class ErrorHandler implements IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  errReportingClient?: any;
  constructor(logger?: ILogger, pluginEngine?: IPluginEngine);
  init(externalSrcLoader: IExternalSrcLoader): void;
  onError(
    error: SDKError,
    context?: string,
    customMessage?: string,
    shouldAlwaysThrow?: boolean,
  ): void;
  /**
   * Add breadcrumbs to add insight of a user's journey before an error
   * occurred and send to external error monitoring service via a plugin
   *
   * @param {string} breadcrumb breadcrumbs message
   */
  leaveBreadcrumb(breadcrumb: string): void;
  /**
   * Send handled errors to external error monitoring service via a plugin
   *
   * @param {Error} error Error instance from handled error
   */
  notifyError(error: Error): void;
}
declare const defaultErrorHandler: ErrorHandler;
export { ErrorHandler, defaultErrorHandler };

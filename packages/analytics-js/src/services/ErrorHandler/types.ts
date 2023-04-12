import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

export type SDKError = Error | Event | string | unknown;

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  onError(
    error: SDKError,
    context?: string,
    customMessage?: string,
    shouldAlwaysThrow?: boolean,
  ): void;
  leaveBreadcrumb(breadcrumb: string): void;
  notifyError(error: Error): void;
}

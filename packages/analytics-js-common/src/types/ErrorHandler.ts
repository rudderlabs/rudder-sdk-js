import { IPluginEngine } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';

export type SDKError = unknown;

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  init(externalSrcLoader: IExternalSrcLoader): void;
  onError(
    error: SDKError,
    context?: string,
    customMessage?: string,
    shouldAlwaysThrow?: boolean,
  ): void;
  leaveBreadcrumb(breadcrumb: string): void;
  notifyError(error: Error): void;
}

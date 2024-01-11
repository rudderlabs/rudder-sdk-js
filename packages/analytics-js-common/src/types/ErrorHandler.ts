import type { IPluginEngine } from './PluginEngine';
import type { ILogger } from './Logger';
import type { IExternalSrcLoader } from '../services/ExternalSrcLoader/types';

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
    errorType?: string,
  ): void;
  leaveBreadcrumb(breadcrumb: string): void;
  notifyError(error: Error): void;
  attachErrorListeners(): void;
}

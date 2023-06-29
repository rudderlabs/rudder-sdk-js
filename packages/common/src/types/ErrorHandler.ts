import { IPluginEngine } from '@rudderstack/common/types/PluginEngine';
import { ILogger } from '@rudderstack/common/types/Logger';
import { IExternalSrcLoader } from '@rudderstack/common/types/ExternalSrcLoader';

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  // TODO: fix this circular
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

export type SDKError = Error | Event | string | unknown;

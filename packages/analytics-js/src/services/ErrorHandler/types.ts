import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine/types';

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

export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id?: string): unknown;
  async?: boolean;
  timeout?: number;
  extraAttributes?: Record<string, string>;
}

export interface IExternalSrcLoader {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): void;
}

import type { IPluginEngine } from './PluginEngine';
import type { ILogger } from './Logger';
import type { IExternalSrcLoader } from '../services/ExternalSrcLoader/types';
import type { BufferQueue } from '../services/BufferQueue/BufferQueue';

export type SDKError = unknown | Error | ErrorEvent | Event | PromiseRejectionEvent;

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  errorBuffer: BufferQueue<PreloadedError>;
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

export type PreloadedError = Array<any>;

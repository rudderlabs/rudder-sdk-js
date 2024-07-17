import type { IPluginEngine } from './PluginEngine';
import type { ILogger } from './Logger';
import type { BufferQueue } from '../services/BufferQueue/BufferQueue';
import type { IHttpClient } from './HttpClient';
import type { IExternalSrcLoader } from '../services/ExternalSrcLoader/types';

export type SDKError = unknown | Error | ErrorEvent | Event | PromiseRejectionEvent;

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  errorBuffer: BufferQueue<PreLoadErrorData>;
  init(httpClient: IHttpClient, externalSrcLoader: IExternalSrcLoader): void;
  onError(
    error: SDKError,
    context?: string,
    customMessage?: string,
    shouldAlwaysThrow?: boolean,
    errorType?: string,
  ): void;
  leaveBreadcrumb(breadcrumb: string): void;
  notifyError(error: Error, errorState: ErrorState): void;
  attachErrorListeners(): void;
}

export type ErrorState = {
  severity: string;
  unhandled: boolean;
  severityReason: { type: string };
};

export interface ErrorTarget extends Element {
  dataset?: { loader?: string; isnonnativesdk?: string };
  src?: string;
}

export type PreLoadErrorData = {
  error: SDKError;
  errorState: ErrorState;
};

export enum ErrorType {
  HANDLEDEXCEPTION = 'handledException',
  UNHANDLEDEXCEPTION = 'unhandledException',
  UNHANDLEDREJECTION = 'unhandledPromiseRejection',
}

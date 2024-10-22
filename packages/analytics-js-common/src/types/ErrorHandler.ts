import type { IHttpClient } from './HttpClient';
import type { IExternalSrcLoader } from '../services/ExternalSrcLoader/types';

export type SDKError = string | Error | ErrorEvent | Event | PromiseRejectionEvent;

export interface IErrorHandler {
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

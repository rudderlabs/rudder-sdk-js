import type { Event as BugSnagEvent } from '@bugsnag/js';
import type { ILogger } from './Logger';
import type { IHttpClient } from './HttpClient';

export type SDKError = unknown | Error | ErrorEvent | Event | PromiseRejectionEvent;

export type ErrorInfo = {
  error: SDKError;
  context: string;
  customMessage?: string;
  errorType?: ErrorType;
  groupingHash?: string | SDKError;
  category?: 'sdk' | 'integrations';
};

export interface IErrorHandler {
  httpClient: IHttpClient;
  logger: ILogger;
  init(): void;
  onError(errorInfo: ErrorInfo): Promise<void>;
  leaveBreadcrumb(breadcrumb: string): void;
}

export type ErrorState = {
  severity: BugSnagEvent['severity'];
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

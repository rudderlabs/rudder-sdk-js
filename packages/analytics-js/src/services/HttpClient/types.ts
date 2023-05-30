import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';

export interface IRequestConfig {
  url: string;
  options?: Partial<IXHRRequestOptions>;
  isRawResponse?: boolean;
  timeout?: number;
}

export type RejectionDetails = {
  error: Error;
  xhr?: XMLHttpRequest;
  options: IXHRRequestOptions;
};

export interface IAsyncRequestConfig<T> extends IRequestConfig {
  callback?(data?: T | string | undefined, rejectionDetails?: RejectionDetails): void;
}

export interface IXHRRequestOptions {
  method: HTTPClientMethod;
  url: string;
  headers: Record<string, string | undefined>;
  data?: XMLHttpRequestBodyInit;
  sendRawData?: boolean;
}

export type HTTPClientMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

export interface IHttpClient {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  basicAuthHeader?: string;
  hasErrorHandler: boolean;
  hasLogger: boolean;
  getData<T = any>(
    config: IRequestConfig,
  ): Promise<{ data: T | string | undefined; rejectionDetails?: RejectionDetails }>;
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  setAuthHeader(value: string, noBto?: boolean): void;
  resetAuthHeader(): void;
}

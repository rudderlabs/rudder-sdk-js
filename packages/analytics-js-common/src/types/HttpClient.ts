import type { IErrorHandler } from './ErrorHandler';
import type { ILogger } from './Logger';

export interface IRequestConfig {
  url: string;
  options?: Partial<IXHRRequestOptions>;
  isRawResponse?: boolean;
  timeout?: number;
}

export type ResponseDetails = {
  response: string;
  error?: Error;
  xhr?: XMLHttpRequest;
  options: IXHRRequestOptions;
};

export type AsyncRequestCallback<T> = (
  data?: T | string | undefined,
  details?: ResponseDetails,
) => void;
export interface IAsyncRequestConfig<T> extends IRequestConfig {
  callback?: AsyncRequestCallback<T>;
}

export interface IXHRRequestOptions {
  method: HTTPClientMethod;
  url: string;
  headers: Record<string, string | undefined>;
  data?: XMLHttpRequestBodyInit;
  sendRawData?: boolean;
  withCredentials?: boolean;
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
  init: (errorHandler: IErrorHandler) => void;
  getData<T = any>(
    config: IRequestConfig,
  ): Promise<{ data: T | string | undefined; details?: ResponseDetails }>;
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  setAuthHeader(value: string, noBto?: boolean): void;
  resetAuthHeader(): void;
}

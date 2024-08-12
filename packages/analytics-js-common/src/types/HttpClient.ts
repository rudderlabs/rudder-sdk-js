import type { IErrorHandler } from './ErrorHandler';
import type { ILogger } from './Logger';

export type XHRResponseDetails = {
  response: string;
  error?: Error;
  url: string | URL;
  xhr?: XMLHttpRequest;
  options: IXHRRequestOptions;
};

export type AsyncRequestCallback<T> = (
  data?: T | string | undefined,
  details?: XHRResponseDetails,
) => void;

export interface IAsyncRequestConfig<T> {
  url: string | URL;
  options?: IXHRRequestOptions | IFetchRequestOptions | IBeaconRequestOptions;
  isRawResponse?: boolean;
  timeout?: number;
  callback?: AsyncRequestCallback<T>;
}

export interface IRequestOptions {
  method: HTTPClientMethod;
  headers?: Record<string, string | undefined>;
  sendRawData?: boolean;
  withCredentials?: boolean;
}

export interface IXHRRequestOptions extends IRequestOptions {
  data?: Document | XMLHttpRequestBodyInit | null;
}

export interface IFetchRequestOptions extends IRequestOptions {
  data?: BodyInit | null;
  keepalive?: boolean;
}

export interface IBeaconRequestOptions extends IRequestOptions {
  data?: BodyInit | null;
}

export type HTTPClientMethod =
  | 'GET'
  | 'DELETE'
  | 'CONNECT'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'POST'
  | 'PUT'
  | 'PATCH';

export interface IHttpClient {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  basicAuthHeader?: string;
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  setAuthHeader(value: string, noBto?: boolean): void;
  resetAuthHeader(): void;
}

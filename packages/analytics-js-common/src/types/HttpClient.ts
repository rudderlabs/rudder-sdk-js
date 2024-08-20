import type { IErrorHandler } from './ErrorHandler';
import type { ILogger } from './Logger';

export interface IHttpClientError extends Error {
  status?: number;
  statusText?: string;
  responseBody?: string | null;
}

export interface IResponseDetails {
  response?: Response;
  error?: IHttpClientError;
  url: string | URL;
  options: IRequestOptions;
}

export type AsyncRequestCallback<T> = (
  data: T | string | undefined | null,
  details: IResponseDetails,
) => void;

export interface IAsyncRequestConfig<T> {
  url: string | URL;
  options?: IRequestOptions;
  isRawResponse?: boolean;
  timeout?: number;
  callback?: AsyncRequestCallback<T>;
}

export interface IBaseRequestOptions {
  sendRawData?: boolean;
  useAuth?: boolean;
}

export type IRequestOptions = IXHRRequestOptions | IFetchRequestOptions | IBeaconRequestOptions;

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
  logger?: ILogger;
  basicAuthHeader?: string;
  transportFn: (url: string | URL, options: any) => Promise<Response>;
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  request<T = any>(config: IAsyncRequestConfig<T>): void;
  setAuthHeader(value: string, noBto?: boolean): void;
  resetAuthHeader(): void;
}

export interface IXHRRequestOptions
  extends Omit<
      RequestInit,
      | 'body'
      | 'mode'
      | 'cache'
      | 'redirect'
      | 'referrerPolicy'
      | 'integrity'
      | 'keepalive'
      | 'method'
    >,
    IBaseRequestOptions {
  withCredentials?: boolean;
  body?: Document | XMLHttpRequestBodyInit | null;
  timeout?: number; // timeout in milliseconds
  method: HTTPClientMethod;
}

export interface IFetchRequestOptions
  extends Omit<RequestInit, 'body' | 'method'>,
    IBaseRequestOptions {
  body?: BodyInit | null;
  timeout?: number; // timeout in milliseconds
  method: HTTPClientMethod;
}

export interface IBeaconRequestOptions extends IBaseRequestOptions {
  body?: BodyInit | null;
}

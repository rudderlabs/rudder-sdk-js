import type { ILogger } from './Logger';

export type HttpClientErrorProperties = {
  status?: number;
  statusText?: string;
  responseBody?: string | null;
  originalError?: Error;
};

export interface IHttpClientError extends Error {
  status?: number;
  statusText?: string;
  responseBody?: string | null;
}

export type ResponseDetails = {
  url: string | URL;
  options: IRequestOptions;
} & ({ response: Response; error?: never } | { error: IHttpClientError; response?: never });

export type AsyncRequestCallback<T> = (
  data: T | undefined | null,
  details: ResponseDetails,
) => void;

export interface IAsyncRequestConfig<T> {
  url: string | URL;
  options?: IRequestOptions;
  isRawResponse?: boolean;
  timeout?: number;
  callback?: AsyncRequestCallback<T>;
}

export interface IBaseRequestOptions {
  useAuth?: boolean;
}

export type IRequestOptions = IFetchRequestOptions;

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
  private_logger?: ILogger;
  private_basicAuthHeader?: string;
  /**
   * Makes an async request to the given URL
   * @param config Request configuration
   * @deprecated Use `request` instead
   */
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  request<T = any>(config: IAsyncRequestConfig<T>): void;
  setAuthHeader(value: string, noBto?: boolean): void;
  resetAuthHeader(): void;
}

export interface IFetchRequestOptions extends Omit<RequestInit, 'method'>, IBaseRequestOptions {
  timeout?: number; // timeout in milliseconds
  method: HTTPClientMethod;
}

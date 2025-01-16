import type { ILogger } from './Logger';

export type HttpClientErrorProperties = {
  status?: number;
  statusText?: string;
  responseBody?: string | null;
  /**
   * Original underlying error instance
   */
  originalError?: Error;
};

export interface IHttpClientError extends Error {
  status?: number;
  statusText?: string;
  responseBody?: string | null;
}

export type ResponseDetails = {
  response?: Response;
  error?: IHttpClientError;
  url: string | URL;
  options: IRequestOptions;
} & ({ response: Response } | { error: IHttpClientError });

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

export type HTTPClientMethod = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';

export interface IHttpClient {
  logger?: ILogger;
  basicAuthHeader?: string;
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

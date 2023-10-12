import {
  IAsyncRequestConfig,
  IHttpClient,
  IRequestConfig,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * Service to handle data communication with APIs
 */
declare class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  basicAuthHeader?: string;
  hasErrorHandler: boolean;
  constructor(errorHandler?: IErrorHandler, logger?: ILogger);
  /**
   * Implement requests in a blocking way
   */
  getData<T = any>(
    config: IRequestConfig,
  ): Promise<{
    data: T | string | undefined;
    details?: ResponseDetails;
  }>;
  /**
   * Implement requests in a non-blocking way
   */
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void;
  /**
   * Handle errors
   */
  onError(error: unknown): void;
  /**
   * Set basic authentication header (eg writekey)
   */
  setAuthHeader(value: string, noBtoa?: boolean): void;
  /**
   * Clear basic authentication header
   */
  resetAuthHeader(): void;
}
declare const defaultHttpClient: HttpClient;
export { HttpClient, defaultHttpClient };

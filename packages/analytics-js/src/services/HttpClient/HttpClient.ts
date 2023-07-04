import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { isFunction } from '@rudderstack/common/utilities/checks';
import {
  IAsyncRequestConfig,
  IHttpClient,
  IRequestConfig,
  RejectionDetails,
} from '@rudderstack/common/types/HttpClient';
import { IErrorHandler } from '@rudderstack/common/types/ErrorHandler';
import { ILogger } from '@rudderstack/common/types/Logger';
import { responseTextToJson } from './xhr/xhrResponseHandler';
import { createXhrRequestOptions, xhrRequest } from './xhr/xhrRequestHandler';

// TODO: should we add any debug level loggers?

/**
 * Service to handle data communication with APIs
 */
class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  basicAuthHeader?: string;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.onError = this.onError.bind(this);
  }

  /**
   * Implement requests in a blocking way
   */
  async getData<T = any>(
    config: IRequestConfig,
  ): Promise<{ data: T | string | undefined; rejectionDetails?: RejectionDetails }> {
    const { url, options, timeout, isRawResponse } = config;

    try {
      const data = await xhrRequest(
        createXhrRequestOptions(url, options, this.basicAuthHeader),
        timeout,
        this.logger,
      );
      return { data: isRawResponse ? data : responseTextToJson<T>(data, this.onError) };
    } catch (reason) {
      this.onError((reason as RejectionDetails).error ?? reason);
      return { data: undefined, rejectionDetails: reason as RejectionDetails };
    }
  }

  /**
   * Implement requests in a non-blocking way
   */
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, timeout, isRawResponse } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    xhrRequest(createXhrRequestOptions(url, options, this.basicAuthHeader), timeout, this.logger)
      .then((data?: string) => {
        if (!isFireAndForget) {
          callback(isRawResponse ? data : responseTextToJson<T>(data, this.onError));
        }
      })
      .catch((reason: RejectionDetails) => {
        this.onError(reason.error ?? reason);
        if (!isFireAndForget) {
          callback(undefined, reason);
        }
      });
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }

  /**
   * Set basic authentication header (eg writekey)
   */
  setAuthHeader(value: string, noBtoa = false) {
    this.basicAuthHeader = `Basic ${noBtoa ? value : btoa(`${value}:`)}`;
  }

  /**
   * Clear basic authentication header
   */
  resetAuthHeader() {
    this.basicAuthHeader = undefined;
  }
}

const defaultHttpClient = new HttpClient(defaultErrorHandler, defaultLogger);

export { HttpClient, defaultHttpClient };

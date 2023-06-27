import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { createXhrRequestOptions, xhrRequest } from './xhr/xhrRequestHandler';
import { responseTextToJson } from './xhr/xhrResponseHandler';
import { IAsyncRequestConfig, IHttpClient, IRequestConfig, ResponseDetails } from './types';

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
  ): Promise<{ data: T | string | undefined; details?: ResponseDetails }> {
    const { url, options, timeout, isRawResponse } = config;

    try {
      const data = await xhrRequest(
        createXhrRequestOptions(url, options, this.basicAuthHeader),
        timeout,
        this.logger,
      );
      return {
        data: isRawResponse ? data.response : responseTextToJson<T>(data.response, this.onError),
        details: data,
      };
    } catch (reason) {
      this.onError((reason as ResponseDetails).error ?? reason);
      return { data: undefined, details: reason as ResponseDetails };
    }
  }

  /**
   * Implement requests in a non-blocking way
   */
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, timeout, isRawResponse } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    xhrRequest(createXhrRequestOptions(url, options, this.basicAuthHeader), timeout, this.logger)
      .then((data: ResponseDetails) => {
        if (!isFireAndForget) {
          callback(
            isRawResponse ? data.response : responseTextToJson<T>(data.response, this.onError),
            data,
          );
        }
      })
      .catch((data: ResponseDetails) => {
        this.onError(data.error ?? data);
        if (!isFireAndForget) {
          callback(undefined, data);
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

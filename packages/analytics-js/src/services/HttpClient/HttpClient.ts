import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { createXhrRequestOptions, xhrRequest } from './xhr/xhrRequestHandler';
import { responseTextToJson } from './xhr/xhrResponseHandler';
import { IAsyncRequestConfig, IHttpClient, IRequestConfig } from './types';

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
  async getData<T = any>(config: IRequestConfig): Promise<T | string | undefined> {
    const { url, options, timeout, isRawResponse } = config;

    try {
      const data = await xhrRequest(
        createXhrRequestOptions(url, options, this.basicAuthHeader),
        timeout,
      );
      return isRawResponse ? data : responseTextToJson<T>(data, this.onError);
    } catch (err) {
      this.onError(err);
      return undefined;
    }
  }

  /**
   * Implement requests in a non-blocking way
   */
  getAsyncData<T = any>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, timeout, isRawResponse } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    xhrRequest(createXhrRequestOptions(url, options, this.basicAuthHeader), timeout)
      .then((data?: string) => {
        if (!isFireAndForget) {
          callback(isRawResponse ? data : responseTextToJson<T>(data, this.onError));
        }
      })
      .catch(err => {
        this.onError(err);
        if (!isFireAndForget) {
          callback(err);
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

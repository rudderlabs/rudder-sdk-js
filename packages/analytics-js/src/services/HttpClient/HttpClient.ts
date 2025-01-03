import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  IAsyncRequestConfig,
  IHttpClient,
  IRequestConfig,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { HTTP_CLIENT } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { defaultLogger } from '../Logger';
import { responseTextToJson } from './xhr/xhrResponseHandler';
import { createXhrRequestOptions, xhrRequest } from './xhr/xhrRequestHandler';

// TODO: should we add any debug level loggers?

/**
 * Service to handle data communication with APIs
 */
class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger: ILogger;
  basicAuthHeader?: string;

  constructor(logger: ILogger) {
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  init(errorHandler: IErrorHandler) {
    this.errorHandler = errorHandler;
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
    const isFireAndForget = !isFunction(callback);

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
  onError(error: unknown) {
    this.errorHandler?.onError(error, HTTP_CLIENT);
  }

  /**
   * Set basic authentication header (eg writekey)
   */
  setAuthHeader(value: string, noBtoa = false) {
    const authVal = noBtoa ? value : toBase64(`${value}:`);
    this.basicAuthHeader = `Basic ${authVal}`;
  }

  /**
   * Clear basic authentication header
   */
  resetAuthHeader() {
    this.basicAuthHeader = undefined;
  }
}

const defaultHttpClient = new HttpClient(defaultLogger);

export { HttpClient, defaultHttpClient };

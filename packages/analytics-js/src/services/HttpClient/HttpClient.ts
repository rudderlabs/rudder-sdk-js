import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  IAsyncRequestConfig,
  IHttpClient,
  IHttpClientError,
  IRequestOptions,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { DEFAULT_REQ_TIMEOUT_MS } from '../../constants/timeouts';
import { RESPONSE_PARSE_ERROR } from '../../constants/logMessages';
import { HttpClientError } from './utils';
import { makeFetchRequest } from './fetch';

const DEFAULT_REQUEST_OPTIONS: Partial<IRequestOptions> = {
  timeout: DEFAULT_REQ_TIMEOUT_MS,
  method: 'GET',
};

/**
 * Service to handle data communication with APIs
 */
class HttpClient implements IHttpClient {
  private_logger?: ILogger;
  private_basicAuthHeader?: string;

  constructor(logger?: ILogger) {
    this.private_logger = logger;
  }

  /**
   * Implement requests in a non-blocking way
   */
  request<T>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, isRawResponse } = config;
    const isFireAndForget = !isFunction(callback);

    const finalOptions = mergeDeepRight<IRequestOptions>(DEFAULT_REQUEST_OPTIONS, options || {});

    if (finalOptions.useAuth && this.private_basicAuthHeader) {
      finalOptions.headers = mergeDeepRight(
        {
          Authorization: this.private_basicAuthHeader,
        },
        finalOptions.headers ?? {},
      );
    }

    makeFetchRequest(url, finalOptions)
      .then((response: Response) => {
        if (!isFireAndForget) {
          const finalDataPromise = isRawResponse ? response.text() : response.json();
          finalDataPromise
            .then(data => {
              callback(data, {
                response,
                url,
                options: finalOptions,
              });
            })
            .catch((err: Error) => {
              const finalError = new HttpClientError(RESPONSE_PARSE_ERROR(url), {
                originalError: err,
                status: response.status,
                statusText: response.statusText,
              });
              callback(undefined, {
                response,
                error: finalError,
                url,
                options: finalOptions,
              });
            });
        }
      })
      .catch((error: IHttpClientError) => {
        if (!isFireAndForget) {
          callback(undefined, {
            error,
            url,
            options: finalOptions,
          });
        }
      });
  }

  /**
   * Makes an async request to the given URL
   * @param config Request configuration
   * @deprecated Use `request` instead
   */
  getAsyncData<T>(config: IAsyncRequestConfig<T>) {
    this.request(config);
  }

  /**
   * Set basic authentication header
   */
  setAuthHeader(value: string, noBtoa = false) {
    const authVal = noBtoa ? value : toBase64(`${value}:`);
    this.private_basicAuthHeader = `Basic ${authVal}`;
  }

  /**
   * Clear basic authentication header
   */
  resetAuthHeader() {
    this.private_basicAuthHeader = undefined;
  }
}

export { HttpClient };

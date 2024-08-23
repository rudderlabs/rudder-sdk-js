import { isDefined, isFunction, isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  IAsyncRequestConfig,
  IHttpClient,
  IHttpClientError,
  IRequestOptions,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { clone } from 'ramda';
import { DEFAULT_REQ_TIMEOUT_MS } from '../../constants/timeouts';
import { PAYLOAD_PREP_ERROR } from '../../constants/logMessages';
import { defaultLogger } from '../Logger';
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
  logger?: ILogger;
  basicAuthHeader?: string;

  constructor(logger?: ILogger) {
    this.logger = logger;
  }

  /**
   * Implement requests in a non-blocking way
   */
  request<T>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, isRawResponse } = config;
    const isFireAndForget = !isFunction(callback);

    const finalOptions = mergeDeepRight(DEFAULT_REQUEST_OPTIONS, options || {}) as IRequestOptions;

    if (!finalOptions.sendRawData && isDefined(finalOptions.body)) {
      const payload = stringifyWithoutCircular(finalOptions.body, false, [], this.logger);
      // return and don't process further if the payload could not be stringified
      if (isNull(payload)) {
        if (!isFireAndForget) {
          const error = new HttpClientError(PAYLOAD_PREP_ERROR);
          callback(undefined, {
            error,
            url,
            options: finalOptions,
          });
        }
        return;
      }

      finalOptions.body = payload;
    }

    if (finalOptions.useAuth && this.basicAuthHeader) {
      finalOptions.headers = mergeDeepRight(
        {
          Authorization: this.basicAuthHeader,
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
              const error: IHttpClientError = clone(err);
              error.message = `Failed to parse response data: ${err.message}`;
              error.status = response.status;
              error.statusText = response.statusText;

              callback(undefined, {
                response,
                error,
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

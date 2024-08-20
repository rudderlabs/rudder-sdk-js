import { isFunction, isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  IAsyncRequestConfig,
  IFetchRequestOptions,
  IHttpClient,
  IHttpClientError,
  IRequestOptions,
  IXHRRequestOptions,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import type { TransportType } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { clone } from 'ramda';
import { DEFAULT_REQ_TIMEOUT_MS } from '../../constants/timeouts';
import { PAYLOAD_PREP_ERROR } from '../../constants/logMessages';
import { defaultLogger } from '../Logger';
import { HttpClientError } from './utils';
import { makeXHRRequest } from './xhr';
import { makeFetchRequest } from './fetch';
import { makeBeaconRequest } from './beacon';

const DEFAULT_REQUEST_OPTIONS: Partial<IRequestOptions> = {
  timeout: DEFAULT_REQ_TIMEOUT_MS,
  method: 'GET',
};

// TODO: should we add any debug level loggers?

/**
 * Service to handle data communication with APIs
 */
class HttpClient implements IHttpClient {
  logger?: ILogger;
  basicAuthHeader?: string;
  transportFn: (url: string | URL, options: any) => Promise<Response>;

  constructor(transportType: TransportType, logger?: ILogger) {
    switch (transportType) {
      case 'xhr':
        this.transportFn = makeXHRRequest;
        break;
      case 'beacon':
        this.transportFn = makeBeaconRequest;
        break;
      case 'fetch':
      default:
        this.transportFn = makeFetchRequest;
        break;
    }
    this.logger = logger;
  }

  /**
   * Implement requests in a non-blocking way
   */
  request<T>(config: IAsyncRequestConfig<T>) {
    const { callback, url, options, isRawResponse } = config;
    const isFireAndForget = !isFunction(callback);

    const finalOptions = mergeDeepRight(DEFAULT_REQUEST_OPTIONS, options || {}) as IRequestOptions;

    if (finalOptions.body && !finalOptions.sendRawData) {
      const payload = stringifyWithoutCircular(finalOptions.body, false, [], this.logger);
      // return and don't process further if the payload could not be stringified
      if (isNull(payload)) {
        const err = new HttpClientError(PAYLOAD_PREP_ERROR);
        if (!isFireAndForget) {
          callback(err.responseBody, {
            error: err,
            url,
            options: finalOptions,
          });
        }
        return;
      }

      finalOptions.body = payload;
    }

    if (finalOptions.useAuth) {
      (finalOptions as IXHRRequestOptions | IFetchRequestOptions).headers = mergeDeepRight(
        {
          Authorization: this.basicAuthHeader,
        },
        (finalOptions as IXHRRequestOptions | IFetchRequestOptions).headers ?? {},
      );
    }

    this.transportFn(url, finalOptions)
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
              const finalError = clone(err);
              finalError.message = `Failed to parse response data: ${err.message}`;

              callback(undefined, {
                error: finalError,
                url,
                options: finalOptions,
              });
            });
        }
      })
      .catch((error: IHttpClientError) => {
        if (!isFireAndForget) {
          callback(error.responseBody, {
            error,
            url,
            options: finalOptions,
          });
        }
      });
  }

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

const defaultHttpClient = new HttpClient('fetch', defaultLogger);

export { HttpClient, defaultHttpClient };

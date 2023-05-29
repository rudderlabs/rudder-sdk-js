/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { DEFAULT_XHR_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js/components/utilities/json';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IXHRRequestOptions } from '../types';

const DEFAULT_XHR_REQUEST_OPTIONS: Partial<IXHRRequestOptions> = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
  },
  method: 'GET',
};

/**
 * Utility to create request configuration based on default options
 */
const createXhrRequestOptions = (
  url: string,
  options?: Partial<IXHRRequestOptions>,
  basicAuthHeader?: string,
): IXHRRequestOptions => {
  const requestOptions: IXHRRequestOptions = mergeDeepRight(
    DEFAULT_XHR_REQUEST_OPTIONS,
    options || {},
  );

  if (basicAuthHeader) {
    requestOptions.headers = mergeDeepRight(requestOptions.headers, {
      Authorization: basicAuthHeader,
    });
  }

  requestOptions.url = url;

  return requestOptions;
};

/**
 * Utility implementation of XHR, fetch cannot be used as it requires explicit
 * origin allowed values and not wildcard for CORS requests with credentials and
 * this is not supported by our sourceConfig API
 */
const xhrRequest = (
  options: IXHRRequestOptions,
  timeout = DEFAULT_XHR_TIMEOUT,
  logger?: ILogger,
): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xhrReject = (e?: ProgressEvent) => {
      reject({
        error: new Error(
          `Request failed with status: ${xhr.status}, ${xhr.statusText} for URL: ${options.url}`,
        ),
        xhr,
        options,
      });
    };
    const xhrError = (e?: ProgressEvent) => {
      reject({
        error: new Error(
          `Request failed due to timeout or no connection, ${e ? e.type : ''} for URL: ${
            options.url
          }`,
        ),
        xhr,
        options,
      });
    };

    xhr.ontimeout = xhrError;
    xhr.onerror = xhrError;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(xhr.responseText);
      } else {
        xhrReject();
      }
    };

    xhr.open(options.method, options.url);
    // The timeout property may be set only in the time interval between a call to the open method
    // and the first call to the send method in legacy browsers
    xhr.timeout = timeout;

    Object.keys(options.headers).forEach(headerName => {
      if (options.headers[headerName]) {
        xhr.setRequestHeader(headerName, options.headers[headerName] as string);
      }
    });

    let payload;
    if (options.sendRawData === true) {
      payload = options.data;
    } else {
      try {
        payload = stringifyWithoutCircular(options.data, false, logger);
      } catch (err) {
        reject({
          error: new Error(
            `Request data parsing failed for URL: ${options.url}, ${(err as Error).message}`,
          ),
          xhr,
          options,
        });
      }
    }

    try {
      xhr.send(payload);
    } catch (err) {
      reject({
        error: new Error(`Request failed for URL: ${options.url}, ${(err as Error).message}`),
        xhr,
        options,
      });
    }
  });

export { createXhrRequestOptions, xhrRequest, DEFAULT_XHR_REQUEST_OPTIONS };

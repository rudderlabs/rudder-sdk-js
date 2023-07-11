/* eslint-disable prefer-promise-reject-errors */
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { DEFAULT_XHR_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js/constants/errors';
import { isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import { IXHRRequestOptions } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

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
    let payload;
    if (options.sendRawData === true) {
      payload = options.data;
    } else {
      payload = stringifyWithoutCircular(options.data, false, [], logger);
      if (isNull(payload)) {
        reject({
          error: new Error(`Failed to prepare data for the request.`),
          undefined,
          options,
        });
        // return and don't process further if the payload could not be stringified
        return;
      }
    }

    const xhr = new XMLHttpRequest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const xhrReject = (e?: ProgressEvent) => {
      reject({
        error: new Error(
          `${FAILED_REQUEST_ERR_MSG_PREFIX} with status: ${xhr.status}, ${xhr.statusText} for URL: ${options.url}`,
        ),
        xhr,
        options,
      });
    };
    const xhrError = (e?: ProgressEvent) => {
      reject({
        error: new Error(
          `${FAILED_REQUEST_ERR_MSG_PREFIX} due to timeout or no connection, ${
            e ? e.type : ''
          } for URL: ${options.url}`,
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

    try {
      xhr.send(payload);
    } catch (err) {
      reject({
        error: new Error(
          `${FAILED_REQUEST_ERR_MSG_PREFIX} for URL: ${options.url}, ${(err as Error).message}`,
        ),
        xhr,
        options,
      });
    }
  });

export { createXhrRequestOptions, xhrRequest, DEFAULT_XHR_REQUEST_OPTIONS };

/* eslint-disable prefer-promise-reject-errors */
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { stringifyData } from '@rudderstack/analytics-js-common/utilities/json';
import { isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import type {
  IXHRRequestOptions,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js-common/constants/errors';
import { DEFAULT_XHR_TIMEOUT_MS } from '../../../constants/timeouts';
import {
  XHR_PAYLOAD_PREP_ERROR,
  XHR_DELIVERY_ERROR,
  XHR_REQUEST_ERROR,
  XHR_SEND_ERROR,
} from '../../../constants/logMessages';

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
  timeout = DEFAULT_XHR_TIMEOUT_MS,
): Promise<ResponseDetails> =>
  new Promise((resolve, reject) => {
    let payload;
    if (options.sendRawData === true) {
      payload = options.data;
    } else {
      payload = stringifyData(options.data);
      if (isNull(payload)) {
        reject({
          error: new Error(XHR_PAYLOAD_PREP_ERROR),
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
          XHR_DELIVERY_ERROR(
            FAILED_REQUEST_ERR_MSG_PREFIX,
            xhr.status,
            xhr.statusText,
            options.url,
          ),
        ),
        xhr,
        options,
      });
    };
    const xhrError = (e?: ProgressEvent) => {
      reject({
        error: new Error(XHR_REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, e, options.url)),
        xhr,
        options,
      });
    };

    xhr.ontimeout = xhrError;
    xhr.onerror = xhrError;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve({
          response: xhr.responseText,
          xhr,
          options,
        });
      } else {
        xhrReject();
      }
    };

    xhr.open(options.method, options.url, true);
    if (options.withCredentials === true) {
      xhr.withCredentials = true;
    }
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
        error: getMutatedError(err, XHR_SEND_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, options.url)),
        xhr,
        options,
      });
    }
  });

export { createXhrRequestOptions, xhrRequest, DEFAULT_XHR_REQUEST_OPTIONS };

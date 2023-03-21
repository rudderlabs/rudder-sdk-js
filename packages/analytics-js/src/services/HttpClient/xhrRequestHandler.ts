import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { DEFAULT_XHR_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';

export interface IXHRRequestOptions {
  method: HTTPClientMethod;
  url: string;
  headers: Record<string, string>;
  data?: XMLHttpRequestBodyInit;
}

export type HTTPClientMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK';

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
): Promise<string | undefined> =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const xhrReject = (e?: ProgressEvent) => {
      reject(
        new Error(
          `Request failed with status: ${xhr.status}, ${xhr.statusText} for url: ${options.url}`,
        ),
      );
    };
    const xhrError = (e?: ProgressEvent) => {
      reject(
        new Error(
          `Request failed due to timeout or no connection, ${e ? e.type : ''} for url: ${
            options.url
          }`,
        ),
      );
    };

    xhr.timeout = timeout;
    xhr.ontimeout = xhrError;
    xhr.onerror = xhrError;

    // TODO: why we used in v1.1 xhrModule
    //  xhr.status === 429 || (xhr.status >= 500 && xhr.status < 600) instead for < 400????
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(xhr.responseText);
      } else {
        xhrReject();
      }
    };

    xhr.open(options.method, options.url);

    Object.keys(options.headers).forEach(headerName => {
      xhr.setRequestHeader(headerName, options.headers[headerName]);
    });

    try {
      const jsonData = JSON.stringify(options.data);
      xhr.send(jsonData);
    } catch (err) {
      reject(
        new Error(`Request data parsing failed for url: ${options.url}, ${(err as Error).message}`),
      );
    }
  });

export { createXhrRequestOptions, xhrRequest, DEFAULT_XHR_REQUEST_OPTIONS };

import type { IFetchRequestOptions } from '@rudderstack/analytics-js-common/types/HttpClient';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '@rudderstack/analytics-js-common/constants/errors';
import { clone } from 'ramda';
import { DELIVERY_ERROR, REQUEST_ERROR } from '../../../constants/logMessages';
import { HttpClientError } from '../utils';

const makeFetchRequest = (url: string | URL, options: IFetchRequestOptions): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  const fetchOptions: RequestInit = { signal, ...options };

  const fetchPromise = (globalThis as typeof window)
    .fetch(url, fetchOptions)
    .then(response => {
      if (!response.ok) {
        return response.text().then(body => {
          throw new HttpClientError(
            DELIVERY_ERROR(
              FAILED_REQUEST_ERR_MSG_PREFIX,
              response.status,
              response.statusText,
              url,
            ),
            response.status,
            response.statusText,
            body,
          );
        });
      }
      return response;
    })
    .catch(err => {
      if (err.name === 'HttpClientError') {
        throw err;
      }

      const clonedErr = clone(err);
      clonedErr.message = `${REQUEST_ERROR(FAILED_REQUEST_ERR_MSG_PREFIX, url, options.timeout as number)}: ${err.message}`;

      throw clonedErr;
    });

  // Implement the timeout logic
  if (options.timeout) {
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    return fetchPromise.finally(() => clearTimeout(timeoutId));
  }
  return fetchPromise;
};

export { makeFetchRequest };

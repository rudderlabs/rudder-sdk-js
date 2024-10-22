import type { IFetchRequestOptions } from '@rudderstack/analytics-js-common/types/HttpClient';
import { DELIVERY_ERROR, REQUEST_ERROR } from '../../../constants/logMessages';
import { HttpClientError } from '../HttpClientError';

const makeFetchRequest = (url: string | URL, options: IFetchRequestOptions): Promise<Response> => {
  const defaultOptions: RequestInit = {
    priority: 'high',
  };

  // Implement the timeout logic
  let timeoutId: number;
  if (options.timeout) {
    // Configure abort controller to abort the request if it exceeds the timeout
    const controller = new AbortController();
    const { signal } = controller;
    defaultOptions.signal = signal;

    timeoutId = (globalThis as typeof window).setTimeout(() => controller.abort(), options.timeout);
  }

  // Determine the final options to be passed to the fetch API
  const fetchOptions: RequestInit = { ...defaultOptions, ...options };

  const fetchPromise = (globalThis as typeof window)
    .fetch(url, fetchOptions)
    .then(response => {
      const { status, statusText, ok } = response;
      if (!ok) {
        return response.text().then(body => {
          throw new HttpClientError(DELIVERY_ERROR(status, statusText, url), {
            status,
            statusText,
            responseBody: body,
          });
        });
      }
      return response;
    })
    .catch(err => {
      if (err instanceof HttpClientError) {
        throw err;
      }

      throw new HttpClientError(REQUEST_ERROR(url, options.timeout as number), {
        originalError: err,
      });
    });

  // Implement the timeout logic
  if (options.timeout) {
    return fetchPromise.finally(() => clearTimeout(timeoutId));
  }
  return fetchPromise;
};

export { makeFetchRequest };

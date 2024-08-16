import type { IBeaconRequestOptions } from '@rudderstack/analytics-js-common/types/HttpClient';
import { HttpClientError } from '../utils';

const makeBeaconRequest = (
  url: string | URL,
  options: IBeaconRequestOptions,
): Promise<Response> => {
  const success = navigator.sendBeacon(url, options.body);
  if (!success) {
    return Promise.reject(new HttpClientError('Beacon request failed'));
  }

  return Promise.resolve(new Response(null, { status: 204 }));
};

export { makeBeaconRequest };

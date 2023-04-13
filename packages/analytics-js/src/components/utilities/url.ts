import { Nullable } from '@rudderstack/analytics-js/types';

/**
 * Removes trailing slash from url
 * @param url
 * @returns url
 */
const removeTrailingSlashes = (url: string | null): Nullable<string> =>
  url && url.endsWith('/') ? removeTrailingSlashes(url.substring(0, url.length - 1)) : url;

/**
 * Checks if provided url is valid or not
 * @param url
 * @returns true if `url` is valid and false otherwise
 */
const isValidUrl = (url: string): boolean => {
  try {
    const validUrl = new URL(url); // TODO: add URL in the polyfill list
    return true;
  } catch (err) {
    return false;
  }
};

export { removeTrailingSlashes, isValidUrl };

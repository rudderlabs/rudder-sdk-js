import { URL_PATTERN } from '../constants/urls';
import type { Nullable } from '../types/Nullable';
import { isFunction, isString } from './checks';

const removeDuplicateSlashes = (str: string): string => str.replace(/\/{2,}/g, '/');

/**
 * Removes trailing slash from url
 * @param url
 * @returns url
 */
const removeTrailingSlashes = (url: Nullable<string> | undefined): Nullable<string> | undefined =>
  url?.endsWith('/') ? removeTrailingSlashes(url.substring(0, url.length - 1)) : url;

/**
 * Checks if provided url is valid or not
 * @param url
 * @returns true if `url` is valid and false otherwise
 */
const isValidURL = (url: string | undefined): url is string => {
  if (!isString(url)) {
    return false;
  }

  try {
    // If URL is supported by the browser, we can use it to validate the URL
    // Otherwise, we can at least check if the URL matches the pattern
    if (isFunction(globalThis.URL)) {
      // eslint-disable-next-line no-new
      new URL(url);
    }
    return URL_PATTERN.test(url);
  } catch {
    return false;
  }
};

export { removeDuplicateSlashes, isValidURL, removeTrailingSlashes };

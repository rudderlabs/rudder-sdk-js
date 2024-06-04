import { URL_PATTERN } from '../constants/urls';
import { isFunction, isString } from './checks';

const removeDuplicateSlashes = (str: string): string => str.replace(/\/{2,}/g, '/');

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
  } catch (e) {
    return false;
  }
};

export { removeDuplicateSlashes, isValidURL };

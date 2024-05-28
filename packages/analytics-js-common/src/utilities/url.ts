import { URL_PATTERN } from '../constants/urls';

const removeDuplicateSlashes = (str: string): string => str.replace(/\/{2,}/g, '/');

/**
 * Checks if provided url is valid or not
 * @param url
 * @returns true if `url` is valid and false otherwise
 */
const isValidURL = (url: any): url is string => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return URL_PATTERN.test(url);
  } catch (e) {
    return false;
  }
};

export { removeDuplicateSlashes, isValidURL };

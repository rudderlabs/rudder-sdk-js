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

/**
 * Parses a URL without the URL constructor, which a page can shadow with a
 * global of its own and which is unavailable on legacy JS engines until the
 * polyfills load.
 */
const legacyParseUrl = (url: string): { origin: string; pathname: string } => {
  const anchor = document.createElement('a');
  anchor.href = url;
  return { origin: `${anchor.protocol}//${anchor.host}`, pathname: anchor.pathname };
};

/**
 * Extracts the origin and the pathname from the provided url
 * @param url
 * @returns the origin and the pathname of `url`
 */
const getUrlOriginAndPathname = (url: string): { origin: string; pathname: string } => {
  // A page can replace the global with a callable of its own, which `isFunction`
  // cannot tell apart from the native parser. Only a value that parses without
  // throwing and yields both an origin and a pathname is usable here.
  if (isFunction(globalThis.URL)) {
    try {
      const parsedUrl = new URL(url);
      if (isString(parsedUrl.origin) && isString(parsedUrl.pathname)) {
        return { origin: parsedUrl.origin, pathname: parsedUrl.pathname };
      }
    } catch (e) {
      // Fall back to the anchor element below
    }
  }

  return legacyParseUrl(url);
};

export { removeDuplicateSlashes, isValidURL, getUrlOriginAndPathname };

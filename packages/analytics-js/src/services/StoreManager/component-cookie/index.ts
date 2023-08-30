import { isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { CookieOptions } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { COOKIE_DATA_ENCODING_ERROR } from '@rudderstack/analytics-js/constants/logMessages';

/**
 * Encode.
 */
const encode = (value: any, logger?: ILogger): string | undefined => {
  try {
    return encodeURIComponent(value);
  } catch (err) {
    logger?.error(COOKIE_DATA_ENCODING_ERROR, err);
    return undefined;
  }
};

/**
 * Decode
 */
const decode = (value: string): string | undefined => {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    // Do nothing as non-RS SDK cookies may not be URI encoded
    return undefined;
  }
};

/**
 * Parse cookie `str`
 */
const parse = (str: string): Record<string, string | undefined> => {
  const obj: Record<string, any> = {};
  const pairs = str.split(/\s*;\s*/);
  let pair;

  if (!pairs[0]) {
    return obj;
  }

  pairs.forEach(pairItem => {
    pair = pairItem.split('=');
    obj[decode(pair[0]) as string] = decode(pair[1]);
  });

  return obj;
};

/**
 * Set cookie `name` to `value`
 */
const set = (
  name?: string,
  value?: Nullable<string | number>,
  optionsConfig?: CookieOptions,
  logger?: ILogger,
) => {
  const options: CookieOptions = { ...optionsConfig } || {};
  let cookieString = `${encode(name, logger)}=${encode(value, logger)}`;

  if (isNull(value)) {
    options.maxage = -1;
  }

  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage);
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.samesite) {
    cookieString += `; samesite=${options.samesite}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  globalThis.document.cookie = cookieString;
};

/**
 * Return all cookies
 */
const all = (): Record<string, string | undefined> => {
  const cookieStringValue = globalThis.document.cookie;
  return parse(cookieStringValue);
};

/**
 * Get cookie `name`
 */

const get = (name: string): string => (all() as any)[name];

/**
 * Set or get cookie `name` with `value` and `options` object
 */
// eslint-disable-next-line func-names
const cookie = function (
  name?: string,
  value?: Nullable<string | number>,
  options?: CookieOptions,
  logger?: ILogger,
): void | any {
  switch (arguments.length) {
    case 4:
    case 3:
    case 2:
      return set(name, value, options, logger);
    case 1:
      if (name) {
        return get(name);
      }
      return all();
    default:
      return all();
  }
};

export { cookie };

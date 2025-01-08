import { isNull } from '../utilities/checks';
import type { Nullable } from '../types/Nullable';
import type { CookieOptions } from '../types/Storage';
import type { ILogger } from '../types/Logger';
import { COOKIE_DATA_ENCODING_ERROR } from '../constants/logMessages';

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
  } catch {
    // Do nothing as non-RS SDK cookies may not be URI encoded
    return undefined;
  }
};

/**
 * Parse cookie `str`
 */
const parse = (str: string): Record<string, string | undefined> => {
  const obj: Record<string, any> = {};
  const pairs = str.split(';').map(pairItem => pairItem.trim());
  let pair;

  if (!pairs[0]) {
    return obj;
  }

  // TODO: Decode only the cookies that are needed by the SDK
  pairs.forEach(pairItem => {
    pair = pairItem.split('=');
    const keyName = pair[0] ? decode(pair[0]) : undefined;

    if (keyName) {
      obj[keyName] = pair[1] ? decode(pair[1]) : undefined;
    }
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
  const options: CookieOptions = { ...(optionsConfig || {}) };
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
): any {
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

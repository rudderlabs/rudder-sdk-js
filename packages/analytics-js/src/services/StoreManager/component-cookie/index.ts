import { Nullable } from '@rudderstack/analytics-js/types';
import { isNull } from '@rudderstack/analytics-js/components/utilities/checks';

export type CookieOptions = {
  maxage?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
};

/**
 * Encode.
 */
const encode = (value: any): string | undefined => {
  try {
    return encodeURIComponent(value);
  } catch (e) {
    // TODO: should it throw error?
    console.error('error `encode(%o)` - %o', value, e);
    return undefined;
  }
};

/**
 * Decode
 */
const decode = (value: string): Nullable<string> => {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    // TODO: should it throw error?
    console.error('error `decode(%o)` - %o', value, e);
    return null;
  }
};

/**
 * Parse cookie `str`
 */
const parse = (str: string): Record<string, Nullable<string>> => {
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
const set = (name?: string, value?: Nullable<string | number>, optionsConfig?: CookieOptions) => {
  const options: CookieOptions = { ...optionsConfig } || {};
  let cookieString = `${encode(name)}=${encode(value)}`;

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

  if (options.secure) {
    cookieString += `; secure`;
  }

  window.document.cookie = cookieString;
};

/**
 * Return all cookies
 */
const all = (): Record<string, Nullable<string>> => {
  let cookieStringValue;

  try {
    cookieStringValue = window.document.cookie;
  } catch (err) {
    console.error((err as Error).stack || err);
    return {} as Record<string, Nullable<string>>;
  }

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
): void | any {
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
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

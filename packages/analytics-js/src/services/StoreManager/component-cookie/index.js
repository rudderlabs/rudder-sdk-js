import { isNull } from '@rudderstack/analytics-js-common/utilities/checks';
import { COOKIE_DATA_ENCODING_ERROR } from '../../../constants/logMessages';
/**
 * Encode.
 */
const encode = (value, logger) => {
  try {
    return encodeURIComponent(value);
  } catch (err) {
    logger === null || logger === void 0 ? void 0 : logger.error(COOKIE_DATA_ENCODING_ERROR, err);
    return undefined;
  }
};
/**
 * Decode
 */
const decode = value => {
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
const parse = str => {
  const obj = {};
  const pairs = str.split(/\s*;\s*/);
  let pair;
  if (!pairs[0]) {
    return obj;
  }
  // TODO: Decode only the cookies that are needed by the SDK
  pairs.forEach(pairItem => {
    pair = pairItem.split('=');
    const keyName = decode(pair[0]);
    if (keyName) {
      obj[keyName] = decode(pair[1]);
    }
  });
  return obj;
};
/**
 * Set cookie `name` to `value`
 */
const set = (name, value, optionsConfig, logger) => {
  const options = { ...optionsConfig } || {};
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
const all = () => {
  const cookieStringValue = globalThis.document.cookie;
  return parse(cookieStringValue);
};
/**
 * Get cookie `name`
 */
const get = name => all()[name];
/**
 * Set or get cookie `name` with `value` and `options` object
 */
// eslint-disable-next-line func-names
const cookie = function (name, value, options, logger) {
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

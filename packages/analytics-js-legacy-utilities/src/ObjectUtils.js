import { logger } from './logUtil';
import { mergeDeepWith, clone } from 'ramda';

/**
 * A function to check given value is undefined
 * @param value input value
 * @returns boolean
 */
const isUndefined = value => typeof value === 'undefined';

/**
 * A function to check given value is defined
 * @param value input value
 * @returns boolean
 */
const isDefined = value => !isUndefined(value);

const getCircularReplacer = excludeNull => {
  const ancestors = [];

  return function (key, value) {
    if (excludeNull && (value === null || value === undefined)) {
      return undefined;
    }

    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // `this` is the object that value is contained in, i.e., its direct parent.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
      logger.debug(`Circular Reference detected for key: ${key}`);
      return '[Circular Reference]';
    }

    ancestors.push(value);
    return value;
  };
};

const stringifyWithoutCircularV1 = (obj, excludeNull) => {
  try {
    return JSON.stringify(obj, getCircularReplacer(excludeNull));
  } catch (err) {
    logger.warn(`Failed to convert the value to a JSON string.`);
    return null;
  }
};

const isInstanceOfEvent = value => typeof value === 'object' && value !== null && 'target' in value;

/**
 * Returns true for empty object {}
 * @param {*} obj
 * @returns
 */
const isEmptyObject = obj => {
  if (!obj) {
    logger.warn('input is undefined or null');
    return true;
  }
  return Object.keys(obj).length === 0;
};

const isObject = value => typeof value === 'object';

/**
 * A function to check given value is null or not
 * @param value input value
 * @returns boolean
 */
const isNull = value => value === null;

/**
 * Checks if the input is an object literal or built-in object type and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectAndNotNull = value => !isNull(value) && isObject(value) && !Array.isArray(value);

/**
 * Merges two arrays deeply, right-to-left
 * In the case of conflicts, the right array's values replace the left array's values in the
 * same index position
 * @param leftValue - The left array
 * @param rightValue - The right array
 * @returns The merged array
 */
const mergeDeepRightObjectArrays = (leftValue, rightValue) => {
  if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return clone(rightValue);
  }

  const mergedArray = clone(leftValue);
  rightValue.forEach((value, index) => {
    mergedArray[index] =
      Array.isArray(value) || isObjectAndNotNull(value)
        ? mergeDeepRight(mergedArray[index], value)
        : value;
  });
  return mergedArray;
};

/**
 * Merges two objects deeply, right-to-left.
 * In the case of conflicts, the right object's values take precedence.
 * For arrays, the right array's values replace the left array's values in the
 * same index position keeping the remaining left array's values in the resultant array.
 * @param leftObject - The left object
 * @param rightObject - The right object
 * @returns The merged object
 */
const mergeDeepRight = (leftObject, rightObject) =>
  mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

/**
 * A function to check given value is a string
 * @param value input value
 * @returns boolean
 */
const isString = value => typeof value === 'string';

/**
 * A function to check given value is null or undefined
 * @param value input value
 * @returns boolean
 */
const isNullOrUndefined = value => isNull(value) || isUndefined(value);

/**
 * A function to check given value is defined and not null
 * @param value input value
 * @returns boolean
 */
const isDefinedAndNotNull = value => !isNullOrUndefined(value);

/**
 * Checks if the input is an object literal and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectLiteralAndNotNull = value =>
  !isNull(value) && Object.prototype.toString.call(value) === '[object Object]';

/**
 Checks if the input is a non-empty object literal type and not undefined or null
 * @param value input any
 * @returns boolean
 */
const isNonEmptyObject = value => isObjectLiteralAndNotNull(value) && Object.keys(value).length > 0;

/**
 * Determines if the SDK is running inside a chrome extension
 * @returns boolean
 */
const isSDKRunningInChromeExtension = () => !!window.chrome?.runtime?.id;

/**
 * To get the timezone of the user
 *
 * @returns string
 */
const getTimezone = () => {
  // Not susceptible to super-linear backtracking
  // eslint-disable-next-line sonarjs/slow-regex
  const timezone = /([A-Z]+[+-]\d+)/.exec(new Date().toString());
  return timezone?.[1] ? timezone[1] : 'NA';
};

export {
  getCircularReplacer,
  stringifyWithoutCircularV1,
  isInstanceOfEvent,
  isEmptyObject,
  isDefined,
  isNull,
  isObjectAndNotNull,
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  isString,
  isDefinedAndNotNull,
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
  isSDKRunningInChromeExtension,
  getTimezone,
  isNullOrUndefined,
};

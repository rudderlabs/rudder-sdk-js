import { clone, mergeDeepWith, path, pickBy } from 'ramda';
import { isBigInt, isDefined, isDefinedAndNotNull, isNull } from './checks';
import type { ILogger } from '../types/Logger';
import { BAD_DATA_WARNING } from '../constants/logMessages';

const getValueByPath = (obj: Record<string, any>, keyPath: string): any => {
  const pathParts = keyPath.split('.');
  return path(pathParts, obj);
};

const hasValueByPath = (obj: Record<string, any>, path: string): boolean =>
  Boolean(getValueByPath(obj, path));

const isObject = (value: any): value is object => typeof value === 'object';

/**
 * Checks if the input is an object literal or built-in object type and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectAndNotNull = (value: any): value is object =>
  !isNull(value) && isObject(value) && !Array.isArray(value);

/**
 * Checks if the input is an object literal and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectLiteralAndNotNull = <T>(value?: T): value is T =>
  !isNull(value) && Object.prototype.toString.call(value) === '[object Object]';

const mergeDeepRightObjectArrays = (
  leftValue: any | any[],
  rightValue: any | any[],
): any | any[] => {
  if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return clone(rightValue);
  }

  const mergedArray = clone(leftValue);
  rightValue.forEach((value, index) => {
    mergedArray[index] =
      Array.isArray(value) || isObjectAndNotNull(value)
        ? // eslint-disable-next-line @typescript-eslint/no-use-before-define
          mergeDeepRight(mergedArray[index], value)
        : value;
  });
  return mergedArray;
};

const mergeDeepRight = <T = Record<string, any>>(
  leftObject: Record<string, any>,
  rightObject: Record<string, any>,
): T => mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

/**
 Checks if the input is a non-empty object literal type and not undefined or null
 * @param value input any
 * @returns boolean
 */
const isNonEmptyObject = <T>(value?: T): value is T =>
  isObjectLiteralAndNotNull(value) && Object.keys(value as any).length > 0;

/**
 * A utility to recursively remove undefined values from an object
 * @param obj input object
 * @returns a new object
 */
const removeUndefinedValues = <T = Record<string, any>>(obj: T): T => {
  const result = pickBy(isDefined, obj) as Record<string, any>;
  Object.keys(result).forEach(key => {
    const value = result[key];
    if (isObjectLiteralAndNotNull(value)) {
      result[key] = removeUndefinedValues(value);
    }
  });

  return result as T;
};

/**
 * A utility to recursively remove undefined and null values from an object
 * @param obj input object
 * @returns a new object
 */
const removeUndefinedAndNullValues = <T = Record<string, any>>(obj: T): T => {
  const result = pickBy(isDefinedAndNotNull, obj) as Record<string, any>;
  Object.keys(result).forEach(key => {
    const value = result[key];
    if (isObjectLiteralAndNotNull(value)) {
      result[key] = removeUndefinedAndNullValues(value);
    }
  });

  return result as T;
};

/**
 * A utility to get all the values from an object
 * @param obj Input object
 * @returns an array of values from the input object
 */
const getObjectValues = <T = Record<string, any>>(obj: T): any[] => {
  const result: any[] = [];
  Object.keys(obj as Record<string, any>).forEach(key => {
    result.push((obj as Record<string, any>)[key]);
  });

  return result;
};

const JSON_UTIL = 'JSON';

const getReplacer = (logger?: ILogger): ((key: string, value: any) => any) => {
  const ancestors: any[] = []; // Array to track ancestor objects

  // Using a regular function to use `this` for the parent context
  return function replacer(key, value): any {
    if (isBigInt(value)) {
      logger?.warn(BAD_DATA_WARNING(JSON_UTIL, key));
      return '[BigInt]'; // Replace BigInt values
    }

    // `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop(); // Remove ancestors that are no longer part of the chain
    }

    // Check for circular references (if the value is already in the ancestors)
    if (ancestors.includes(value)) {
      logger?.warn(BAD_DATA_WARNING(JSON_UTIL, key));
      return '[Circular Reference]';
    }

    // Add current value to ancestors
    ancestors.push(value);

    return value;
  };
};

const traverseWithThis = (obj: any, replacer: (key: string, value: any) => any): any => {
  // Create a new result object or array
  const result = Array.isArray(obj) ? [] : {};

  // Traverse object properties or array elements
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Recursively apply the replacer and traversal
      const sanitizedValue = replacer.call(obj, key, value);

      // If the value is an object or array, continue traversal
      if (isObjectLiteralAndNotNull(sanitizedValue) || Array.isArray(sanitizedValue)) {
        (result as any)[key] = traverseWithThis(sanitizedValue, replacer);
      } else {
        (result as any)[key] = sanitizedValue;
      }
    }
  }

  return result;
};

/**
 * Recursively traverses an object similar to JSON.stringify,
 * sanitizing BigInts and circular references
 * @param value Input object
 * @param logger Logger instance
 * @returns Sanitized value
 */
const getSanitizedValue = <T = any>(value: T, logger?: ILogger): T => {
  const replacer = getReplacer(logger);

  // This is needed for registering the first ancestor
  const newValue = replacer.call(value, '', value);

  if (isObjectLiteralAndNotNull(value) || Array.isArray(value)) {
    return traverseWithThis(value, replacer);
  }
  return newValue;
};

export {
  getValueByPath,
  hasValueByPath,
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  isObjectAndNotNull,
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
  removeUndefinedValues,
  removeUndefinedAndNullValues,
  getObjectValues,
  isObject,
  getSanitizedValue,
};

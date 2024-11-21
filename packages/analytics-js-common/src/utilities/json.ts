import type { ILogger } from '../types/Logger';
import type { Nullable } from '../types/Nullable';
import { isBigInt, isNull, isNullOrUndefined } from './checks';
import {
  BAD_DATA_WARNING,
  CIRCULAR_REFERENCE_WARNING,
  JSON_STRINGIFY_WARNING,
} from '../constants/logMessages';
import { isObjectLiteralAndNotNull } from './object';

const JSON_STRINGIFY = 'JSONStringify';

const getCircularReplacer = (
  excludeNull?: boolean,
  excludeKeys?: string[],
  logger?: ILogger,
): ((key: string, value: any) => any) => {
  const ancestors: any[] = [];

  // Here we do not want to use arrow function to use "this" in function context
  // eslint-disable-next-line func-names
  return function (key, value): any {
    if (excludeKeys?.includes(key)) {
      return undefined;
    }

    if (excludeNull && isNullOrUndefined(value)) {
      return undefined;
    }

    if (typeof value !== 'object' || isNull(value)) {
      return value;
    }

    // `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
      logger?.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY, key));
      return '[Circular Reference]';
    }

    ancestors.push(value);
    return value;
  };
};

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} value input
 * @param {boolean} excludeNull if it should exclude nul or not
 * @param {function} logger optional logger methods for warning
 * @returns string
 */
const stringifyWithoutCircular = <T = Record<string, any> | any[] | number | string>(
  value?: Nullable<T>,
  excludeNull?: boolean,
  excludeKeys?: string[],
  logger?: ILogger,
): Nullable<string> => {
  try {
    return JSON.stringify(value, getCircularReplacer(excludeNull, excludeKeys, logger));
  } catch (err) {
    logger?.warn(JSON_STRINGIFY_WARNING, err);
    return null;
  }
};

const JSON_UTIL = 'JSON';

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} value input value
 * @param {boolean} excludeNull optional flag to exclude null values
 * @param {string[]} excludeKeys optional array of keys to exclude
 * @returns string
 */
const stringifyData = <T = Record<string, any> | any[] | number | string>(
  value?: Nullable<T>,
  excludeNull: boolean = true,
  excludeKeys: string[] = [],
): string =>
  JSON.stringify(value, (key: string, value: any): any => {
    if ((excludeNull && isNull(value)) || excludeKeys.includes(key)) {
      return undefined;
    }
    return value;
  });

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
  return newValue;
};

export { stringifyWithoutCircular, getSanitizedValue, stringifyData };

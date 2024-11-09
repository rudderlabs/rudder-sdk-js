import { clone, mergeDeepWith, path, pickBy } from 'ramda';
import { isDefined, isDefinedAndNotNull, isNull } from './checks';

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

const mergeDeepRightObjectArrays = (leftValue: any, rightValue: any): any => {
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
 * Normalizes an object by removing undefined and null values.
 * @param val - The value to normalize
 * @returns The normalized object, or undefined if input is not a non-empty object
 * @example
 * getNormalizedObjectValue({ a: 1, b: null, c: undefined }) // returns { a: 1 }
 * getNormalizedObjectValue({}) // returns undefined
 * getNormalizedObjectValue(null) // returns undefined
 */
const getNormalizedObjectValue = (val: any): any => {
  if (!isNonEmptyObject(val)) {
    return undefined;
  }

  return removeUndefinedAndNullValues(val);
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
  getNormalizedObjectValue,
  isObject,
};

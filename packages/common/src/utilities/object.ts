import { clone, mergeDeepWith, path } from 'ramda';
import { isNull } from './checks';

const getValueByPath = (obj: Record<string, any>, keyPath: string): any => {
  const pathParts = keyPath.split('.');
  return path(pathParts, obj);
};

const hasValueByPath = (obj: Record<string, any>, path: string): boolean =>
  Boolean(getValueByPath(obj, path));

/**
 * Checks if the input is an object literal or built-in object type and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectAndNotNull = (value: any): boolean =>
  !isNull(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Checks if the input is an object literal and not null
 * @param value Input value
 * @returns true if the input is an object and not null
 */
const isObjectLiteralAndNotNull = (value: any): boolean =>
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
const isNonEmptyObject = (value?: any) =>
  isObjectLiteralAndNotNull(value) && Object.keys(value).length > 0;

export {
  getValueByPath,
  hasValueByPath,
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  isObjectAndNotNull,
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
};

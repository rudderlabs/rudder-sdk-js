import * as R from 'ramda';

const mergeDeepRightObjectArrays = (leftValue, rightValue) => {
  if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return R.clone(rightValue);
  }

  const mergedArray = R.clone(leftValue);
  rightValue.forEach((value, index) => {
    // eslint-disable-next-line no-use-before-define
    mergedArray[index] = mergeDeepRight(mergedArray[index], value);
  });

  return mergedArray;
};

const mergeDeepRight = (leftObject, rightObject) =>
  R.mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

const isObjectLiteralAndNotNull = (value) =>
  value !== null && Object.prototype.toString.call(value) === '[object Object]';

const stringifyWithoutCircular = (obj, excludeNull) => {
  const cache = new Set();

  return JSON.stringify(obj, (key, value) => {
    if (excludeNull && (value === null || value === undefined)) {
      return undefined;
    }

    if (isObjectLiteralAndNotNull(value)) {
      if (cache.has(value)) {
        return '[Circular Reference]';
      }

      // Add root level object only to the cache to detect circular references
      if (cache.size === 0) {
        cache.add(value);
      }
    }

    return value;
  });
};

const isInstanceOfEvent = (value) =>
  typeof value === 'object' && value !== null && 'target' in value;

export {
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  stringifyWithoutCircular,
  isInstanceOfEvent,
  isObjectLiteralAndNotNull,
};

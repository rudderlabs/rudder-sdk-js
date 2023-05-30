import * as R from 'ramda';

/**
 * Checks if the input is an object and not null
 * @param val Input value
 * @returns true if the input is an object and not null
 */
const isObjectAndNotNull = val => typeof val === 'object' && !Array.isArray(val) && val !== null;

const mergeDeepRightObjectArrays = (leftValue, rightValue) => {
  if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return R.clone(rightValue);
  }

  const mergedArray = R.clone(leftValue);
  rightValue.forEach((value, index) => {
    mergedArray[index] =
      Array.isArray(value) || isObjectAndNotNull(value)
        ? // eslint-disable-next-line @typescript-eslint/no-use-before-define
          mergeDeepRight(mergedArray[index], value)
        : value;
  });

  return mergedArray;
};

const mergeDeepRight = (leftObject, rightObject) =>
  R.mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

const isObjectLiteralAndNotNull = value =>
  value !== null && Object.prototype.toString.call(value) === '[object Object]';

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
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
      return '[Circular Reference]';
    }

    ancestors.push(value);
    return value;
  };
};

const stringifyWithoutCircular = (obj, excludeNull) =>
  JSON.stringify(obj, getCircularReplacer(excludeNull));

const isInstanceOfEvent = value => typeof value === 'object' && value !== null && 'target' in value;

export {
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  getCircularReplacer,
  stringifyWithoutCircular,
  isInstanceOfEvent,
  isObjectLiteralAndNotNull,
};

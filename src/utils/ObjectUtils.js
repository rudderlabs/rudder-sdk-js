import * as R from 'ramda';
import logger from './logUtil';

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

const getCircularReplacer = (excludeNull) => {
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

const stringifyWithoutCircular = (obj, excludeNull) =>
  JSON.stringify(obj, getCircularReplacer(excludeNull));

const isInstanceOfEvent = (value) =>
  typeof value === 'object' && value !== null && 'target' in value;

export {
  mergeDeepRightObjectArrays,
  mergeDeepRight,
  getCircularReplacer,
  stringifyWithoutCircular,
  isInstanceOfEvent,
  isObjectLiteralAndNotNull,
};

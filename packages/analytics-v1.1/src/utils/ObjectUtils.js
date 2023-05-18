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

export { mergeDeepRightObjectArrays, mergeDeepRight };

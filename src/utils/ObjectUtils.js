import * as R from "ramda";

const mergeDeepRightObjectArrays = (leftValue, rightValue) => {
  if(!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return R.clone(rightValue);
  }

  const mergedArray = R.clone(leftValue);
  rightValue.forEach((value , index) => {
    mergedArray[index] = R.clone(value);
  });

  return mergedArray;
}

const mergeDeepRight = (leftObject, rightObject) =>
  R.mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

export {
  mergeDeepRightObjectArrays,
  mergeDeepRight
}
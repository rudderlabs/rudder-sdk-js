import * as R from 'ramda';

// Original implementations before migrating to ramda

// function _get(obj, prop) {
//   var arr = prop.split('.');
//   for (var i = 0; i < arr.length; i++) {
//     if (!(arr[i] in obj)) return undefined;
//     obj = obj[arr[i]];
//   }
//   return obj;
// }
// function _has(obj, prop) {
//   var arr = prop.split('.');
//   for (var i = 0; i < arr.length; i++) {
//     if (!(arr[i] in obj)) return undefined;
//     obj = obj[arr[i]];
//   }
//   return true;
// }
// const isEmpty = (value: any): boolean => {
//   return typeof value === 'undefined'
//     || value === null
//     || (Array.isArray(value) && value.length === 0)
//     || value === ''
//     || (Object.prototype.toString.call(value) !== '[object Date]' && (typeof value === 'object' && Object.keys(value).length === 0));
// }

//

const getValueByPath = (obj: Record<string, any>, path: string): any => {
  const pathParts = path.split('.');
  return R.path(pathParts, obj);
};

const hasValueByPath = (obj: Record<string, any>, path: string): boolean => {
  return Boolean(getValueByPath(obj, path));
};

const mergeDeepRightObjectArrays = (
  leftValue: any | any[],
  rightValue: any | any[],
): any | any[] => {
  if (!Array.isArray(leftValue) || !Array.isArray(rightValue)) {
    return R.clone(rightValue);
  }

  const mergedArray = R.clone(leftValue);
  rightValue.forEach((value, index) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    mergedArray[index] = mergeDeepRight(mergedArray[index], value);
  });

  return mergedArray;
};

const mergeDeepRight = <T = Record<string, any>>(
  leftObject: Record<string, any>,
  rightObject: Record<string, any>,
): T => R.mergeDeepWith(mergeDeepRightObjectArrays, leftObject, rightObject);

export { getValueByPath, hasValueByPath, mergeDeepRightObjectArrays, mergeDeepRight };

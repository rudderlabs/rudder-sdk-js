import { GenericObject } from '@rudderstack/analytics-js/types';
import * as R from 'ramda';

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
const getValueByPath = (obj: GenericObject, path: string): any => {
  const pathParts = path.split('.');
  return R.path(pathParts, obj);
};

const hasValueByPath = (obj: GenericObject, path: string): boolean => {
  return Boolean(getValueByPath(obj, path));
};

export { getValueByPath, hasValueByPath };

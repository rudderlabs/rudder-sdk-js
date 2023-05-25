// TODO: see if bundle size is bumped up if we use ramda trim instead of custom
import { Nullable } from '@rudderstack/analytics-js/types';
import { isNullOrUndefined, isString } from './checks';

const trim = (value: string): string => value.replace(/^\s+|\s+$/gm, '');

const removeDoubleSpaces = (value: string): string => value.replace(/ {2,}/g, ' ');

/**
 * A function to convert values to string
 * @param val input value
 * @returns stringified value
 */
const tryStringify = (val?: any): Nullable<string> | undefined => {
  let retVal = val;
  if (!isString(val) && !isNullOrUndefined(val)) {
    try {
      retVal = JSON.stringify(val);
    } catch (e) {
      retVal = null;
    }
  }
  return retVal;
};

export { trim, removeDoubleSpaces, tryStringify };

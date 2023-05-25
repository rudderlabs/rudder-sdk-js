import { Nullable } from '@rudderstack/analytics-js/types';
import { isObjectLiteralAndNotNull } from './object';
import { isNullOrUndefined } from '@rudderstack/analytics-js/components/utilities/checks';

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} value input
 * @param {boolean} excludeNull if it should exclude nul or not
 * @returns string
 */
const stringifyWithoutCircular = (
  value?: Nullable<Record<string, any> | any[] | number | string>,
  excludeNull?: boolean,
): string | undefined => {
  const cache: Set<object> = new Set();
  const circularReferenceReplacer = (key: string, value: any) => {
    if (excludeNull && isNullOrUndefined(value)) {
      return undefined;
    }

    if (isObjectLiteralAndNotNull(value)) {
      if (cache.has(value)) {
        return '[Circular Reference]';
      }

      // Add the object to the cache to detect circular references
      cache.add(value);
    }

    return value;
  };

  return JSON.stringify(value, circularReferenceReplacer);
};

export { stringifyWithoutCircular };

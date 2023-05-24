import { isObjectAndNotNull } from './object';

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} obj input object
 * @param {boolean} excludeNull if it should exclude nul or not
 * @returns string
 */
const stringifyWithoutCircular = (obj: Record<string, any>, excludeNull?: boolean): string => {
  const cache: Set<object> = new Set();
  const replacer = (key: string, value: any) => {
    if (excludeNull && (value === null || value === undefined)) {
      return undefined;
    }

    if (isObjectAndNotNull(value)) {
      if (cache.has(value)) {
        return '[Circular Reference]';
      }

      // Add the object to the cache to detect circular references
      cache.add(value);
    }

    return value;
  };

  return JSON.stringify(obj, replacer);
};

export { stringifyWithoutCircular };

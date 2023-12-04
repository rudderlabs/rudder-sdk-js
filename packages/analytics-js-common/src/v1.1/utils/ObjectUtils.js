import { logger } from './logUtil';

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

const stringifyWithoutCircularV1 = (obj, excludeNull) => {
  try {
    return JSON.stringify(obj, getCircularReplacer(excludeNull));
  } catch (err) {
    logger.warn(`Failed to convert the value to a JSON string.`);
    return null;
  }
};

const isInstanceOfEvent = value => typeof value === 'object' && value !== null && 'target' in value;

/**
 * Returns true for empty object {}
 * @param {*} obj
 * @returns
 */
const isEmptyObject = obj => {
  if (!obj) {
    logger.warn('input is undefined or null');
    return true;
  }
  return Object.keys(obj).length === 0;
};

export { getCircularReplacer, stringifyWithoutCircularV1, isInstanceOfEvent, isEmptyObject };

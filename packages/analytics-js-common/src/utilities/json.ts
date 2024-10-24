import type { ILogger } from '../types/Logger';
import type { Nullable } from '../types/Nullable';
import { isBigInt, isNull } from './checks';
import { CIRCULAR_REFERENCE_WARNING, JSON_STRINGIFY_WARNING } from '../constants/logMessages';
import type { StringifyOptions } from '../types/stringify';

const JSON_STRINGIFY = 'JSONStringify';

const getCircularReplacer = (
  options?: StringifyOptions,
  logger?: ILogger,
): ((key: string, value: any) => any) => {
  const { excludeKeys = [], excludeNull = true, excludeBigInt = true } = options ?? {};
  const ancestors: any[] = [];

  // Here we do not want to use arrow function to use "this" in function context
  // eslint-disable-next-line func-names
  return function (key, value): any {
    if (
      (excludeNull && isNull(value)) ||
      (excludeBigInt && isBigInt(value)) ||
      excludeKeys.includes(key)
    ) {
      return undefined;
    }

    if (typeof value !== 'object' || isNull(value)) {
      return value;
    }

    // `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
      logger?.warn(CIRCULAR_REFERENCE_WARNING(JSON_STRINGIFY, key));
      return '[Circular Reference]';
    }

    ancestors.push(value);
    return value;
  };
};

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} value input value
 * @param {StringifyOptions} options optional options for excluding keys and null values
 * @param {function} logger optional logger instance
 * @returns string
 */
const stringifyWithoutCircular = <T = Record<string, any> | any[] | number | string>(
  value: Nullable<T>,
  options?: StringifyOptions,
  logger?: ILogger,
): Nullable<string> => {
  try {
    return JSON.stringify(value, getCircularReplacer(options, logger));
  } catch (err) {
    logger?.warn(JSON_STRINGIFY_WARNING, err);
    return null;
  }
};

export { stringifyWithoutCircular };

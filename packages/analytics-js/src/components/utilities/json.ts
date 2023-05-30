import { Nullable } from '@rudderstack/analytics-js/types';
import { isNull, isNullOrUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';

const getCircularReplacer = (
  excludeNull?: boolean,
  logger?: ILogger,
): ((key: string, value: any) => any) => {
  const ancestors: any[] = [];

  // Here we do not want to use arrow function to use "this" in function context
  // eslint-disable-next-line func-names
  return function (key, value): any {
    if (excludeNull && isNullOrUndefined(value)) {
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
      logger?.warn(`Circular Reference detected and dropped from property: ${key}`);
      return '[Circular Reference]';
    }

    ancestors.push(value);
    return value;
  };
};

/**
 * Utility method for JSON stringify object excluding null values & circular references
 *
 * @param {*} value input
 * @param {boolean} excludeNull if it should exclude nul or not
 * @param {function} logger optional logger methods for warning
 * @returns string
 */
const stringifyWithoutCircular = <T = Record<string, any> | any[] | number | string>(
  value?: Nullable<T>,
  excludeNull?: boolean,
  logger?: ILogger,
): string | undefined => JSON.stringify(value, getCircularReplacer(excludeNull, logger));

export { stringifyWithoutCircular };

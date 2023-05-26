import { Nullable } from '@rudderstack/analytics-js/types';

const getCircularReplacer = (excludeNull?: boolean): ((key: string, value: any) => any) => {
  const ancestors: any[] = [];

  // Here we do not want to use arrow function to use "this" in function context
  // eslint-disable-next-line func-names
  return function (key, value): any {
    if (excludeNull && (value === null || value === undefined)) {
      return undefined;
    }

    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // `this` is the object that value is contained in, i.e., its direct parent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }

    if (ancestors.includes(value)) {
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
 * @returns string
 */
const stringifyWithoutCircular = (
  value?: Nullable<Record<string, any> | any[] | number | string>,
  excludeNull?: boolean,
): string | undefined => JSON.stringify(value, getCircularReplacer(excludeNull));

export { stringifyWithoutCircular };

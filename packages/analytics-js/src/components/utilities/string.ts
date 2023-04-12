// TODO: see if bundle size is bumped up if we use ramda trim instead of custom
const trim = (value: string): string => value.replace(/^\s+|\s+$/gm, '');

/**
 * A function to convert values to string
 * @param val input value
 * @returns stringified value
 */
const tryStringify = (val: any) =>
  typeof val === 'string' || typeof val === 'undefined' || val === null ? val : JSON.stringify(val);

export { trim, tryStringify };

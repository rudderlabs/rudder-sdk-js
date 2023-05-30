/**
 * A function to check given value is a function
 * @param value input value
 * @returns boolean
 */
const isFunction = (value: any): boolean =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

/**
 * A function to check given value is a string
 * @param value input value
 * @returns boolean
 */
const isString = (value: any): boolean => typeof value === 'string';

/**
 * A function to check given value is null or not
 * @param value input value
 * @returns boolean
 */
const isNull = (value: any): boolean => value === null;

/**
 * A function to check given value is undefined
 * @param value input value
 * @returns boolean
 */
const isUndefined = (value: any): boolean => typeof value === 'undefined';

/**
 * A function to check given value is null or undefined
 * @param value input value
 * @returns boolean
 */
const isNullOrUndefined = (value: any): boolean => isNull(value) || isUndefined(value);

export { isFunction, isString, isNull, isUndefined, isNullOrUndefined };

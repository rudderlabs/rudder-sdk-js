/**
 * A function to check given value is a function
 * @param value input value
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (value: any): value is Function =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

/**
 * A function to check given value is a string
 * @param value input value
 * @returns boolean
 */
const isString = (value: any): value is string => typeof value === 'string';

/**
 * A function to check given value is null or not
 * @param value input value
 * @returns boolean
 */
const isNull = (value: any): value is null => value === null;

/**
 * A function to check given value is undefined
 * @param value input value
 * @returns boolean
 */
const isUndefined = (value: any): value is undefined => typeof value === 'undefined';

/**
 * A function to check given value is null or undefined
 * @param value input value
 * @returns boolean
 */
const isNullOrUndefined = (value: any): boolean => isNull(value) || isUndefined(value);

/**
 * A function to check given value is defined
 * @param value input value
 * @returns boolean
 */
const isDefined = (value: any): boolean => !isUndefined(value);

/**
 * A function to check given value is defined and not null
 * @param value input value
 * @returns boolean
 */
const isDefinedAndNotNull = (value: any): boolean => !isNullOrUndefined(value);

/**
 * A function to check given value is defined and not null
 * @param value input value
 * @returns boolean
 */
const isDefinedNotNullAndNotEmptyString = (value: any): boolean =>
  isDefinedAndNotNull(value) && value !== '';

/**
 * Determines if the input is an instance of Error
 * @param obj input value
 * @returns true if the input is an instance of Error and false otherwise
 */
const isTypeOfError = (obj: any): obj is Error => obj instanceof Error;

export {
  isFunction,
  isString,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isTypeOfError,
  isDefined,
  isDefinedAndNotNull,
  isDefinedNotNullAndNotEmptyString,
};

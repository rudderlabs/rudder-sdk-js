/**
 * A function to check given value is a function
 * @param value input value
 * @returns boolean
 */
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
 * Checks if the input is a BigInt
 * @param value input value
 * @returns True if the input is a BigInt
 */
const isBigInt = (value: any): value is bigint => typeof value === 'bigint';

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
 * Determines if the input is of type error
 * @param value input value
 * @returns true if the input is of type error else false
 */
const isTypeOfError = (value: any): boolean => {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
};

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
  isBigInt,
};

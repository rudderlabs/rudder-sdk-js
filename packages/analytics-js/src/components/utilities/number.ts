/**
 * A function to check given value is a number or not
 * @param num input value
 * @returns boolean
 */
const isNumber = (num: any): boolean => typeof num === 'number' && !Number.isNaN(num);

/**
 * A function to count the number of digits in a number
 * @param num input number
 * @returns boolean
 */
const hasMinLength = (minimumLength: number, num: number) => num.toString().length >= minimumLength;

const isPositiveInteger = (num: number) => num > 0 && Number.isInteger(num);

export { isNumber, hasMinLength, isPositiveInteger };

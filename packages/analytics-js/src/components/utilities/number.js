/**
 * A function to check given value is a number or not
 * @param num input value
 * @returns boolean
 */
const isNumber = num => typeof num === 'number' && !Number.isNaN(num);
/**
 * A function to check given number has minimum length or not
 * @param minimumLength     minimum length
 * @param num               input number
 * @returns boolean
 */
const hasMinLength = (minimumLength, num) => num.toString().length >= minimumLength;
/**
 * A function to check given value is a positive integer or not
 * @param num input value
 * @returns boolean
 */
const isPositiveInteger = num => isNumber(num) && num >= 0 && Number.isInteger(num);
export { isNumber, hasMinLength, isPositiveInteger };

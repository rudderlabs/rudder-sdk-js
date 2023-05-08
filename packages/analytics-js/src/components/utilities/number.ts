/**
 * A function to check given value is a number or not
 * @param num input number
 * @returns boolean
 */
const isNumber = (num: number): boolean => typeof num === 'number' && !Number.isNaN(num);

/**
 * A function to count the number of digits in a number
 * @param num input number
 * @returns boolean
 */
const countDigits = (num: number) => (num ? num.toString().length : 0);

export { isNumber, countDigits };

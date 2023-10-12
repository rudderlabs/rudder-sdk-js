/**
 * A function to check given value is a number or not
 * @param num input value
 * @returns boolean
 */
declare const isNumber: (num: any) => boolean;
/**
 * A function to check given number has minimum length or not
 * @param minimumLength     minimum length
 * @param num               input number
 * @returns boolean
 */
declare const hasMinLength: (minimumLength: number, num: number) => boolean;
/**
 * A function to check given value is a positive integer or not
 * @param num input value
 * @returns boolean
 */
declare const isPositiveInteger: (num: any) => boolean;
export { isNumber, hasMinLength, isPositiveInteger };

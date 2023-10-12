import { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
/**
 * Utility method to normalise errors
 */
declare const processError: (error: SDKError) => string;
/**
 * A function to determine whether the error should be promoted to notify or not
 * @param {Error} error
 * @returns
 */
declare const isAllowedToBeNotified: (error: Error) => boolean;
export { processError, isAllowedToBeNotified };

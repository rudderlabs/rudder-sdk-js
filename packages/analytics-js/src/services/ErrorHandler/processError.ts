import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ERROR_MESSAGES_TO_BE_FILTERED } from '../../constants/errors';

/**
 * Utility method to normalise errors
 */
const processError = (error: SDKError): string => {
  let errorMessage;

  try {
    if (isString(error)) {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = (error as any).message
        ? (error as any).message
        : stringifyWithoutCircular(error as Record<string, any>);
    }
  } catch (e) {
    errorMessage = `Unknown error: ${(e as Error).message}`;
  }

  return errorMessage;
};

/**
 * A function to determine whether the error should be promoted to notify or not
 * @param {Error} error
 * @returns
 */
const isAllowedToBeNotified = (error: Error) => {
  if (error.message) {
    return !ERROR_MESSAGES_TO_BE_FILTERED.some(e => error.message.includes(e));
  }
  return true;
};

export { processError, isAllowedToBeNotified };

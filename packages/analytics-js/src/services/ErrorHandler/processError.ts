import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ErrorTarget, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ERROR_MESSAGES_TO_BE_FILTERED } from '../../constants/errors';
import { LOAD_ORIGIN } from './constant';

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
    } else if (error instanceof ErrorEvent) {
      errorMessage = error.message;
    }
    // TODO: remove this block once all device mode integrations start using the v3 script loader module (TS)
    else if (error instanceof Event) {
      const eventTarget = error.target as ErrorTarget;
      // Discard all the non-script loading errors
      if (eventTarget && eventTarget.localName !== 'script') {
        return '';
      }
      // Discard script errors that are not originated at SDK or from native SDKs
      if (
        eventTarget?.dataset &&
        (eventTarget.dataset.loader !== LOAD_ORIGIN ||
          eventTarget.dataset.isnonnativesdk !== 'true')
      ) {
        return '';
      }
      errorMessage = `Error in loading a third-party script from URL ${eventTarget?.src} with ID ${eventTarget?.id}.`;
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

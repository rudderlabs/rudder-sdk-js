import { stringifyData } from '@rudderstack/analytics-js-common/utilities/json';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ErrorTarget, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
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
    } else {
      errorMessage = (error as any).message
        ? (error as any).message
        : stringifyData(error as Record<string, any>);
    }
  } catch (e) {
    errorMessage = `Unknown error: ${(e as Error).message}`;
  }

  return errorMessage;
};

const getNormalizedErrorForUnhandledError = (error: SDKError): SDKError | undefined => {
  try {
    if (
      error instanceof Error ||
      error instanceof ErrorEvent ||
      (error instanceof PromiseRejectionEvent && error.reason)
    ) {
      return error;
    }
    // TODO: remove this block once all device mode integrations start using the v3 script loader module (TS)
    if (error instanceof Event) {
      const eventTarget = error.target as ErrorTarget;
      // Discard all the non-script loading errors
      if (eventTarget && eventTarget.localName !== 'script') {
        return undefined;
      }
      // Discard script errors that are not originated at SDK or from native SDKs
      if (
        eventTarget?.dataset &&
        (eventTarget.dataset.loader !== LOAD_ORIGIN ||
          eventTarget.dataset.isnonnativesdk !== 'true')
      ) {
        return undefined;
      }
      const errorMessage = `Error in loading a third-party script from URL ${eventTarget?.src} with ID ${eventTarget?.id}.`;
      return Object.create(error, {
        message: { value: errorMessage },
      });
    }
    return error;
  } catch (e) {
    return e;
  }
};

export { processError, getNormalizedErrorForUnhandledError };

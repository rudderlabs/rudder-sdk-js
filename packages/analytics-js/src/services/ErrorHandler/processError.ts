import { EXTERNAL_SOURCE_LOAD_ORIGIN } from '@rudderstack/analytics-js-common/constants/htmlAttributes';
import { handleScriptLoadAdBlocked } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/adBlockers';
import { isEvent } from '@rudderstack/analytics-js/components/utilities/event';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { ERROR_MESSAGES_TO_BE_FILTERED } from '@rudderstack/analytics-js/constants/errors';
import { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';

/**
 * Utility method to process errors that originate from script load
 */
const processScriptLoadError = (event: Event): string => {
  let errorMessage = '';

  const targetElement = event.target as HTMLElement | null;
  const dataAttributes = targetElement?.dataset;
  const isScriptElement = targetElement?.localName === 'script';
  const isRudderSDKScriptElement = dataAttributes?.appendOrigin === EXTERNAL_SOURCE_LOAD_ORIGIN;

  // Discard all the non-script loading onerror Events
  // Discard script errors that are not originated from
  // SDK loading or from native SDKs loading
  if (isScriptElement && isRudderSDKScriptElement) {
    errorMessage = `Failed to load script from ${
      (targetElement as HTMLScriptElement).src
    } with id ${targetElement.id}`;

    // TODO: adblocker detection record here?
    //  better to decouple, if not we need to pass the analytics instance here somehow
    //  or find another way to trigger the analytics track event from handleScriptLoadAdBlocked
    //  maybe via setting value to state and a signals effect
    // Discard Ad-block errors for third party native SDK loading, only track them in analytics
    errorMessage = handleScriptLoadAdBlocked(errorMessage, targetElement as HTMLScriptElement);
  }

  return errorMessage;
};

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
    } else if (isEvent(error)) {
      errorMessage = processScriptLoadError(error as Event);
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

export { processScriptLoadError, processError, isAllowedToBeNotified };

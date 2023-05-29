import logger from './logUtil';
import { LOAD_ORIGIN, ERROR_MESSAGES_TO_BE_FILTERED } from './constants';
import { notifyError } from './notifyError';
import { isInstanceOfEvent, stringifyWithoutCircular } from './ObjectUtils';

const normalizeError = (error, customMessage, analyticsInstance) => {
  let errorMessage;
  try {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message ? error.message : stringifyWithoutCircular(error);
    }
  } catch (e) {
    errorMessage = '';
  }

  if (isInstanceOfEvent(error)) {
    // Discard all the non-script loading errors
    if (error.target && error.target.localName !== 'script') {
      return '';
    }

    // Discard script errors that are not originated at SDK or from native SDKs
    if (
      error.target.dataset &&
      (error.target.dataset.loader !== LOAD_ORIGIN ||
        error.target.dataset.isNonNativeSDK !== 'true')
    ) {
      return '';
    }

    errorMessage = `error in script loading:: src::  ${error.target.src} id:: ${error.target.id}`;

    // SDK triggered ad-blocker script
    if (error.target.id === 'ad-block') {
      analyticsInstance.page(
        'RudderJS-Initiated',
        'ad-block page request',
        { path: '/ad-blocked', title: errorMessage },
        analyticsInstance.sendAdblockPageOptions,
      );
      // No need to proceed further for Ad-block errors
      return '';
    }
  }

  const customErrMessagePrefix = customMessage || '';
  return `[handleError]::${customErrMessagePrefix} "${errorMessage}"`;
};

/**
 * A function to determine whether the error should be notified or not
 * @param {Error} error
 * @returns
 */
const isAllowedToBeNotified = (error) => {
  if (error.message) {
    return !ERROR_MESSAGES_TO_BE_FILTERED.some((e) => error.message.includes(e));
  }
  return true;
};

const handleError = (error, customMessage, analyticsInstance) => {
  let errorMessage;

  try {
    errorMessage = normalizeError(error, customMessage, analyticsInstance);
  } catch (err) {
    logger.error('[handleError] Exception:: ', err);
    logger.error('[handleError] Original error:: ', stringifyWithoutCircular(error));
    notifyError(err);
  }

  if (!errorMessage) {
    return;
  }

  logger.error(errorMessage);
  // Check if the error is allowed to be notified
  if (isAllowedToBeNotified(error)) {
    notifyError(error);
  }
};

export { handleError, normalizeError };

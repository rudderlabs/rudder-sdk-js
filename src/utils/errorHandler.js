import logger from './logUtil';
import { LOAD_ORIGIN, ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME } from './constants';

/**
 * This function is to send handled errors to available error reporting client
 *
 * @param {Error} error Error instance from handled error
 */
function notifyError(error) {
  const errorReportingClient =
    window.rudderanalytics && window.rudderanalytics[ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME];

  if (errorReportingClient) {
    errorReportingClient.notify(error);
  }
}

function normaliseError(error, customMessage, analyticsInstance) {
  let errorMessage;
  try {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message ? error.message : JSON.stringify(error);
    }
  } catch (e) {
    errorMessage = '';
  }

  if (error instanceof Event) {
    // Discard all the non-script loading errors
    if (error.target && error.target.localName !== 'script') {
      return '';
    }

    // Discard script errors that are not originated at SDK or from native SDKs
    if (
      error.target.dataset &&
      (error.target.dataset.loader !== LOAD_ORIGIN ||
        error.target.dataset.isNonNativeSDK !== 'true')
    )
      return '';

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
}

function handleError(error, customMessage, analyticsInstance) {
  let errorMessage;

  try {
    errorMessage = normaliseError(error, customMessage, analyticsInstance);
  } catch (err) {
    logger.error('[handleError] Exception:: ', err);
    logger.error('[handleError] Original error:: ', JSON.stringify(error));
    notifyError(err);
  }

  if (!errorMessage) {
    return;
  }

  logger.error(errorMessage);
  let errorObj = error;
  if (!(error instanceof Error)) errorObj = new Error(errorMessage);
  notifyError(errorObj);
}

export { notifyError, handleError, normaliseError };

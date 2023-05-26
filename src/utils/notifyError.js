import { ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME } from './constants';

/**
 * This function is to send handled errors to available error reporting client
 *
 * @param {Error} error Error instance from handled error
 */
const notifyError = (error) => {
  const errorReportingClient =
    window.rudderanalytics && window.rudderanalytics[ERROR_REPORTING_SERVICE_GLOBAL_KEY_NAME];
  if (errorReportingClient && error instanceof Error) {
    errorReportingClient.notify(error);
  }
};

export { notifyError };

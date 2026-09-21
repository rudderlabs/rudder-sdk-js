const FAILED_REQUEST_ERR_MSG_PREFIX = 'The request failed';

const PLUGINS_LOAD_FAILURE_MESSAGES = [
  // Chromium
  /Failed to fetch dynamically imported module: .*/,
  // Firefox
  /error loading dynamically imported module: .*/,
];

const INTEGRATIONS_LOAD_FAILURE_MESSAGES = [
  /Unable to load \(.*\) the script with the id .*/,
  /A timeout of \d+ ms occurred while trying to load the script with id .*/,
];

const ERROR_MESSAGES_TO_BE_FILTERED = [
  new RegExp(`${FAILED_REQUEST_ERR_MSG_PREFIX}.*`),
  /A script with the id .* is already loaded\./,
  // The unhandled rejection copy of the device mode readiness timeout. Anchored so
  // that the handled report, which names the destination, is still notified, and
  // pinned to the readiness duration so that no other timeout is swallowed. 11000
  // must track READY_CHECK_TIMEOUT_MS in the deviceModeDestinations constants of
  // analytics-js-plugins; this package cannot import from there, so a test in that
  // package fails if the two ever drift apart.
  /^ErrorHandler:: A timeout of 11000 ms occurred$/,
];

const SCRIPT_LOAD_FAILURE_MESSAGES = [
  ...PLUGINS_LOAD_FAILURE_MESSAGES,
  ...INTEGRATIONS_LOAD_FAILURE_MESSAGES,
];

const INTEGRATIONS_ERROR_CATEGORY = 'integrations';
const SDK_ERROR_CATEGORY = 'sdk';
const DEFAULT_ERROR_CATEGORY = SDK_ERROR_CATEGORY;

export {
  FAILED_REQUEST_ERR_MSG_PREFIX,
  ERROR_MESSAGES_TO_BE_FILTERED,
  PLUGINS_LOAD_FAILURE_MESSAGES,
  INTEGRATIONS_LOAD_FAILURE_MESSAGES,
  SCRIPT_LOAD_FAILURE_MESSAGES,
  INTEGRATIONS_ERROR_CATEGORY,
  SDK_ERROR_CATEGORY,
  DEFAULT_ERROR_CATEGORY,
};

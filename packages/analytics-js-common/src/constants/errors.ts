const FAILED_REQUEST_ERR_MSG_PREFIX = 'The request failed';

const PLUGINS_LOAD_FAILURE_MESSAGES = [/Failed to fetch dynamically imported module: .*/];

const INTEGRATIONS_LOAD_FAILURE_MESSAGES = [
  /Unable to load \(.*\) the script with the id .*/,
  /A timeout of \d+ ms occurred while trying to load the script with id .*/,
];

const ERROR_MESSAGES_TO_BE_FILTERED = [
  new RegExp(`${FAILED_REQUEST_ERR_MSG_PREFIX}.*`),
  /A script with the id .* is already loaded\./,
];

const SCRIPT_LOAD_FAILURE_MESSAGES = [
  ...PLUGINS_LOAD_FAILURE_MESSAGES,
  ...INTEGRATIONS_LOAD_FAILURE_MESSAGES,
];

export {
  FAILED_REQUEST_ERR_MSG_PREFIX,
  ERROR_MESSAGES_TO_BE_FILTERED,
  PLUGINS_LOAD_FAILURE_MESSAGES,
  INTEGRATIONS_LOAD_FAILURE_MESSAGES,
  SCRIPT_LOAD_FAILURE_MESSAGES,
};

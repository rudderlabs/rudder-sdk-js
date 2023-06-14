import { destDispNamesToFileNamesMap } from '../deviceModeDestinations/destDispNamesToFileNames';

const BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME = 'bugsnag'; // For version 6 and bellow
const BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME = 'Bugsnag';
const GLOBAL_LIBRARY_OBJECT_NAMES = [
  BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME,
  BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME,
];
const BUGSNAG_CDN_URL = 'https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js';
const ERROR_REPORT_PROVIDER_NAME_BUGSNAG = 'rs-bugsnag';
// This API key token is parsed in the CI pipeline
const API_KEY = '__RS_BUGSNAG_API_KEY__';
const BUGSNAG_VALID_MAJOR_VERSION = '6';
const SDK_LOAD_POLL_INTERVAL_MS = 100; // ms
const MAX_WAIT_FOR_SDK_LOAD_MS = 10 * SDK_LOAD_POLL_INTERVAL_MS; // ms

// Errors from the below scripts are NOT allowed to reach Bugsnag
const SDK_FILE_NAME_PREFIXES = [
  'rudder-analytics', // Prefix for all the SDK scripts including plugins
  ...Object.values(destDispNamesToFileNamesMap), // Prefixes for all the destination SDK scripts
];

export {
  BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME,
  BUGSNAG_LIB_V7_INSTANCE_GLOBAL_KEY_NAME,
  GLOBAL_LIBRARY_OBJECT_NAMES,
  BUGSNAG_CDN_URL,
  ERROR_REPORT_PROVIDER_NAME_BUGSNAG,
  API_KEY,
  BUGSNAG_VALID_MAJOR_VERSION,
  MAX_WAIT_FOR_SDK_LOAD_MS,
  SDK_FILE_NAME_PREFIXES,
  SDK_LOAD_POLL_INTERVAL_MS,
};

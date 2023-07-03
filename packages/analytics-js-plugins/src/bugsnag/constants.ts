import { destDisplayNamesToFileNamesMap } from '../deviceModeDestinations/destDisplayNamesToFileNames';

const BUGSNAG_LIB_INSTANCE_GLOBAL_KEY_NAME = 'bugsnag'; // For version 6 and below
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
const MAX_WAIT_FOR_SDK_LOAD_MS = 100 * SDK_LOAD_POLL_INTERVAL_MS; // ms

// Errors from the below scripts are NOT allowed to reach Bugsnag
const SDK_FILE_NAME_PREFIXES = (): string[] => [
  'rsa', // Prefix for all the SDK scripts including plugins
  ...Object.values(destDisplayNamesToFileNamesMap), // Prefixes for all the destination SDK scripts
];

const DEV_HOSTS = ['www.test-host.com', 'localhost', '127.0.0.1', '[::1]'];

// List of keys to exclude from the metadata
// Potential PII or sensitive data
const APP_STATE_EXCLUDE_KEYS = [
  'userId',
  'userTraits',
  'groupId',
  'groupTraits',
  'anonymousId',
  'config',
  'instance', // destination instance objects
  'anonymousUserId',
  'eventBuffer', // pre-load event buffer (may contain PII)
  'traits',
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
  DEV_HOSTS,
  APP_STATE_EXCLUDE_KEYS,
};

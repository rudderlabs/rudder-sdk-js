// Errors from the below scripts are NOT allowed to reach Bugsnag
const SDK_FILE_NAME_PREFIXES = (): string[] => [
  'rsa', // Prefix for all the SDK scripts including plugins and module federated chunks
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
  'eventBuffer', // pre-load event buffer (may contain PII)
  'traits',
];
const REQUEST_TIMEOUT_MS = 10 * 1000; // 10 seconds
const NOTIFIER_NAME = 'RudderStack JavaScript SDK Error Notifier';
const SDK_GITHUB_URL = 'https://github.com/rudderlabs/rudder-sdk-js';
const SOURCE_NAME = 'js';

export {
  SDK_FILE_NAME_PREFIXES,
  DEV_HOSTS,
  APP_STATE_EXCLUDE_KEYS,
  REQUEST_TIMEOUT_MS,
  NOTIFIER_NAME,
  SDK_GITHUB_URL,
  SOURCE_NAME,
};

import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const BUGSNAG_API_KEY_VALIDATION_ERROR = (apiKey: string): string =>
  `The Bugsnag API key (${apiKey}) is invalid or not provided.`;

const BUGSNAG_SDK_LOAD_TIMEOUT_ERROR = (timeout: number): string =>
  `A timeout ${timeout} ms occurred while trying to load the Bugsnag SDK.`;

const BUGSNAG_SDK_LOAD_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to load the Bugsnag SDK.`;

const BUGSNAG_SDK_URL_ERROR = 'The Bugsnag SDK URL is invalid. Failed to load the Bugsnag SDK.';

export {
  BUGSNAG_API_KEY_VALIDATION_ERROR,
  BUGSNAG_SDK_LOAD_TIMEOUT_ERROR,
  BUGSNAG_SDK_LOAD_ERROR,
  BUGSNAG_SDK_URL_ERROR,
};

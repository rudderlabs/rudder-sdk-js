import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const IUBENDA_ACCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to access Iubenda SDK resources. Please ensure that the Iubenda SDK is loaded successfully before RudderStack SDK.`;

const DESTINATION_CONSENT_STATUS_ERROR = `Failed to determine the consent status for the destination. Please check the destination configuration and try again.`;

export { IUBENDA_ACCESS_ERROR, DESTINATION_CONSENT_STATUS_ERROR };

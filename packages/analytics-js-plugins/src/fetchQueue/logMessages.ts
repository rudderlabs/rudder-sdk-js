import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, url: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s) to ${url}.`;

export { EVENT_DELIVERY_FAILURE_ERROR_PREFIX };

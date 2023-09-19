import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const RETRY_QUEUE_PROCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Process function threw an error.`;

export { RETRY_QUEUE_PROCESS_ERROR };

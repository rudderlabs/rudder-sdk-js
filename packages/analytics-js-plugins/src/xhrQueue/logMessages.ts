import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, originalErrorMsg: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s). Cause: ${originalErrorMsg}.`;

export { EVENT_DELIVERY_FAILURE_ERROR_PREFIX };

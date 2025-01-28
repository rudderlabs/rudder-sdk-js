import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, err: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s): ${err}.`;

const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

export { EVENT_DELIVERY_FAILURE_ERROR_PREFIX, EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING };

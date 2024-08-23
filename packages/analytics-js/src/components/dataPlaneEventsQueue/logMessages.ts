import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, url: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s) to ${url}.`;

const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;

export {
  EVENT_DELIVERY_FAILURE_ERROR_PREFIX,
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
};

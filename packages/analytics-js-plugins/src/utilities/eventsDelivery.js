import { clone } from 'ramda';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';
const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (context, payloadSize, sizeLimit) =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;
const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING = context =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;
const QUEUE_UTILITIES = 'QueueUtilities';
/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event, logger) =>
  stringifyWithoutCircular(event, true, undefined, logger);
const getDMTDeliveryPayload = (dmtRequestPayload, logger) =>
  stringifyWithoutCircular(dmtRequestPayload, true, undefined, logger);
/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validateEventPayloadSize = (event, logger) => {
  const payloadStr = getDeliveryPayload(event, logger);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > EVENT_PAYLOAD_SIZE_BYTES_LIMIT) {
      logger === null || logger === void 0
        ? void 0
        : logger.warn(
            EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(
              QUEUE_UTILITIES,
              payloadSize,
              EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
            ),
          );
    }
  } else {
    logger === null || logger === void 0
      ? void 0
      : logger.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));
  }
};
/**
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = event => {
  const finalEvent = clone(event);
  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = getCurrentTimeFormatted();
  return finalEvent;
};
export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getFinalEventForDeliveryMutator,
  getDMTDeliveryPayload,
};

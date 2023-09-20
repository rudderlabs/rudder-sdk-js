import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { clone } from 'ramda';

import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import * as timestamp from '@rudderstack/analytics-js-common/utilities/timestamp';
import * as json from '@rudderstack/analytics-js-common/utilities/json';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from '../utilities/constants';

export * as url from '@rudderstack/analytics-js-common/utilities/url';
export * as uuId from '@rudderstack/analytics-js-common/utilities/uuId';
export * as http from '@rudderstack/analytics-js-common/utilities/http';
export * as string from '@rudderstack/analytics-js-common/utilities/string';

const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> =>
  json.stringifyWithoutCircular<RudderEvent>(event, true, undefined, logger);

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validateEventPayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event, logger);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > EVENT_PAYLOAD_SIZE_BYTES_LIMIT) {
      logger?.warn(
        EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(
          QUEUE_UTILITIES,
          payloadSize,
          EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
        ),
      );
    }
  } else {
    logger?.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(QUEUE_UTILITIES));
  }
};

/**
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @param state Application state
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = (event: RudderEvent): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = timestamp.getCurrentTimeFormatted();

  return finalEvent;
};

export { validateEventPayloadSize, getFinalEventForDeliveryMutator, getDeliveryPayload };

export * as json from '@rudderstack/analytics-js-common/utilities/json';
export * as timestamp from '@rudderstack/analytics-js-common/utilities/timestamp';

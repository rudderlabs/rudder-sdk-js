import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { clone } from 'ramda';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { stringifyData } from '@rudderstack/analytics-js-common/utilities/json';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';
import type { TransformationRequestPayload } from '../deviceModeTransformation/types';

const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent): string =>
  stringifyData<RudderEvent>(event) as string;

const getDMTDeliveryPayload = (dmtRequestPayload: TransformationRequestPayload): Nullable<string> =>
  stringifyData<TransformationRequestPayload>(dmtRequestPayload);

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validateEventPayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event);
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
};

/**
 * Mutates the event and return final event for delivery
 * Updates certain parameters like sentAt timestamp, integrations config etc.
 * @param event RudderEvent object
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = (event: RudderEvent, currentTime: string): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = currentTime;

  return finalEvent;
};

export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getFinalEventForDeliveryMutator,
  getDMTDeliveryPayload,
};

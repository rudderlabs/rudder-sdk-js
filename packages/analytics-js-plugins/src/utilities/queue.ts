import { clone } from 'ramda';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { EVENT_PAYLOAD_SIZE_BYTES_LIMIT } from './constants';
import {
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
} from './logMessages';
import { TransformationRequestPayload } from '../deviceModeTransformation/types';

const QUEUE_UTILITIES = 'QueueUtilities';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> =>
  stringifyWithoutCircular<RudderEvent>(event, true, undefined, logger);

const getBatchDeliveryPayload = (events: RudderEvent[], logger?: ILogger): Nullable<string> =>
  stringifyWithoutCircular({ batch: events }, true, undefined, logger);

const getDMTDeliveryPayload = (
  event: TransformationRequestPayload,
  logger?: ILogger,
): Nullable<string> =>
  stringifyWithoutCircular<TransformationRequestPayload>(event, true, undefined, logger);

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
  finalEvent.sentAt = getCurrentTimeFormatted();

  return finalEvent;
};

export {
  getDeliveryPayload,
  validateEventPayloadSize,
  getFinalEventForDeliveryMutator,
  getBatchDeliveryPayload,
  getDMTDeliveryPayload,
};

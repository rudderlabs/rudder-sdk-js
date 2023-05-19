import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { RudderEvent, RudderEventType } from '@rudderstack/analytics-js/components/eventManager/types';
import { replaceNullValues } from '@rudderstack/analytics-js/components/utilities/json';
import path from 'path';
import { MAX_EVENT_PAYLOAD_SIZE_BYTES, DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS } from './constants';
import { mergeDeepRight } from '../utilities/common';
import { QueueOpts } from '../types/common';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): string => {
  let deliveryPayloadStr = '';
  try {
    deliveryPayloadStr = JSON.stringify(event, replaceNullValues);
  } catch (err) {
    logger?.error(`Error while converting event object to string. Error: ${err}.`);
  }
  return deliveryPayloadStr;
};

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validatePayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event, logger);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > MAX_EVENT_PAYLOAD_SIZE_BYTES) {
      logger?.warn(
        `The event payload size (${payloadSize}) exceeds the maximum limit of ${MAX_EVENT_PAYLOAD_SIZE_BYTES} bytes. The event might get dropped.`,
      );
    }
  } else {
    logger?.error(`Error while calculating event payload size.`);
  }
};

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts => mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts)

// eslint-disable-next-line compat/compat
const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string => new URL(path.join(DATA_PLANE_API_VERSION, eventType), dataplaneUrl).toString();

export { validatePayloadSize, getDeliveryPayload, getDeliveryUrl, getNormalizedQueueOptions };

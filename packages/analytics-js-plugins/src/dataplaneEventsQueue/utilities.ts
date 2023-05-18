import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { replaceNullValues } from '@rudderstack/analytics-js/components/utilities/json';
import { MAX_EVENT_PAYLOAD_SIZE_BYTES } from './constants';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): string => {
  try {
    return JSON.stringify(event, replaceNullValues);
  } catch (err) {
    logger?.error(`Error while converting event object to string. Error: ${err}`);
    return '';
  }
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
        `The event payload size (${payloadSize}) exceeds the maximum limit of ${MAX_EVENT_PAYLOAD_SIZE_BYTES} bytes. The event might get dropped`,
      );
    }
  } else {
    logger?.error(`Error while calculating event payload size.`);
  }
};

export { validatePayloadSize, getDeliveryPayload };

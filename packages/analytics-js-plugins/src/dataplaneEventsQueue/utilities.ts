import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { replaceNullValues } from '@rudderstack/analytics-js/components/utilities/json';
import { MAX_EVENT_PAYLOAD_SIZE_BYTES } from './constants';

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validatePayloadSize = (event: RudderEvent, logger?: ILogger) => {
  try {
    const payloadSize = JSON.stringify(event, replaceNullValues).length;
    if (payloadSize > MAX_EVENT_PAYLOAD_SIZE_BYTES) {
      logger?.warn(
        `The event payload size (${payloadSize}) exceeds the maximum limit of ${MAX_EVENT_PAYLOAD_SIZE_BYTES} bytes. The event might get dropped`,
      );
    }
  } catch (e) {
    logger?.warn(`Error while calculating event payload size. Error: ${e}`);
  }
};

export { validatePayloadSize };

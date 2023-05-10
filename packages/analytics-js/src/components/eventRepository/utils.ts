import { clone } from 'ramda';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { RudderEvent } from '../eventManager/types';
import { getCurrentTimeFormatted } from '../utilities/timestamp';
import { MAX_EVENT_PAYLOAD_SIZE } from './constants';

const validatePayloadSize = (payload: RudderEvent, logger?: ILogger) => {
  // append sentAt for the sake of size calculation
  const fakeFinalPayload = clone(payload);
  fakeFinalPayload.sentAt = getCurrentTimeFormatted();
  try {
    const payloadSize = JSON.stringify(fakeFinalPayload).length;
    if (payloadSize > MAX_EVENT_PAYLOAD_SIZE) {
      logger?.warn(
        `The event payload size (${payloadSize}) exceeds the maximum limit of ${MAX_EVENT_PAYLOAD_SIZE} bytes. The event might get dropped`,
      );
    }
  } catch (e) {
    logger?.warn(`Error while calculating event payload size. Error: ${e}`);
  }
};

export { validatePayloadSize };

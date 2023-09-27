import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { TransformationRequestPayload } from './types';

/**
 * A helper function that will take rudderEvent and generate
 * a batch payload that will be sent to transformation server
 *
 */
const createPayload = (
  event: RudderEvent,
  destinationIds: string[],
  token: Nullable<string>,
): TransformationRequestPayload => {
  const orderNo = Date.now();
  const payload = {
    metadata: {
      'Custom-Authorization': token,
    },
    batch: [
      {
        orderNo,
        destinationIds,
        event,
      },
    ],
  };
  return payload;
};

export { createPayload };

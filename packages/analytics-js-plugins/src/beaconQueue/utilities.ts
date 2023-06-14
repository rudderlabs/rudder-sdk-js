import {
  MAX_EVENT_PAYLOAD_SIZE_BYTES,
  DATA_PLANE_API_VERSION,
  DEFAULT_BEACON_QUEUE_OPTIONS,
} from './constants';
import { mergeDeepRight, stringifyWithoutCircular } from '../utilities/common';
import { BeaconQueueOpts, RudderEvent, ILogger, Nullable } from '../types/common';

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent, logger?: ILogger): Nullable<string> => {
  let deliveryPayloadStr: Nullable<string> = '';
  try {
    deliveryPayloadStr = stringifyWithoutCircular<RudderEvent>(event, true) as Nullable<string>;
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

const getNormalizedBeaconQueueOptions = (queueOpts: BeaconQueueOpts): BeaconQueueOpts =>
  mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string): string =>
  new URL(`/beacon/${DATA_PLANE_API_VERSION}/batch`, dataplaneUrl).toString();

export { validatePayloadSize, getDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

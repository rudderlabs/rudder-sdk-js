import { DATA_PLANE_API_VERSION, DEFAULT_BEACON_QUEUE_OPTIONS } from './constants';
import { mergeDeepRight, stringifyWithoutCircular } from '../utilities/common';
import { BeaconQueueOpts, RudderEvent, ILogger } from '../types/common';
import { BeaconBatchData } from './types';

/**
 * Utility to get the stringified event payload as Blob
 * @param events RudderEvent object array
 * @param logger Logger instance
 * @returns stringified events payload as Blob, undefined if error occurs.
 */
const getDeliveryPayload = (events: RudderEvent[], logger?: ILogger): Blob | undefined => {
  const data: BeaconBatchData = {
    batch: events,
  };

  try {
    const blobPayload = stringifyWithoutCircular(data, true);
    const blobOptions: BlobPropertyBag = { type: 'text/plain' };

    if (blobPayload) {
      return new Blob([blobPayload], blobOptions);
    }
    logger?.error(`Error while converting event batch object to Blob.`);
  } catch (err) {
    logger?.error(`Error while converting event batch object to string. Error: ${err}.`);
  }

  return undefined;
};

const getNormalizedBeaconQueueOptions = (queueOpts: BeaconQueueOpts): BeaconQueueOpts =>
  mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, writeKey: string): string =>
  new URL(`/beacon/${DATA_PLANE_API_VERSION}/batch?writeKey=${writeKey}`, dataplaneUrl).toString();

export { getDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

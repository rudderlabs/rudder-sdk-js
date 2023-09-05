import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import {
  BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR,
} from '../utilities/logMessages';
import {
  BEACON_QUEUE_PLUGIN,
  DATA_PLANE_API_VERSION,
  DEFAULT_BEACON_QUEUE_OPTIONS,
} from './constants';
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
    logger?.error(BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN));
  } catch (err) {
    logger?.error(BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN), err);
  }

  return undefined;
};

const getNormalizedBeaconQueueOptions = (queueOpts: BeaconQueueOpts): BeaconQueueOpts =>
  mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, writeKey: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes(
      [
        dpUrl.pathname,
        '/',
        'beacon',
        '/',
        DATA_PLANE_API_VERSION,
        '/',
        `batch?writeKey=${writeKey}`,
      ].join(''),
    ),
    dpUrl,
  ).href;
};

export { getDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

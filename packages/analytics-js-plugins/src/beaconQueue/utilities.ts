import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import {
  BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_INVALID_DELIVERY_PATH_WARNING,
} from './logMessages';
import { BEACON_QUEUE_PLUGIN, DEFAULT_BEACON_QUEUE_OPTIONS } from './constants';
import type { BeaconBatchData } from './types';
import {
  mergeDeepRight,
  removeDuplicateSlashes,
  stringifyWithoutCircular,
} from '../shared-chunks/common';

/**
 * Utility to get the stringified event payload as Blob
 * @param events RudderEvent object array
 * @param logger Logger instance
 * @returns stringified events payload as Blob, undefined if error occurs.
 */
const getBatchDeliveryPayload = (
  events: RudderEvent[],
  currentTime: string,
  logger?: ILogger,
): Blob | undefined => {
  const data: BeaconBatchData = {
    batch: events,
    sentAt: currentTime,
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

const joinPaths = (basePath: string, path: string): string =>
  removeDuplicateSlashes([basePath, '/', path].join(''));

// Valid only if the URL parser keeps the path as is: dot segments, a query or a fragment would
// escape the data plane URL's path prefix or move the writeKey out of the query
const isValidDeliveryPath = (dpUrl: URL, deliveryPath: unknown): deliveryPath is string => {
  if (typeof deliveryPath !== 'string' || deliveryPath.replace(/\//g, '').trim() === '') {
    return false;
  }
  const path = joinPaths(dpUrl.pathname, deliveryPath);
  try {
    const url = new URL(path, dpUrl);
    return url.pathname === path && !url.search && !url.hash;
  } catch {
    // e.g. "/\" parses as a scheme-relative URL with an empty host
    return false;
  }
};

const getDeliveryUrl = (
  dataplaneUrl: string,
  writeKey: string,
  deliveryPath?: string,
  logger?: ILogger,
): string => {
  const dpUrl = new URL(dataplaneUrl);
  const defaultPath = DEFAULT_BEACON_QUEUE_OPTIONS.deliveryPath;
  let path = defaultPath;
  if (isValidDeliveryPath(dpUrl, deliveryPath)) {
    path = deliveryPath;
  } else if (deliveryPath !== undefined && deliveryPath !== null) {
    logger?.warn(
      BEACON_QUEUE_INVALID_DELIVERY_PATH_WARNING(
        BEACON_QUEUE_PLUGIN,
        typeof deliveryPath === 'string' ? deliveryPath : '[non-string value]',
        defaultPath,
      ),
    );
  }
  return new URL(`${joinPaths(dpUrl.pathname, path)}?writeKey=${writeKey}`, dpUrl).href;
};

export { getBatchDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

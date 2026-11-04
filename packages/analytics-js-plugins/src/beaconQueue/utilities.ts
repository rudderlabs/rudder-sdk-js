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

// Unreserved URL characters only; dot segments would escape the data plane URL's path prefix
const isValidDeliveryPath = (deliveryPath: unknown): deliveryPath is string => {
  if (typeof deliveryPath !== 'string' || !/^[\w.~/-]+$/.test(deliveryPath)) {
    return false;
  }
  const segments = deliveryPath.split('/').filter(Boolean);
  return segments.length > 0 && segments.every(segment => !/^\.+$/.test(segment));
};

const getNormalizedDeliveryPath = (deliveryPath?: string, logger?: ILogger): string => {
  if (isValidDeliveryPath(deliveryPath)) {
    return deliveryPath;
  }
  if (deliveryPath !== undefined && deliveryPath !== null) {
    logger?.warn(
      BEACON_QUEUE_INVALID_DELIVERY_PATH_WARNING(
        BEACON_QUEUE_PLUGIN,
        String(deliveryPath),
        DEFAULT_BEACON_QUEUE_OPTIONS.deliveryPath,
      ),
    );
  }
  return DEFAULT_BEACON_QUEUE_OPTIONS.deliveryPath;
};

const getNormalizedBeaconQueueOptions = (
  queueOpts: BeaconQueueOpts,
  logger?: ILogger,
): BeaconQueueOpts => {
  const normalizedOptions = mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS, queueOpts);
  normalizedOptions.deliveryPath = getNormalizedDeliveryPath(
    normalizedOptions.deliveryPath,
    logger,
  );
  return normalizedOptions;
};

const getDeliveryUrl = (dataplaneUrl: string, writeKey: string, deliveryPath?: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    `${removeDuplicateSlashes(
      [dpUrl.pathname, '/', getNormalizedDeliveryPath(deliveryPath)].join(''),
    )}?writeKey=${writeKey}`,
    dpUrl,
  ).href;
};

export { getBatchDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

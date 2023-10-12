import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { json, url } from '../shared-chunks/common';
import {
  BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR,
} from './logMessages';
import {
  BEACON_QUEUE_PLUGIN,
  DATA_PLANE_API_VERSION,
  DEFAULT_BEACON_QUEUE_OPTIONS,
} from './constants';
/**
 * Utility to get the stringified event payload as Blob
 * @param events RudderEvent object array
 * @param logger Logger instance
 * @returns stringified events payload as Blob, undefined if error occurs.
 */
const getBatchDeliveryPayload = (events, logger) => {
  const data = {
    batch: events,
  };
  try {
    const blobPayload = json.stringifyWithoutCircular(data, true);
    const blobOptions = { type: 'text/plain' };
    if (blobPayload) {
      return new Blob([blobPayload], blobOptions);
    }
    logger === null || logger === void 0
      ? void 0
      : logger.error(BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN));
  } catch (err) {
    logger === null || logger === void 0
      ? void 0
      : logger.error(BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR(BEACON_QUEUE_PLUGIN), err);
  }
  return undefined;
};
const getNormalizedBeaconQueueOptions = queueOpts =>
  mergeDeepRight(DEFAULT_BEACON_QUEUE_OPTIONS, queueOpts);
const getDeliveryUrl = (dataplaneUrl, writeKey) => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    url.removeDuplicateSlashes(
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
export { getBatchDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };

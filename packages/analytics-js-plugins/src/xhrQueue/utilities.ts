import { isUndefined, mergeDeepRight } from '@rudderstack/analytics-js-common/index';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRQueueItem } from './types';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from '../utilities/logMessages';

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, endpointType: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes(
      [dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', endpointType].join(''),
    ),
    dpUrl,
  ).href;
};

const getBatchDeliveryUrl = (dataplaneUrl: string): string => getDeliveryUrl(dataplaneUrl, 'batch');

const logErrorOnFailure = (
  details: ResponseDetails | undefined,
  url: string,
  willBeRetried?: boolean,
  attemptNumber?: number,
  maxRetryAttempts?: number,
  logger?: ILogger,
) => {
  if (isUndefined(details?.error) || isUndefined(logger)) {
    return;
  }

  const isRetryableFailure = isErrRetryable(details);
  let errMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN, url);
  const dropMsg = `The event(s) will be dropped.`;
  if (isRetryableFailure) {
    if (willBeRetried) {
      errMsg = `${errMsg} It/they will be retried.`;
      if ((attemptNumber as number) > 0) {
        errMsg = `${errMsg} Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
      }
    } else {
      errMsg = `${errMsg} Retries exhausted (${maxRetryAttempts}). ${dropMsg}`;
    }
  } else {
    errMsg = `${errMsg} ${dropMsg}`;
  }
  logger?.error(errMsg);
};

export { getNormalizedQueueOptions, getDeliveryUrl, logErrorOnFailure, getBatchDeliveryUrl };

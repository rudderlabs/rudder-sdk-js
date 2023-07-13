import { isUndefined, mergeDeepRight } from '@rudderstack/analytics-js-common/index';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { RudderEventType } from '../types/plugins';
import { removeDuplicateSlashes } from '../utilities/queue';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRQueueItem } from './types';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from '../utilities/logMessages';

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes([dpUrl.pathname, DATA_PLANE_API_VERSION, '/', eventType].join('')),
    dpUrl,
  ).href;
};

const isErrRetryable = (details?: ResponseDetails) => {
  let isRetryableNWFailure = false;
  if (details?.error && details?.xhr) {
    const xhrStatus = details.xhr.status;
    // same as in v1.1
    isRetryableNWFailure = xhrStatus === 429 || (xhrStatus >= 500 && xhrStatus < 600);
  }
  return isRetryableNWFailure;
};

const logErrorOnFailure = (
  details: ResponseDetails | undefined,
  item: XHRQueueItem,
  willBeRetried?: boolean,
  attemptNumber?: number,
  maxRetryAttempts?: number,
  logger?: ILogger,
) => {
  if (isUndefined(details?.error) || isUndefined(logger)) {
    return;
  }

  const isRetryableFailure = isErrRetryable(details);
  let errMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN, item.url);
  const eventDropMsg = `The event will be dropped.`;
  if (isRetryableFailure) {
    if (willBeRetried) {
      errMsg = `${errMsg} It'll be retried.`;
      if ((attemptNumber as number) > 0) {
        errMsg = `${errMsg} Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
      }
    } else {
      errMsg = `${errMsg} Retries exhausted (${maxRetryAttempts}). ${eventDropMsg}`;
    }
  } else {
    errMsg = `${errMsg} ${eventDropMsg}`;
  }
  logger?.error(errMsg);
};

export { getNormalizedQueueOptions, getDeliveryUrl, isErrRetryable, logErrorOnFailure };

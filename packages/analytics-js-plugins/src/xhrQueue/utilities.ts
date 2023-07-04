import { RudderEventType } from '../types/plugins';
import { isUndefined, mergeDeepRight } from '../utilities/common';
import { QueueOpts, ILogger, ResponseDetails } from '../types/common';
import { removeDuplicateSlashes } from '../utilities/queue';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS } from './constants';
import { XHRQueueItem } from './types';

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
  let errMsg = `Unable to deliver event to ${item.url}.`;
  if (isRetryableFailure) {
    if (willBeRetried) {
      errMsg = `${errMsg} It'll be retried. Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
    } else {
      errMsg = `${errMsg} Retries exhausted (${maxRetryAttempts}). It'll be dropped.`;
    }
  } else {
    errMsg = `${errMsg} It'll be dropped.`;
  }
  logger?.error(errMsg);
};

export { getNormalizedQueueOptions, getDeliveryUrl, isErrRetryable, logErrorOnFailure };

import path from 'path';
import { RudderEventType } from '../types/plugins';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS } from './constants';
import { isUndefined, mergeDeepRight } from '../utilities/common';
import { QueueOpts, ILogger, RejectionDetails } from '../types/common';
import { XHRQueueItem } from './types';

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(path.join(dpUrl.pathname, DATA_PLANE_API_VERSION, eventType), dpUrl).href;
};

const isErrRetryable = (rejectionReason?: RejectionDetails) => {
  let isRetryableNWFailure = false;
  if (rejectionReason?.xhr) {
    const xhrStatus = rejectionReason.xhr.status;
    // same as in v1.1
    isRetryableNWFailure = xhrStatus === 429 || (xhrStatus >= 500 && xhrStatus < 600);
  }
  return isRetryableNWFailure;
};

const logErrorOnFailure = (
  rejectionReason: RejectionDetails | undefined,
  item: XHRQueueItem,
  willBeRetried?: boolean,
  attemptNumber?: number,
  maxRetryAttempts?: number,
  logger?: ILogger,
) => {
  if (isUndefined(rejectionReason) || isUndefined(logger)) {
    return;
  }

  const isRetryableFailure = isErrRetryable(rejectionReason);
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

import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import { RudderEventType } from '../types/plugins';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRQueueItem } from './types';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from '../utilities/logMessages';

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes([dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', eventType].join('')),
    dpUrl,
  ).href;
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

export { getNormalizedQueueOptions, getDeliveryUrl, logErrorOnFailure };

import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { clone } from 'ramda';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import type { XHRRetryQueueItemData, XHRQueueItemData, XHRBatchPayload } from './types';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from './logMessages';
import {
  getCurrentTimeFormatted,
  getDeliveryPayload,
  getFinalEventForDeliveryMutator,
  mergeDeepRight,
  removeDuplicateSlashes,
  stringifyWithoutCircular,
} from '../shared-chunks/common';
import type { QueueProcessCallbackInfo } from '../types/plugins';

const getBatchDeliveryPayload = (
  events: RudderEvent[],
  currentTime: string,
  logger?: ILogger,
): Nullable<string> => {
  const batchPayload: XHRBatchPayload = { batch: events, sentAt: currentTime };
  return stringifyWithoutCircular(batchPayload, true, undefined, logger);
};

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, endpoint: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes([dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', endpoint].join('')),
    dpUrl,
  ).href;
};

const getBatchDeliveryUrl = (dataplaneUrl: string): string => getDeliveryUrl(dataplaneUrl, 'batch');

const logMessageOnFailure = (
  details: ResponseDetails | undefined,
  isRetryable: boolean,
  qItemProcessInfo: QueueProcessCallbackInfo,
  logger?: ILogger,
) => {
  if (!logger) {
    return;
  }

  let logMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(
    XHR_QUEUE_PLUGIN,
    details?.error?.message ?? 'Unknown',
  );
  const dropMsg = `The event(s) will be dropped.`;
  if (isRetryable) {
    if (qItemProcessInfo.willBeRetried) {
      logMsg = `${logMsg} The event(s) will be retried.`;
      if (qItemProcessInfo.retryAttemptNumber > 0) {
        logMsg = `${logMsg} Retry attempt ${qItemProcessInfo.retryAttemptNumber} of ${qItemProcessInfo.maxRetryAttempts}.`;
      }
      // Use warning for retryable failures that will be retried
      logger.warn(logMsg);
    } else {
      logger.error(
        `${logMsg} Retries exhausted (${qItemProcessInfo.maxRetryAttempts}). ${dropMsg}`,
      );
    }
  } else {
    // Use error for non-retryable failures
    logger.error(`${logMsg} ${dropMsg}`);
  }
};

const getRequestInfo = (
  itemData: XHRRetryQueueItemData,
  state: ApplicationState,
  qItemProcessInfo: QueueProcessCallbackInfo,
  logger?: ILogger,
) => {
  let data;
  let headers;
  let url: string;
  const currentTime = getCurrentTimeFormatted();
  if (Array.isArray(itemData)) {
    const finalEvents = itemData.map((queueItemData: XHRQueueItemData) =>
      getFinalEventForDeliveryMutator(queueItemData.event, currentTime),
    );
    data = getBatchDeliveryPayload(finalEvents, currentTime, logger);
    headers = itemData[0] ? clone(itemData[0].headers) : {};
    url = getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value as string);
  } else {
    const { url: eventUrl, event, headers: eventHeaders } = itemData;
    const finalEvent = getFinalEventForDeliveryMutator(event, currentTime);

    data = getDeliveryPayload(finalEvent, logger);
    headers = clone(eventHeaders);
    url = eventUrl;
  }

  // Add current timestamp as sentAt header
  // The same value is added in the event payload as well
  headers.SentAt = currentTime;

  // Add a header to indicate if the item has been reclaimed from
  // local storage
  if (qItemProcessInfo.reclaimed) {
    headers.Reclaimed = 'true';
  }

  // Add retry headers if the item is being retried for delivery
  if (qItemProcessInfo.retryAttemptNumber > 0) {
    // The number of times this item has been attempted to retry
    headers['Retry-Attempt'] = qItemProcessInfo.retryAttemptNumber.toString();

    // The number of seconds since the last attempt
    headers['Retried-After'] = qItemProcessInfo.timeSinceLastAttempt.toString();

    // The number of seconds since the first attempt
    headers['Retried-After-First'] = qItemProcessInfo.timeSinceFirstAttempt.toString();
  }

  return { data, headers, url };
};

export {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logMessageOnFailure,
  getBatchDeliveryUrl,
  getRequestInfo,
  getBatchDeliveryPayload,
};

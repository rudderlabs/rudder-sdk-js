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

const logErrorOnFailure = (
  details: ResponseDetails | undefined,
  isRetryable: boolean,
  qItemProcessInfo: QueueProcessCallbackInfo,
  logger?: ILogger,
) => {
  let errMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(
    XHR_QUEUE_PLUGIN,
    details?.error?.message ?? 'Unknown',
  );
  const dropMsg = `The event(s) will be dropped.`;
  if (isRetryable) {
    if (qItemProcessInfo.willBeRetried) {
      errMsg = `${errMsg} The event(s) will be retried.`;
      if (qItemProcessInfo.retryAttemptNumber > 0) {
        errMsg = `${errMsg} Retry attempt ${qItemProcessInfo.retryAttemptNumber} of ${qItemProcessInfo.maxRetryAttempts}.`;
      }
    } else {
      errMsg = `${errMsg} Retries exhausted (${qItemProcessInfo.maxRetryAttempts}). ${dropMsg}`;
    }
  } else {
    errMsg = `${errMsg} ${dropMsg}`;
  }

  logger?.error(errMsg);
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

  // Add sentAt header
  headers.SentAt = currentTime;
  if (qItemProcessInfo.reclaimed) {
    headers.Reclaimed = qItemProcessInfo.reclaimed.toString();
  }

  // Add retry headers if the item is being retried
  if (qItemProcessInfo.retryAttemptNumber > 0) {
    headers['Retry-Attempt'] = qItemProcessInfo.retryAttemptNumber.toString();
    headers['Retried-After'] = qItemProcessInfo.timeSinceLastAttempt.toString();
    headers['Retried-After-First'] = qItemProcessInfo.timeSinceFirstAttempt.toString();
  }

  return { data, headers, url };
};

export {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getBatchDeliveryUrl,
  getRequestInfo,
  getBatchDeliveryPayload,
};

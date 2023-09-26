import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { clone } from 'ramda';
import { checks, http, url, json, eventsDelivery } from '../shared-chunks/common';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRRetryQueueItemData, XHRQueueItemData } from './types';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from './logMessages';

const getBatchDeliveryPayload = (events: RudderEvent[], logger?: ILogger): Nullable<string> =>
  json.stringifyWithoutCircular({ batch: events }, true, undefined, logger);

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, endpoint: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    url.removeDuplicateSlashes(
      [dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', endpoint].join(''),
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
  if (checks.isUndefined(details?.error) || checks.isUndefined(logger)) {
    return;
  }

  const isRetryableFailure = http.isErrRetryable(details);
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

const getRequestInfo = (
  itemData: XHRRetryQueueItemData,
  state: ApplicationState,
  logger?: ILogger,
) => {
  let data;
  let headers;
  let url: string;
  if (Array.isArray(itemData)) {
    const finalEvents = itemData.map((queueItemData: XHRQueueItemData) =>
      eventsDelivery.getFinalEventForDeliveryMutator(queueItemData.event),
    );
    data = getBatchDeliveryPayload(finalEvents, logger);
    headers = clone(itemData[0].headers);
    url = getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value as string);
  } else {
    const { url: eventUrl, event, headers: eventHeaders } = itemData;
    const finalEvent = eventsDelivery.getFinalEventForDeliveryMutator(event);

    data = eventsDelivery.getDeliveryPayload(finalEvent, logger);
    headers = clone(eventHeaders);
    url = eventUrl;
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

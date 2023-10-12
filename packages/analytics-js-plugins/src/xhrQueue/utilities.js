import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { clone } from 'ramda';
import { checks, http, url, json, eventsDelivery } from '../shared-chunks/common';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS, XHR_QUEUE_PLUGIN } from './constants';
import { EVENT_DELIVERY_FAILURE_ERROR_PREFIX } from './logMessages';
const getBatchDeliveryPayload = (events, logger) => {
  const batchPayload = { batch: events };
  return json.stringifyWithoutCircular(batchPayload, true, undefined, logger);
};
const getNormalizedQueueOptions = queueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);
const getDeliveryUrl = (dataplaneUrl, endpoint) => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    url.removeDuplicateSlashes(
      [dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', endpoint].join(''),
    ),
    dpUrl,
  ).href;
};
const getBatchDeliveryUrl = dataplaneUrl => getDeliveryUrl(dataplaneUrl, 'batch');
const logErrorOnFailure = (
  details,
  url,
  willBeRetried,
  attemptNumber,
  maxRetryAttempts,
  logger,
) => {
  if (
    checks.isUndefined(details === null || details === void 0 ? void 0 : details.error) ||
    checks.isUndefined(logger)
  ) {
    return;
  }
  const isRetryableFailure = http.isErrRetryable(details);
  let errMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(XHR_QUEUE_PLUGIN, url);
  const dropMsg = `The event(s) will be dropped.`;
  if (isRetryableFailure) {
    if (willBeRetried) {
      errMsg = `${errMsg} It/they will be retried.`;
      if (attemptNumber > 0) {
        errMsg = `${errMsg} Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
      }
    } else {
      errMsg = `${errMsg} Retries exhausted (${maxRetryAttempts}). ${dropMsg}`;
    }
  } else {
    errMsg = `${errMsg} ${dropMsg}`;
  }
  logger === null || logger === void 0 ? void 0 : logger.error(errMsg);
};
const getRequestInfo = (itemData, state, logger) => {
  let data;
  let headers;
  let url;
  if (Array.isArray(itemData)) {
    const finalEvents = itemData.map(queueItemData =>
      eventsDelivery.getFinalEventForDeliveryMutator(queueItemData.event),
    );
    data = getBatchDeliveryPayload(finalEvents, logger);
    headers = clone(itemData[0].headers);
    url = getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value);
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

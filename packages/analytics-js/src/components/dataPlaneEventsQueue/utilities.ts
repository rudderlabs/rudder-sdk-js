import type { LoadOptions, QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { clone } from 'ramda';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/time';
import { stringifyData } from '@rudderstack/analytics-js-common/utilities/json';
import type {
  QueueBatchItemsSizeCalculatorCallback,
  QueueItemData,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import {
  DATA_PLANE_API_VERSION,
  DATA_PLANE_EVENTS_QUEUE,
  DEFAULT_RETRY_QUEUE_OPTIONS,
  EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
} from './constants';
import type { BatchData, BatchPayload, EventsQueueItemData, SingleEventData } from './types';
import {
  EVENT_DELIVERY_FAILURE_ERROR_PREFIX,
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
} from './logMessages';

const getNormalizedQueueOptions = (loadOptions: LoadOptions): QueueOpts => {
  // eslint-disable-next-line sonarjs/deprecation
  const { queueOptions, useBeacon, beaconQueueOptions } = loadOptions;
  let queueOpts = queueOptions as QueueOpts;
  // If beacon is enabled, use the beacon queue options for backward compatibility
  if (useBeacon === true) {
    queueOpts = {
      batch: {
        enabled: true, // In beacon mode, batch delivery was always enabled
        maxItems: beaconQueueOptions?.maxItems,
        flushInterval: beaconQueueOptions?.flushQueueInterval,
      },
    };
  }
  return mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);
};

/**
 * Utility to update the sentAt timestamp of the event to the current timestamp
 * @param event RudderEvent object
 * @param currentTime Current timestamp
 * @returns Final event ready to be delivered
 */
const getFinalEventForDeliveryMutator = (event: RudderEvent, currentTime: string): RudderEvent => {
  const finalEvent = clone(event);

  // Update sentAt timestamp to the latest timestamp
  finalEvent.sentAt = currentTime;

  return finalEvent;
};

const getDeliveryUrl = (dataplaneUrl: string, endpoint: string): string => {
  const dpUrl = new URL(dataplaneUrl);
  return new URL(
    removeDuplicateSlashes([dpUrl.pathname, '/', DATA_PLANE_API_VERSION, '/', endpoint].join('')),
    dpUrl,
  ).href;
};

const getBatchDeliveryUrl = (dataplaneUrl: string): string => getDeliveryUrl(dataplaneUrl, 'batch');

const getBatchDeliveryPayload = (events: RudderEvent[], currentTime: string): Nullable<string> => {
  const batchPayload: BatchPayload = { batch: events, sentAt: currentTime };
  return stringifyData(batchPayload);
};

/**
 * Utility to get the stringified event payload
 * @param event RudderEvent object
 * @param logger Logger instance
 * @returns stringified event payload. Empty string if error occurs.
 */
const getDeliveryPayload = (event: RudderEvent): Nullable<string> => stringifyData(event);

const getRequestInfo = (itemData: EventsQueueItemData, state: ApplicationState) => {
  let data;
  let headers;
  let url: string;
  const currentTime = getCurrentTimeFormatted();
  if (Array.isArray(itemData)) {
    const finalEvents = itemData.map((queueItemData: SingleEventData) =>
      getFinalEventForDeliveryMutator(queueItemData.event, currentTime),
    );
    data = getBatchDeliveryPayload(finalEvents, currentTime);
    headers = clone(itemData[0]?.headers);
    url = getBatchDeliveryUrl(state.lifecycle.activeDataplaneUrl.value as string);
  } else {
    const { url: eventUrl, event, headers: eventHeaders } = itemData;
    const finalEvent = getFinalEventForDeliveryMutator(event, currentTime);

    data = getDeliveryPayload(finalEvent);
    headers = clone(eventHeaders);
    url = eventUrl;
  }
  return { data, headers, url };
};

const logErrorOnFailure = (
  isRetryableFailure: boolean,
  errMsg: string,
  willBeRetried?: boolean,
  attemptNumber?: number,
  maxRetryAttempts?: number,
  logger?: ILogger,
) => {
  let finalErrMsg = EVENT_DELIVERY_FAILURE_ERROR_PREFIX(DATA_PLANE_EVENTS_QUEUE, errMsg);
  const dropMsg = `The event(s) will be dropped.`;
  if (isRetryableFailure) {
    if (willBeRetried) {
      finalErrMsg = `${finalErrMsg} It/they will be retried.`;
      if ((attemptNumber as number) > 0) {
        finalErrMsg = `${finalErrMsg} Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
      }
    } else {
      finalErrMsg = `${finalErrMsg} Retries exhausted (${maxRetryAttempts}). ${dropMsg}`;
    }
  } else {
    finalErrMsg = `${finalErrMsg} ${dropMsg}`;
  }
  logger?.error(finalErrMsg);
};

/**
 * Utility to validate final payload size before sending to server
 * @param event RudderEvent object
 * @param logger Logger instance
 */
const validateEventPayloadSize = (event: RudderEvent, logger?: ILogger) => {
  const payloadStr = getDeliveryPayload(event);
  if (payloadStr) {
    const payloadSize = payloadStr.length;
    if (payloadSize > EVENT_PAYLOAD_SIZE_BYTES_LIMIT) {
      logger?.warn(
        EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING(
          DATA_PLANE_EVENTS_QUEUE,
          payloadSize,
          EVENT_PAYLOAD_SIZE_BYTES_LIMIT,
        ),
      );
    }
  } else {
    logger?.warn(EVENT_PAYLOAD_SIZE_VALIDATION_WARNING(DATA_PLANE_EVENTS_QUEUE));
  }
};

const getBatchSize: QueueBatchItemsSizeCalculatorCallback<QueueItemData> = (
  itemData: QueueItemData[],
): number => {
  const currentTime = getCurrentTimeFormatted();
  const events = (itemData as BatchData).map(
    (queueItemData: SingleEventData) => queueItemData.event,
  );
  // type casting to string as we know that the event has already been validated prior to enqueue
  return (getBatchDeliveryPayload(events, currentTime) as string)?.length;
};

export {
  getNormalizedQueueOptions,
  getFinalEventForDeliveryMutator,
  getRequestInfo,
  getBatchDeliveryPayload,
  getDeliveryPayload,
  getBatchDeliveryUrl,
  getDeliveryUrl,
  logErrorOnFailure,
  validateEventPayloadSize,
  getBatchSize,
};

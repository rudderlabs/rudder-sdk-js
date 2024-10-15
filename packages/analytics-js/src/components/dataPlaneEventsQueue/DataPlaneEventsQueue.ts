/* eslint-disable no-param-reassign */
import { RetryQueue } from '@rudderstack/analytics-js-common/utilities/retryQueue/RetryQueue';
import type {
  DoneCallback,
  QueueItemData,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { clone } from 'ramda';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/time';
import type {
  BatchData,
  EventsQueueItemData,
  IDataPlaneEventsQueue,
  SingleEventData,
} from './types';
import {
  getBatchDeliveryPayload,
  getDeliveryUrl,
  getNormalizedQueueOptions,
  getRequestInfo,
  logErrorOnFailure,
  validateEventPayloadSize,
} from './utilities';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { state } from '../../state';

class DataPlaneEventsQueue implements IDataPlaneEventsQueue {
  readonly private_logger?: ILogger;
  readonly private_httpClient: IHttpClient;
  readonly private_storeManager: IStoreManager;
  readonly private_eventsQueue: RetryQueue;

  constructor(httpClient: IHttpClient, storeManager: IStoreManager, logger?: ILogger) {
    this.private_httpClient = httpClient;
    this.private_storeManager = storeManager;
    this.private_logger = logger;

    const finalQOpts = getNormalizedQueueOptions(state.loadOptions.value);

    this.private_eventsQueue = new RetryQueue(
      // adding write key to the queue name to avoid conflicts
      `${QUEUE_NAME}_${state.lifecycle.writeKey.value as string}`,
      finalQOpts,
      (
        itemData: QueueItemData,
        done: DoneCallback,
        attemptNumber?: number,
        maxRetryAttempts?: number,
        willBeRetried?: boolean,
        isPageAccessible?: boolean,
      ) => {
        const { data, url, headers } = getRequestInfo(
          itemData as EventsQueueItemData,
          state,
          this.private_logger,
        );

        const keepalive = isPageAccessible === false;

        this.private_httpClient.request({
          url,
          options: {
            method: 'POST',
            headers,
            body: data as string,
            useAuth: true,
            keepalive,
          },
          isRawResponse: true,
          timeout: REQUEST_TIMEOUT_MS,
          callback: (result, details) => {
            // The callback will not be fired anyway for keepalive requests
            // but just in case
            if (keepalive) {
              return;
            }

            // null means item will not be requeued
            let queueErrResp = null;
            if (details.error) {
              const isRetryableFailure = isErrRetryable(details);
              if (isRetryableFailure) {
                queueErrResp = details;
              }

              logErrorOnFailure(
                isRetryableFailure,
                details.error.message,
                willBeRetried,
                attemptNumber,
                maxRetryAttempts,
                this.private_logger,
              );
            }
            done(queueErrResp, result);
          },
        });

        // For requests that happen on page leave, we cannot wait for fetch API to complete
        // So, we assume that the request is successful and call done immediately
        if (keepalive) {
          done(null);
        }
      },
      this.private_storeManager,
      LOCAL_STORAGE,
      logger,
      (itemData: QueueItemData[]): number => {
        const currentTime = getCurrentTimeFormatted();
        const events = (itemData as BatchData).map(
          (queueItemData: SingleEventData) => queueItemData.event,
        );
        // type casting to string as we know that the event has already been validated prior to enqueue
        return (getBatchDeliveryPayload(events, currentTime, logger) as string)?.length;
      },
    );
  }

  enqueue(event: RudderEvent) {
    const finalEvent = clone(event);
    // sentAt is only added here for the validation step
    // It'll be updated to the latest timestamp during actual delivery
    finalEvent.sentAt = getCurrentTimeFormatted();
    validateEventPayloadSize(finalEvent, this.private_logger);

    const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
    const url = getDeliveryUrl(dataplaneUrl, finalEvent.type);
    // Other default headers are added by the HttpClient
    // Auth header is added during initialization
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      // To maintain event ordering while using the HTTP API as per is documentation,
      // make sure to include anonymousId as a header
      AnonymousId: toBase64(finalEvent.anonymousId),
    };

    this.private_eventsQueue.addItem({
      url,
      headers,
      event: finalEvent,
    } as SingleEventData);
  }

  start() {
    if (this.private_eventsQueue.scheduleTimeoutActive !== true) {
      this.private_eventsQueue.start();
    }
  }

  stop() {
    if (this.private_eventsQueue.scheduleTimeoutActive === true) {
      this.private_eventsQueue.stop();
    }
  }

  clear() {
    this.private_eventsQueue.clear();
  }

  isRunning() {
    return this.private_eventsQueue.scheduleTimeoutActive;
  }
}

export { DataPlaneEventsQueue };

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
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import type { EventsQueueItemData, IDataPlaneEventsQueue, SingleEventData } from './types';
import {
  getBatchSize,
  getDeliveryUrl,
  getNormalizedQueueOptions,
  getRequestInfo,
  logErrorOnFailure,
  validateEventPayloadSize,
} from './utilities';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { state } from '../../state';

class DataPlaneEventsQueue implements IDataPlaneEventsQueue {
  readonly logger: ILogger;
  readonly httpClient: IHttpClient;
  readonly storeManager: IStoreManager;
  readonly eventsQueue: RetryQueue;

  constructor(httpClient: IHttpClient, storeManager: IStoreManager, logger: ILogger) {
    this.httpClient = httpClient;
    this.storeManager = storeManager;
    this.logger = logger;
    this.handleRetryQueueItem = this.handleRetryQueueItem.bind(this);

    const finalQOpts = getNormalizedQueueOptions(state.loadOptions.value);

    this.eventsQueue = new RetryQueue(
      // adding write key to the queue name to avoid conflicts
      `${QUEUE_NAME}_${state.lifecycle.writeKey.value as string}`,
      finalQOpts,
      this.handleRetryQueueItem,
      this.storeManager,
      LOCAL_STORAGE,
      logger,
      getBatchSize,
    );
  }

  handleRetryQueueItem(
    itemData: QueueItemData,
    done: DoneCallback,
    attemptNumber?: number,
    maxRetryAttempts?: number,
    willBeRetried?: boolean,
    isPageAccessible?: boolean,
  ) {
    const { data, url, headers } = getRequestInfo(itemData as EventsQueueItemData, state);

    const keepalive = isPageAccessible === false;

    this.httpClient.request({
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
            this.logger,
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
  }

  enqueue(event: RudderEvent) {
    const finalEvent = clone(event);
    // sentAt is only added here for the validation step
    // It'll be updated to the latest timestamp during actual delivery
    finalEvent.sentAt = getCurrentTimeFormatted();
    validateEventPayloadSize(finalEvent, this.logger);

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

    this.eventsQueue.addItem({
      url,
      headers,
      event: finalEvent,
    } as SingleEventData);
  }

  start() {
    if (this.eventsQueue.scheduleTimeoutActive !== true) {
      this.eventsQueue.start();
    }
  }

  stop() {
    if (this.eventsQueue.scheduleTimeoutActive === true) {
      this.eventsQueue.stop();
    }
  }

  clear() {
    this.eventsQueue.clear();
  }

  isRunning() {
    return this.eventsQueue.scheduleTimeoutActive;
  }
}

export { DataPlaneEventsQueue };

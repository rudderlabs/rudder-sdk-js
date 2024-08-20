/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { storages, http, timestamp, string, eventsDelivery } from '../shared-chunks/common';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
  getBatchDeliveryPayload,
} from './utilities';
import type { DoneCallback, IQueue, QueueItemData } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import type { XHRRetryQueueItemData, XHRQueueItemData } from './types';

const pluginName: PluginName = 'XhrQueue';

const XhrQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    /**
     * Initialize the queue for delivery
     * @param state Application state
     * @param httpClient http client instance
     * @param storeManager Store Manager instance
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns RetryQueue instance
     */
    init(
      state: ApplicationState,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): IQueue {
      const writeKey = state.lifecycle.writeKey.value as string;
      httpClient.setAuthHeader(writeKey);

      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (
          itemData: QueueItemData,
          done: DoneCallback,
          attemptNumber?: number,
          maxRetryAttempts?: number,
          willBeRetried?: boolean,
        ) => {
          const { data, url, headers } = getRequestInfo(
            itemData as XHRRetryQueueItemData,
            state,
            logger,
          );

          httpClient.request({
            url,
            options: {
              method: 'POST',
              headers,
              body: data as string,
              sendRawData: true,
              useAuth: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // null means item will not be requeued
              const queueErrResp = http.isErrRetryable(details) ? details : null;

              logErrorOnFailure(
                details,
                url,
                willBeRetried,
                attemptNumber,
                maxRetryAttempts,
                logger,
              );

              done(queueErrResp, result);
            },
          });
        },
        storeManager,
        storages.LOCAL_STORAGE,
        logger,
        (itemData: XHRQueueItemData[]): number => {
          const currentTime = getCurrentTimeFormatted();
          const events = itemData.map((queueItemData: XHRQueueItemData) => queueItemData.event);
          // type casting to string as we know that the event has already been validated prior to enqueue
          return (getBatchDeliveryPayload(events, currentTime, logger) as string)?.length;
        },
      );

      return eventsQueue;
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue RetryQueue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(
      state: ApplicationState,
      eventsQueue: IQueue,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = timestamp.getCurrentTimeFormatted();
      eventsDelivery.validateEventPayloadSize(event, logger);

      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        // To maintain event ordering while using the HTTP API as per is documentation,
        // make sure to include anonymousId as a header
        AnonymousId: string.toBase64(event.anonymousId),
      };

      eventsQueue.addItem({
        url,
        headers,
        event,
      } as XHRRetryQueueItemData);
    },
  },
});

export { XhrQueue };

export default XhrQueue;

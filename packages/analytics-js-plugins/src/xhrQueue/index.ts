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
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logMessageOnFailure,
  getRequestInfo,
  getBatchDeliveryPayload,
} from './utilities';
import type {
  DoneCallback,
  IQueue,
  QueueItemData,
  QueueProcessCallbackInfo,
} from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import type { XHRRetryQueueItemData, XHRQueueItemData } from './types';
import {
  getCurrentTimeFormatted,
  isDefined,
  isErrRetryable,
  isUndefined,
  LOCAL_STORAGE,
  toBase64,
  validateEventPayloadSize,
} from '../shared-chunks/common';

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
          qItemProcessInfo: QueueProcessCallbackInfo,
        ) => {
          const { data, url, headers } = getRequestInfo(
            itemData as XHRRetryQueueItemData,
            state,
            qItemProcessInfo,
            logger,
          );

          httpClient.getAsyncData({
            url,
            options: {
              method: 'POST',
              headers,
              data: data as string,
              sendRawData: true,
            },
            isRawResponse: true,
            timeout: REQUEST_TIMEOUT_MS,
            callback: (result, details) => {
              // If there is no error, we can consider the item as delivered
              if (isUndefined(details?.error)) {
                // null means item will not be processed further and will be removed from the queue (even from the storage)
                done(null);

                return;
              }

              const isRetryable = isErrRetryable(details?.xhr?.status ?? 0);

              logMessageOnFailure(details, isRetryable, qItemProcessInfo, logger);

              if (isRetryable) {
                let retryReason = 'client-network';
                if (details?.timedOut) {
                  retryReason = 'client-timeout';
                } else if (isDefined(details?.xhr?.status)) {
                  retryReason = `server-${details!.xhr!.status}`;
                }

                done(details, { retryReason });
              } else {
                // null means item will not be processed further and will be removed from the queue (even from the storage)
                done(null);
              }
            },
          });
        },
        storeManager,
        LOCAL_STORAGE,
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
      event.sentAt = getCurrentTimeFormatted();
      validateEventPayloadSize(event, logger);

      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
        // To maintain event ordering while using the HTTP API as per is documentation,
        // make sure to include anonymousId as a header
        AnonymousId: toBase64(event.anonymousId),
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

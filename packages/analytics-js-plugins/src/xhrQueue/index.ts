/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { getCurrentTimeFormatted, toBase64 } from '@rudderstack/analytics-js-common/index';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { isErrRetryable } from '@rudderstack/analytics-js-common/utilities/http';
import { LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import {
  getBatchDeliveryPayload,
  getDeliveryPayload,
  validateEventPayloadSize,
} from '../utilities/queue';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getRequestInfo,
} from './utilities';
import { DoneCallback, IQueue, QueueItemData } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRRetryQueueItemData, XHRQueueItemData } from './types';
import { EVENT_PAYLOAD_PREPARATION_ERROR } from '../utilities/logMessages';

const pluginName = 'XhrQueue';

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

          if (data) {
            httpClient.getAsyncData({
              url,
              options: {
                method: 'POST',
                headers,
                data,
                sendRawData: true,
              },
              isRawResponse: true,
              timeout: REQUEST_TIMEOUT_MS,
              callback: (result, details) => {
                // null means item will not be requeued
                const queueErrResp = isErrRetryable(details) ? details : null;

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
          } else {
            logger?.error(EVENT_PAYLOAD_PREPARATION_ERROR(XHR_QUEUE_PLUGIN));
            // Mark the item as done so that it can be removed from the queue
            done(null);
          }
        },
        storeManager,
        LOCAL_STORAGE,
        logger,
        (itemData: XHRQueueItemData | XHRQueueItemData[]): number => {
          if (Array.isArray(itemData)) {
            const events = itemData.map((queueItemData: XHRQueueItemData) => queueItemData.event);
            return getBatchDeliveryPayload(events, logger)?.length ?? 0;
          }
          return getDeliveryPayload(itemData.event, logger)?.length ?? 0;
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
        // TODO: why do we need this header value?
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

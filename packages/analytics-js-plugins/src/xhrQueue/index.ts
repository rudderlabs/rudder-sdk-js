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
  getFinalEventForDeliveryMutator,
  validateEventPayloadSize,
} from '../utilities/queue';
import {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getBatchDeliveryUrl,
} from './utilities';
import { DoneCallback, IQueue } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS, XHR_QUEUE_PLUGIN } from './constants';
import { XHRQueueItem } from './types';
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

      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;

      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (
          item: XHRQueueItem | XHRQueueItem[],
          done: DoneCallback,
          attemptNumber?: number,
          maxRetryAttempts?: number,
          willBeRetried?: boolean,
        ) => {
          let data;
          let headers;
          let url: string;
          if (Array.isArray(item)) {
            const finalEvents = item.map((queueItem: XHRQueueItem) =>
              getFinalEventForDeliveryMutator(queueItem.event, state),
            );
            data = getBatchDeliveryPayload(finalEvents, logger);
            headers = {
              ...item[0].headers,
            };
            url = getBatchDeliveryUrl(dataplaneUrl);
          } else {
            const { url: eventUrl, event, headers: eventHeaders } = item;
            const finalEvent = getFinalEventForDeliveryMutator(event, state);

            data = getDeliveryPayload(finalEvent);
            headers = { ...eventHeaders };
            url = eventUrl;
          }

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
        (item: XHRQueueItem | XHRQueueItem[]): number => {
          if (Array.isArray(item)) {
            const events = item.map((queueItem: XHRQueueItem) => queueItem.event);
            return getBatchDeliveryPayload(events, logger)?.length || 0;
          }
          return getDeliveryPayload(item.event, logger)?.length || 0;
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
      } as XHRQueueItem);
    },
  },
});

export { XhrQueue };

export default XhrQueue;

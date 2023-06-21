/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { XHRQueueItem } from './types';
import {
  getNormalizedQueueOptions,
  getDeliveryPayload,
  validatePayloadSize,
  getDeliveryUrl,
  getFinalEventForDelivery,
  isErrRetryable,
  logErrorOnFailure,
} from './utilities';
import {
  IStoreManager,
  ExtensionPlugin,
  ApplicationState,
  IErrorHandler,
  ILogger,
  QueueOpts,
  RudderEvent,
  IHttpClient,
} from '../types/common';
import { getCurrentTimeFormatted, toBase64 } from '../utilities/common';
import { DoneCallback, Queue } from '../utilities/retryQueue';

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
     * @returns Queue instance
     */
    init(
      state: ApplicationState,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): Queue {
      const writeKey = state.lifecycle.writeKey.value as string;
      httpClient.setAuthHeader(writeKey);

      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const eventsQueue = new Queue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (
          item: XHRQueueItem,
          done: DoneCallback,
          attemptNumber: number,
          maxRetryAttempts: number,
          willBeRetried: boolean,
        ) => {
          const { url, event, headers } = item;
          logger?.debug(`Sending ${event.type} event to data plane`);

          const finalEvent = getFinalEventForDelivery(event, state);

          const data = getDeliveryPayload(finalEvent);

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
              callback: (result, rejectionReason) => {
                // null means item will not be requeued
                const queueErrResp = isErrRetryable(rejectionReason) ? rejectionReason : null;

                logErrorOnFailure(
                  rejectionReason,
                  item,
                  willBeRetried,
                  attemptNumber,
                  maxRetryAttempts,
                  logger,
                );

                done(queueErrResp, result);
              },
            });
          } else {
            logger?.error(`Unable to prepare the event payload for delivery. It'll be dropped.`);
            // Mark the item as done so that it can be removed from the queue
            done(null);
          }
        },
        storeManager,
      );

      return eventsQueue;
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue Queue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(
      state: ApplicationState,
      eventsQueue: Queue,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = getCurrentTimeFormatted();
      validatePayloadSize(event, logger);

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

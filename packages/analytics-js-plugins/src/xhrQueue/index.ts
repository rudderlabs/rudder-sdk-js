/* eslint-disable no-param-reassign */
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { XHRQueueItem } from './types';
import {
  getNormalizedQueueOptions,
  getDeliveryPayload,
  validatePayloadSize,
  getDeliveryUrl,
} from './utilities';
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  DoneCallback,
  HttpClient,
  IErrorHandler,
  ILogger,
  QueueOpts,
  RudderEvent,
  IHttpClient,
} from '../types/common';
import { Queue, getCurrentTimeFormatted, toBase64 } from '../utilities/common';

const pluginName = PluginName.XhrQueue;

let eventsQueue: Queue;
let writeKey: string;
let dataplaneUrl: string;
let httpClient: IHttpClient;
let logger: ILogger | undefined;
let errorHandler: IErrorHandler | undefined;
let initialized = false;

const XhrQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  xhrDeliveryQueue: {
    init(state: ApplicationState, inErrorHandler?: IErrorHandler, inLogger?: ILogger): void {
      if (initialized) {
        return;
      }

      errorHandler = inErrorHandler;
      logger = inLogger;
      dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      writeKey = state.lifecycle.writeKey.value as string;

      httpClient = new HttpClient(errorHandler, logger);
      httpClient.setAuthHeader(writeKey);

      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      eventsQueue = new Queue(
        QUEUE_NAME,
        finalQOpts,
        (
          item: XHRQueueItem,
          done: DoneCallback,
          attemptNumber: number,
          maxRetryAttempts: number,
          willBeRetried: boolean,
        ) => {
          const { url, event, headers } = item;
          // Update sentAt timestamp to the latest timestamp
          event.sentAt = getCurrentTimeFormatted();
          const data = getDeliveryPayload(event);

          if (data) {
            httpClient.getAsyncData({
              url,
              options: {
                method: 'POST',
                headers,
                data,
              },
              timeout: REQUEST_TIMEOUT_MS,
              callback: result => {
                if (result !== undefined) {
                  let errMsg = `Unable to deliver event to ${url}.`;

                  if (willBeRetried) {
                    errMsg = `${errMsg} It'll be retried. Retry attempt ${attemptNumber} of ${maxRetryAttempts}.`;
                  } else {
                    errMsg = `${errMsg} Retries exhausted (${maxRetryAttempts}). It'll be dropped.`;
                  }

                  logger?.error(errMsg);

                  // failed
                  done(result);
                } else {
                  // success
                  done(null);
                }
              },
            });
          } else {
            logger?.error(`Unable to prepare event payload for delivery. It'll be dropped.`);
            // Mark the item as done so that it can be removed from the queue
            done(null);
          }
        },
      );

      initialized = true;
    },

    /**
     * Start the queue for delivery
     * @returns none
     */
    start(): void {
      if (!initialized) {
        return;
      }
      eventsQueue.start();
    },

    /**
     * Add event to the queue for delivery
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns none
     */
    enqueue(event: RudderEvent): void {
      if (!initialized) {
        return;
      }

      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = getCurrentTimeFormatted();
      validatePayloadSize(event, logger);

      const url = getDeliveryUrl(dataplaneUrl, event.type);
      // Other default headers are added by the HttpClient
      // Auth header is added during initialization
      const headers = {
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

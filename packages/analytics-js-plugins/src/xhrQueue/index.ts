/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { clone } from 'ramda';
import { QUEUE_NAME, REQUEST_TIMEOUT_MS } from './constants';
import { XHRQueueItem } from './types';
import {
  getNormalizedQueueOptions,
  getDeliveryPayload,
  validatePayloadSize,
  getDeliveryUrl,
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
  IntegrationOpts,
} from '../types/common';
import {
  getCurrentTimeFormatted,
  isUndefined,
  mergeDeepRight,
  toBase64,
} from '../utilities/common';
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
          // Update sentAt timestamp to the latest timestamp
          event.sentAt = getCurrentTimeFormatted();

          // Merge the destination specific integrations config with the event's integrations config
          // However, if any of the integrations are set to false in the event's integrations config,
          // we need to keep them as false even if they are set to true in the destination specific integrations config
          // TODO: improve this logic to make it handle other generic cases as well
          // TODO: move this into a utility function
          let finalIntgConfig = event.integrations;
          const destinationsIntgConfig = state.nativeDestinations.integrationsConfig.value;
          const unOverriddenIntgOpts = Object.keys(finalIntgConfig)
            .filter(
              intgName =>
                !(
                  !isUndefined(finalIntgConfig[intgName]) &&
                  Boolean(finalIntgConfig[intgName]) === true &&
                  destinationsIntgConfig[intgName]
                ),
            )
            .reduce((obj: IntegrationOpts, key: string) => {
              const retVal = clone(obj);
              retVal[key] = finalIntgConfig[key];
              return retVal;
            }, {});

          finalIntgConfig = mergeDeepRight(destinationsIntgConfig, unOverriddenIntgOpts);
          event.integrations = finalIntgConfig;

          const data = getDeliveryPayload(event);

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
                // TODO: use rejectionReason.hxr.status to determine retry logic
                //   v1.1 was 429 and 500 <= 600
                if (result === undefined) {
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

/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type {
  BeaconQueueOpts,
  QueueOpts,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type {
  DoneCallback,
  IQueue,
  QueueItemData,
} from '@rudderstack/analytics-js-common/utilities/retryQueue/types';
import {
  getNormalizedBeaconQueueOptions,
  getDeliveryUrl,
  getBatchDeliveryPayload,
} from './utilities';
import { eventsDelivery, time, storages } from '../shared-chunks/common';
import { BEACON_QUEUE_PLUGIN, MAX_BATCH_PAYLOAD_SIZE_BYTES, QUEUE_NAME } from './constants';
import type { BeaconQueueBatchItemData, BeaconQueueItemData } from './types';
import {
  BEACON_PLUGIN_EVENTS_QUEUE_DEBUG,
  BEACON_QUEUE_SEND_ERROR,
  BEACON_QUEUE_DELIVERY_ERROR,
} from './logMessages';
import { RetryQueue } from '../shared-chunks/retryQueue';

const pluginName = 'BeaconQueue';

const BeaconQueue = (): ExtensionPlugin => ({
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
     * @returns BeaconItemsQueue instance
     */
    init(
      state: ApplicationState,
      httpClient: IHttpClient,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): IQueue {
      const writeKey = state.lifecycle.writeKey.value as string;
      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      const url = getDeliveryUrl(dataplaneUrl, writeKey);

      const finalQOpts: BeaconQueueOpts = getNormalizedBeaconQueueOptions(
        // eslint-disable-next-line sonarjs/deprecation
        state.loadOptions.value.beaconQueueOptions ?? {},
      );

      const queueProcessCallback = (itemData: QueueItemData, done: DoneCallback) => {
        logger?.debug(BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(BEACON_QUEUE_PLUGIN));
        const currentTime = time.getCurrentTimeFormatted();
        const finalEvents = (itemData as BeaconQueueBatchItemData).map(
          (queueItemData: BeaconQueueItemData) =>
            eventsDelivery.getFinalEventForDeliveryMutator(queueItemData.event, currentTime),
        );
        const data = getBatchDeliveryPayload(finalEvents, currentTime, logger);

        if (data) {
          try {
            const isEnqueuedInBeacon = navigator.sendBeacon(url, data);
            if (!isEnqueuedInBeacon) {
              logger?.error(BEACON_QUEUE_SEND_ERROR(BEACON_QUEUE_PLUGIN));
            }

            done(null, isEnqueuedInBeacon);
          } catch (err: any) {
            errorHandler?.onError(err, BEACON_QUEUE_PLUGIN, BEACON_QUEUE_DELIVERY_ERROR(url));
            // Remove the item from queue
            done(null);
          }
        } else {
          // Mark the item as done so that it can be removed from the queue
          done(null);
        }
      };

      const eventsQueue = new RetryQueue(
        `${QUEUE_NAME}_${writeKey}`,
        {
          batch: {
            enabled: true,
            flushInterval: finalQOpts.flushQueueInterval,
            maxSize: MAX_BATCH_PAYLOAD_SIZE_BYTES, // set the hard limit
            maxItems: finalQOpts.maxItems,
          },
        } as QueueOpts,
        queueProcessCallback,
        storeManager,
        storages.LOCAL_STORAGE,
        logger,
        (itemData: QueueItemData[]): number => {
          const currentTime = time.getCurrentTimeFormatted();
          const events = (itemData as BeaconQueueBatchItemData).map(
            (queueItemData: BeaconQueueItemData) => queueItemData.event,
          );
          // type casting to Blob as we know that the event has already been validated prior to enqueue
          return (getBatchDeliveryPayload(events, currentTime, logger) as Blob).size;
        },
      );

      return eventsQueue;
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue IQueue instance
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
      event.sentAt = time.getCurrentTimeFormatted();
      eventsDelivery.validateEventPayloadSize(event, logger);

      eventsQueue.addItem({
        event,
      } as BeaconQueueItemData);
    },
  },
});

export { BeaconQueue };

export default BeaconQueue;

/* eslint-disable no-param-reassign */
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/index';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { DoneCallback, IQueue, QueueItem } from '../types/plugins';
// TODO: move this to its own utilities file to avoid network request for common bundle if it can be avoided
import { getFinalEventForDeliveryMutator, validateEventPayloadSize } from '../utilities/queue';
import { getNormalizedBeaconQueueOptions, getDeliveryUrl, getDeliveryPayload } from './utilities';
import { BeaconItemsQueue } from './BeaconItemsQueue';
import { BEACON_QUEUE_PLUGIN, QUEUE_NAME } from './constants';
import { BeaconQueueItem } from './types';

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
        state.loadOptions.value.beaconQueueOptions ?? {},
      );

      const queueProcessCallback = (
        queueItems: QueueItem<BeaconQueueItem>[],
        done: DoneCallback,
      ) => {
        logger?.debug(`${BEACON_QUEUE_PLUGIN}:: Sending events to data plane.`);
        const finalEvents = queueItems.map(queueItem =>
          getFinalEventForDeliveryMutator(queueItem.item.event, state),
        );
        const data = getDeliveryPayload(finalEvents);

        if (data) {
          try {
            const isEnqueuedInBeacon = navigator.sendBeacon(url, data);
            if (!isEnqueuedInBeacon) {
              logger?.error(
                `${BEACON_QUEUE_PLUGIN}:: Failed to send events batch data to the browser's beacon queue. The events will be dropped.`,
              );
            }

            done(null, isEnqueuedInBeacon);
          } catch (e) {
            (
              e as Error
            ).message = `An error occurred while sending events batch data to beacon queue for ${url}: ${
              (e as Error).message
            }`;
            done(e);
          }
        } else {
          logger?.error(
            `${BEACON_QUEUE_PLUGIN}:: Failed to prepare the events batch payload for delivery. The events will be dropped.`,
          );
          // Mark the item as done so that it can be removed from the queue
          done(null);
        }
      };

      const eventsQueue = new BeaconItemsQueue(
        `${QUEUE_NAME}_${writeKey}}`,
        finalQOpts,
        queueProcessCallback,
        storeManager,
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
      event.sentAt = getCurrentTimeFormatted();
      validateEventPayloadSize(event, logger);

      eventsQueue.addItem({
        event,
      } as BeaconQueueItem);
    },
  },
});

export { BeaconQueue };

export default BeaconQueue;

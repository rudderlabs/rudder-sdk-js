import {
  getNormalizedBeaconQueueOptions,
  getDeliveryUrl,
  getBatchDeliveryPayload,
} from './utilities';
import { eventsDelivery, timestamp, storages } from '../shared-chunks/common';
import { BEACON_QUEUE_PLUGIN, MAX_BATCH_PAYLOAD_SIZE_BYTES, QUEUE_NAME } from './constants';
import {
  BEACON_PLUGIN_EVENTS_QUEUE_DEBUG,
  BEACON_QUEUE_SEND_ERROR,
  BEACON_QUEUE_DELIVERY_ERROR,
} from './logMessages';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
const pluginName = 'BeaconQueue';
const BeaconQueue = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
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
    init(state, httpClient, storeManager, errorHandler, logger) {
      var _a;
      const writeKey = state.lifecycle.writeKey.value;
      const dataplaneUrl = state.lifecycle.activeDataplaneUrl.value;
      const url = getDeliveryUrl(dataplaneUrl, writeKey);
      const finalQOpts = getNormalizedBeaconQueueOptions(
        (_a = state.loadOptions.value.beaconQueueOptions) !== null && _a !== void 0 ? _a : {},
      );
      const queueProcessCallback = (itemData, done) => {
        logger === null || logger === void 0
          ? void 0
          : logger.debug(BEACON_PLUGIN_EVENTS_QUEUE_DEBUG(BEACON_QUEUE_PLUGIN));
        const finalEvents = itemData.map(queueItemData =>
          eventsDelivery.getFinalEventForDeliveryMutator(queueItemData.event),
        );
        const data = getBatchDeliveryPayload(finalEvents, logger);
        if (data) {
          try {
            const isEnqueuedInBeacon = navigator.sendBeacon(url, data);
            if (!isEnqueuedInBeacon) {
              logger === null || logger === void 0
                ? void 0
                : logger.error(BEACON_QUEUE_SEND_ERROR(BEACON_QUEUE_PLUGIN));
            }
            done(null, isEnqueuedInBeacon);
          } catch (err) {
            errorHandler === null || errorHandler === void 0
              ? void 0
              : errorHandler.onError(err, BEACON_QUEUE_PLUGIN, BEACON_QUEUE_DELIVERY_ERROR(url));
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
            maxSize: MAX_BATCH_PAYLOAD_SIZE_BYTES,
            maxItems: finalQOpts.maxItems,
          },
        },
        queueProcessCallback,
        storeManager,
        storages.LOCAL_STORAGE,
        logger,
        itemData => {
          const events = itemData.map(queueItemData => queueItemData.event);
          // type casting to Blob as we know that the event has already been validated prior to enqueue
          return getBatchDeliveryPayload(events, logger).size;
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
    enqueue(state, eventsQueue, event, errorHandler, logger) {
      // sentAt is only added here for the validation step
      // It'll be updated to the latest timestamp during actual delivery
      event.sentAt = timestamp.getCurrentTimeFormatted();
      eventsDelivery.validateEventPayloadSize(event, logger);
      eventsQueue.addItem({
        event,
      });
    },
  },
});
export { BeaconQueue };
export default BeaconQueue;

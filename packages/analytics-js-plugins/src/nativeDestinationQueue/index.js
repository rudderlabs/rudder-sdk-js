import { clone } from 'ramda';
import { storages } from '../shared-chunks/common';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination } from './utilities';
import { NATIVE_DESTINATION_QUEUE_PLUGIN, QUEUE_NAME } from './constants';
import { DESTINATION_EVENT_FILTERING_WARNING } from './logMessages';
import { destinationUtils } from '../shared-chunks/deviceModeDestinations';
const pluginName = 'NativeDestinationQueue';
const NativeDestinationQueue = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  destinationsEventsQueue: {
    /**
     * Initialize the queue for delivery to destinations
     * @param state Application state
     * @param pluginsManager PluginsManager instance
     * @param storeManager StoreManager instance
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns IQueue instance
     */
    init(state, pluginsManager, storeManager, dmtQueue, errorHandler, logger) {
      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.destinationsQueueOptions,
      );
      const writeKey = state.lifecycle.writeKey.value;
      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (rudderEvent, done) => {
          const destinationsToSend = destinationUtils.filterDestinations(
            rudderEvent.integrations,
            state.nativeDestinations.initializedDestinations.value,
          );
          // list of destinations which are enable for DMT
          const destWithTransformationEnabled = [];
          const clonedRudderEvent = clone(rudderEvent);
          destinationsToSend.forEach(dest => {
            const sendEvent = !isEventDenyListed(
              clonedRudderEvent.type,
              clonedRudderEvent.event,
              dest,
            );
            if (!sendEvent) {
              logger === null || logger === void 0
                ? void 0
                : logger.warn(
                    DESTINATION_EVENT_FILTERING_WARNING(
                      NATIVE_DESTINATION_QUEUE_PLUGIN,
                      clonedRudderEvent.event,
                      dest.userFriendlyId,
                    ),
                  );
              return;
            }
            if (dest.shouldApplyDeviceModeTransformation) {
              destWithTransformationEnabled.push(dest);
            } else {
              sendEventToDestination(clonedRudderEvent, dest, errorHandler, logger);
            }
          });
          if (destWithTransformationEnabled.length > 0) {
            pluginsManager.invokeSingle(
              'transformEvent.enqueue',
              state,
              dmtQueue,
              clonedRudderEvent,
              destWithTransformationEnabled,
              errorHandler,
              logger,
            );
          }
          // Mark success always
          done(null);
        },
        storeManager,
        storages.MEMORY_STORAGE,
      );
      // TODO: This seems to not work as expected. Need to investigate
      // effect(() => {
      //   if (state.nativeDestinations.clientDestinationsReady.value === true) {
      //     eventsQueue.start();
      //   }
      // });
      return eventsQueue;
    },
    /**
     * Add event to the queue for delivery to destinations
     * @param state Application state
     * @param eventsQueue IQueue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(state, eventsQueue, event, errorHandler, logger) {
      eventsQueue.addItem(event);
    },
    /**
     * This extension point is used to directly send the transformed event to the destination
     * @param state Application state
     * @param event RudderEvent Object
     * @param destination Destination Object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     */
    enqueueEventToDestination(state, event, destination, errorHandler, logger) {
      sendEventToDestination(event, destination, errorHandler, logger);
    },
  },
});
export { NativeDestinationQueue };
export default NativeDestinationQueue;

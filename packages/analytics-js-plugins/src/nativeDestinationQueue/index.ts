/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { clone } from 'ramda';
import { DoneCallback, IQueue } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination } from './utilities';
import { NATIVE_DESTINATION_QUEUE_PLUGIN, QUEUE_NAME } from './constants';
import { DESTINATION_EVENT_FILTERING_WARNING } from '../utilities/logMessages';
import { filterDestinations } from '../utilities/destination';

const pluginName = 'NativeDestinationQueue';

const NativeDestinationQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
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
    init(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      storeManager: IStoreManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): IQueue {
      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.destinationsQueueOptions as QueueOpts,
      );

      const writeKey = state.lifecycle.writeKey.value as string;
      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (rudderEvent: RudderEvent, done: DoneCallback) => {
          const destinationsToSend = filterDestinations(
            rudderEvent.integrations,
            state.nativeDestinations.initializedDestinations.value,
          );

          destinationsToSend.forEach((dest: Destination) => {
            const clonedRudderEvent = clone(rudderEvent);
            const sendEvent = !isEventDenyListed(
              clonedRudderEvent.type,
              clonedRudderEvent.event,
              dest,
            );
            if (!sendEvent) {
              logger?.warn(
                DESTINATION_EVENT_FILTERING_WARNING(
                  NATIVE_DESTINATION_QUEUE_PLUGIN,
                  clonedRudderEvent.event,
                  dest.userFriendlyId,
                ),
              );
              return;
            }

            if (dest.shouldApplyDeviceModeTransformation) {
              pluginsManager.invokeSingle(
                'transformEvent.enqueue',
                state,
                clonedRudderEvent,
                dest,
                logger,
              );
            } else {
              sendEventToDestination(clonedRudderEvent, dest, errorHandler, logger);
            }
          });

          // Mark success always
          done(null);
        },
        storeManager,
        MEMORY_STORAGE,
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
    enqueue(
      state: ApplicationState,
      eventsQueue: IQueue,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
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

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
import { DoneCallback, IQueue } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination } from './utilities';
import { NATIVE_DESTINATION_QUEUE_PLUGIN, QUEUE_NAME } from './constants';
import { filterDestinations, normalizeIntegrationOptions } from '../deviceModeDestinations/utils';

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
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const writeKey = state.lifecycle.writeKey.value as string;
      const eventsQueue = new RetryQueue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (item: RudderEvent, done: DoneCallback) => {
          const destinationsToSend = filterDestinations(
            item.integrations,
            state.nativeDestinations.initializedDestinations.value,
          );

          destinationsToSend.forEach((dest: Destination) => {
            const sendEvent = !isEventDenyListed(item.type, item.event, dest);
            if (!sendEvent) {
              logger?.warn(
                `${NATIVE_DESTINATION_QUEUE_PLUGIN}:: The "${item.event}" track event has been filtered for the "${dest.userFriendlyId}" destination.`,
              );
              return;
            }

            if (dest.enableTransformationForDeviceMode) {
              pluginsManager.invokeSingle('transformEvent.enqueue', state, item, dest, logger);
            } else {
              sendEventToDestination(item, dest, errorHandler, logger);
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
      event.integrations = normalizeIntegrationOptions(event.integrations);
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

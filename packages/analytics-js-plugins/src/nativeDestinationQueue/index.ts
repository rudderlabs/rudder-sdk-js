/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  IPluginsManager,
  PluginName,
} from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { clone } from 'ramda';
import type { DoneCallback, IQueue } from '../types/plugins';
import { RetryQueue } from '../utilities/retryQueue/RetryQueue';
import {
  getNormalizedQueueOptions,
  isEventDenyListed,
  sendEventToDestination,
  shouldApplyTransformation,
} from './utilities';
import { NATIVE_DESTINATION_QUEUE_PLUGIN, QUEUE_NAME } from './constants';
import { DESTINATION_EVENT_FILTERING_WARNING } from './logMessages';
import { MEMORY_STORAGE } from '../shared-chunks/common';
import { filterDestinations } from '../shared-chunks/deviceModeDestinations';

const pluginName: PluginName = 'NativeDestinationQueue';

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
      dmtQueue: IQueue,
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

          // list of destinations which are enable for DMT
          const destWithTransformationEnabled: Destination[] = [];
          const clonedRudderEvent = clone(rudderEvent);

          destinationsToSend.forEach((dest: Destination) => {
            try {
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

              if (shouldApplyTransformation(dest)) {
                destWithTransformationEnabled.push(dest);
              } else {
                sendEventToDestination(clonedRudderEvent, dest, errorHandler, logger);
              }
            } catch (e) {
              errorHandler?.onError({
                error: e,
                context: NATIVE_DESTINATION_QUEUE_PLUGIN,
              });
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

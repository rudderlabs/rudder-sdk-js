/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { Queue, DoneCallback } from '@rudderstack/analytics-js-plugins/utilities/retryQueue';
import {
  ExtensionPlugin,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  IErrorHandler,
  ILogger,
  Destination,
  IPluginsManager,
} from '../types/common';
import { QUEUE_NAME } from './constants';
import { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination } from './utilities';
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
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns Queue instance
     */
    init(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): Queue {
      const finalQOpts = getNormalizedQueueOptions(
        state.loadOptions.value.queueOptions as QueueOpts,
      );

      const writeKey = state.lifecycle.writeKey.value as string;
      const eventsQueue = new Queue(
        // adding write key to the queue name to avoid conflicts
        `${QUEUE_NAME}_${writeKey}`,
        finalQOpts,
        (item: RudderEvent, done: DoneCallback) => {
          logger?.debug(`Forwarding ${item.type} event to destinations`);
          const destinationsToSend = filterDestinations(
            item.integrations,
            state.nativeDestinations.initializedDestinations.value,
          );

          destinationsToSend.forEach((dest: Destination) => {
            const sendEvent = !isEventDenyListed(item.event, dest);
            if (!sendEvent) {
              logger?.debug(
                `"${item.event}" event is denylisted for destination: ${dest.userFriendlyId}`,
              );
              return;
            }

            if (dest.areTransformationsConnected) {
              pluginsManager.invokeSingle('transformEvent.enqueue', state, item, dest, logger);
            } else {
              sendEventToDestination(item, dest, errorHandler, logger);
            }
          });

          // Mark success always
          done(null);
        },
        'memoryStorage',
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

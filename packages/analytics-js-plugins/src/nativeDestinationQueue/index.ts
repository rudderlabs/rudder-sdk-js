/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { effect } from '@preact/signals-core';
import { Queue, DoneCallback } from '@rudderstack/analytics-js-plugins/utilities/retryQueue';
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  IErrorHandler,
  ILogger,
  Destination,
} from '../types/common';
import { QUEUE_NAME } from './constants';
import { getNormalizedQueueOptions } from './utilities';

const pluginName = PluginName.NativeDestinationQueue;

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
    init(state: ApplicationState, errorHandler?: IErrorHandler, logger?: ILogger): Queue {
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
          state.nativeDestinations.initializedDestinations.value.forEach((dest: Destination) => {
            const methodName = item.type.toString();
            try {
              // Destinations expect the event to be wrapped under the `message` key
              // This will remain until we update the destinations to accept the event directly
              dest.instance?.[methodName]?.({ message: item });
            } catch (err) {
              errorHandler?.onError(
                err,
                'NativeDestinationQueue',
                `Error in forwarding event to destination: ${dest.displayName}, ID: ${dest.id}`,
              );
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
      // TODO: Process the event via DMT

      // TODO: Filter events based on destination settings
      eventsQueue.addItem(event);
    },
  },
});

export { NativeDestinationQueue };

export default NativeDestinationQueue;

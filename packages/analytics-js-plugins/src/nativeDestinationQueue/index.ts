/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  IErrorHandler,
  DoneCallback,
  ILogger,
  DeviceModeDestination,
} from '../types/common';
import { Queue, getCurrentTimeFormatted } from '../utilities/common';
import { QUEUE_NAME } from './constants';
import { XHRQueueItem } from '../xhrQueue/types';
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

      const eventsQueue = new Queue(
        QUEUE_NAME,
        finalQOpts,
        (item: RudderEvent, done: DoneCallback) => {
          // TODO: Forward the call to individual destinations
          Object.keys(state.nativeDestinations.initializedDestinations.value).forEach(
            (destId: string) => {
              const destInstance = state.nativeDestinations.initializedDestinations.value[destId];
              const methodName = item.type.toString();
              try {
                destInstance[methodName]?.(item);
              } catch (err) {
                errorHandler?.onError(
                  err,
                  'NativeDestinationQueue',
                  `Error in forwarding event to destination: ${destInstance.name}`,
                );
              }
            },
          );

          // Mark success always
          done(null);
        },
      );

      // TODO: Start queue only when all the integrations are loaded
      eventsQueue.start();
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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  BufferQueue,
  IErrorHandler,
  DoneCallback,
  ILogger,
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

          // Mark success always
          done(null);
        },
      );

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

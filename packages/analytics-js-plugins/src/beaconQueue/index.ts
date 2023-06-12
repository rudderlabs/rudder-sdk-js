/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  ApplicationState,
  ILogger,
  IErrorHandler,
  RudderEvent,
} from '../types/common';

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
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     */
    init(state: ApplicationState, errorHandler?: IErrorHandler, logger?: ILogger): void {
      // TODO: Implement this
      // TODO: Remove this console log
      logger?.log('Queue initialized and started');
    },

    /**
     * Add event to the queue for delivery
     * @param state Application state
     * @param eventsQueue Queue instance
     * @param event RudderEvent object
     * @param errorHandler Error handler instance
     * @param logger Logger instance
     * @returns none
     */
    enqueue(
      state: ApplicationState,
      eventsQueue: any,
      event: RudderEvent,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      // TODO: Implement this
      // TODO: Remove this console log
      logger?.log('Item enqueued', event);
    },
  },
});

export { BeaconQueue };

export default BeaconQueue;

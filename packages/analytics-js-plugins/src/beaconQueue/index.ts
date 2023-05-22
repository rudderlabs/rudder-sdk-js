/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState, ILogger, IErrorHandler, RudderEvent } from '../types/common';

const pluginName = PluginName.BeaconQueue;

let writeKey: string;
let dataplaneUrl: string;
let logger: ILogger | undefined;
let errorHandler: IErrorHandler | undefined;
let initialized = false;

const BeaconQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  beaconDeliveryQueue: {
    init(state: ApplicationState, inErrorHandler?: IErrorHandler, inLogger?: ILogger): void {
      if (initialized) {
        return;
      }

      errorHandler = inErrorHandler;
      logger = inLogger;
      dataplaneUrl = state.lifecycle.activeDataplaneUrl.value as string;
      writeKey = state.lifecycle.writeKey.value as string;

      // TODO: Implement this

      initialized = true;
    },

    /**
     * Start the queue for delivery
     * @returns none
     */
    start(): void {
      if (!initialized) {
        return;
      }
      
      // TODO: Implement this
      // TODO: Remove this console log
      console.log('Queue started');
    },

    /**
     * Add event to the queue for delivery
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns none
     */
    enqueue(event: RudderEvent): void {
      if (!initialized) {
        return;
      }

      // TODO: Implement this
      // TODO: Remove this console log
      console.log('Item enqueued', event);
    },
  },
});

export { BeaconQueue };

export default BeaconQueue;

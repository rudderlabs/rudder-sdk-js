/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  RudderEvent,
  ILogger,
  IPluginsManager,
  IErrorHandler
} from '../types/common';

const pluginName = PluginName.DataplaneEventsQueue;

let pluginsManager: IPluginsManager;
let logger: ILogger | undefined;
let errorHandler: IErrorHandler | undefined;
let initialized = false;
let extPrefix: string;

const DataplaneEventsQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    init(state: ApplicationState, inPluginsManager: IPluginsManager, inErrorHandler?: IErrorHandler, inLogger?: ILogger): void {
      if (initialized) {
        return;
      }

      pluginsManager = inPluginsManager;
      logger = inLogger;
      errorHandler = inErrorHandler;

      if (state.loadOptions.value.queueOptions) {
        extPrefix = 'xhrDeliveryQueue';
      } else if (state.loadOptions.value.beaconQueueOptions) {
        extPrefix = 'beaconDeliveryQueue';
      }

      if (extPrefix) {
        pluginsManager.invokeSingle(`${extPrefix}.init`, state, errorHandler, logger);
      }

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

      pluginsManager.invokeSingle(`${extPrefix}.start`);
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

      pluginsManager.invokeSingle(`${extPrefix}.enqueue`, event);
    },
  },
});

export { DataplaneEventsQueue };

export default DataplaneEventsQueue;

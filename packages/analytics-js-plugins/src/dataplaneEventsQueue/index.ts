/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  RudderEvent,
  ILogger,
  IPluginsManager
} from '../types/common';

const pluginName = PluginName.DataplaneEventsQueue;

let pluginsManager: IPluginsManager;
let initialized = false;

const DataplaneEventsQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    init(inPluginsManager: IPluginsManager, state: ApplicationState): void {
      if (initialized) {
        return;
      }

      pluginsManager = inPluginsManager;

      // TODO: Based on state initialize only the required plugin
      pluginsManager.invokeSingle('xhrDeliveryQueue', 'init', state);

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

      pluginsManager.invokeSingle('xhrDeliveryQueue', 'start');
    },

    /**
     * Add event to the queue for delivery
     * @param event RudderEvent object
     * @param logger Logger instance
     * @returns none
     */
    enqueue(event: RudderEvent, logger?: ILogger): void {
      if (!initialized) {
        return;
      }

      pluginsManager.invokeSingle('xhrDeliveryQueue', 'enqueue', event, logger);
    },
  },
});

export { DataplaneEventsQueue };

export default DataplaneEventsQueue;

/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent
} from "../types/common";

const pluginName = PluginName.NativeDestinationQueue;

const NativeDestinationQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  destinationsEventsQueue: {
    init(queueOpts: QueueOpts): void {
      console.log(`Destinations Events Queue: Initialized with queueOpts: ${queueOpts}`);
    },
    start(): void {
      console.log('Destinations Events Queue: Started');
    },
    enqueue(event: RudderEvent): void {
      console.log(`Destinations Events Queue: Enqueued event: ${event}`);
    },
  },
});

export { NativeDestinationQueue };

export default NativeDestinationQueue;


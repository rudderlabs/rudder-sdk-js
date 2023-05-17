import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  QueueOpts,
  RudderEvent,
  ILogger
} from "../types/common";
import { validatePayloadSize } from './utilities';

const pluginName = PluginName.DataplaneEventsQueue;

const DataplaneEventsQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  dataplaneEventsQueue: {
    init(writeKey: string, dataplaneUrl: string, queueOpts: QueueOpts): void {
      console.log(
        `Dataplane Events Queue: Initialized with writeKey: ${writeKey}, dataplaneUrl: ${dataplaneUrl}, queueOpts: ${queueOpts}`,
      );
    },
    start(): void {
      console.log('Dataplane Events Queue: Started');
    },
    enqueue(event: RudderEvent, logger?: ILogger): void {
      // TODO: Append `sentAt` field before computing payload size
      validatePayloadSize(event, logger);
      console.log(`Dataplane Events Queue: Enqueued event: ${event}`);
    },
  },
});

export { DataplaneEventsQueue };

export default DataplaneEventsQueue;

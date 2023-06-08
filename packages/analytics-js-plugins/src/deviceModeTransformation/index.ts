/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  Destination,
  IErrorHandler,
  ILogger,
  IPluginsManager,
  RudderEvent,
} from '../types/common';

const pluginName = PluginName.DeviceModeTransformation;

const DeviceModeTransformation = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  transformEvent: {
    enqueue(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      event: RudderEvent,
      destination: Destination,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ) {
      // TODO: Implement DMT logic here

      // TODO: for now this is a pass through
      pluginsManager.invokeSingle(
        'destinationsEventsQueue.enqueueEventToDestination',
        state,
        event,
        destination,
        errorHandler,
        logger,
      );
    },
  },
});

export { DeviceModeTransformation };

export default DeviceModeTransformation;

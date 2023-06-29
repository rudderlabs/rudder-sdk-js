/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/common/types/PluginsManager';
import { RudderEvent } from '@rudderstack/common/types/Event';
import { Destination } from '@rudderstack/common/types/Destination';
import { IErrorHandler } from '@rudderstack/common/types/ErrorHandler';
import { ILogger } from '@rudderstack/common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/common/types/PluginEngine';

const pluginName = 'DeviceModeTransformation';

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

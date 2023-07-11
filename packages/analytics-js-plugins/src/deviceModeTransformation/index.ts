/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';

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

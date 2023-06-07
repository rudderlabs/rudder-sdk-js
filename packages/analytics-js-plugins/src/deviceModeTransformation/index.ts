/* eslint-disable no-param-reassign */
import { ExtensionPlugin, ApplicationState } from '../types/common';

const pluginName = 'DeviceModeTransformation';

const DeviceModeTransformation = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { DeviceModeTransformation };

export default DeviceModeTransformation;

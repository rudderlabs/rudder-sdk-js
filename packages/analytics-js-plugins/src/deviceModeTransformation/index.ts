/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState } from '../types/common';

const pluginName = PluginName.DeviceModeTransformation;

const DeviceModeTransformation = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { DeviceModeTransformation };

export default DeviceModeTransformation;

/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState } from '../types/common';

const pluginName = PluginName.XhrQueue;

const XhrQueue = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { XhrQueue };

export default XhrQueue;

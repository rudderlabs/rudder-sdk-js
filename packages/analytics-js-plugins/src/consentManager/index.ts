/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState } from '../types/common';

const pluginName = PluginName.ConsentManager;

const ConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { ConsentManager };

export default ConsentManager;

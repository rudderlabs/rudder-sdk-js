/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState } from '../types/common';

const pluginName = PluginName.ErrorReporting;

const ErrorReporting = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { ErrorReporting };

export default ErrorReporting;

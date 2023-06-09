/* eslint-disable no-param-reassign */
import { ExtensionPlugin, ApplicationState } from '../types/common';

const pluginName = 'ErrorReporting';

const ErrorReporting = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { ErrorReporting };

export default ErrorReporting;

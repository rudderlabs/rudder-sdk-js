/* eslint-disable no-param-reassign */
import { ExtensionPlugin, ApplicationState } from '../types/common';

const pluginName = 'BeaconQueue';

const Bugsnag = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
});

export { Bugsnag };

export default Bugsnag;

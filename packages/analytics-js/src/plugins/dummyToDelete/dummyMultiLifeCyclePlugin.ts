import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { ApplicationState } from '@rudderstack/analytics-js/state';

const pluginName = 'dummyMultiLifeCyclePlugin';

const dummyMultiLifeCyclePlugin = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  init: {
    pre(configData: any, state: any) {
      console.log(`init.pre lifecycle event: ${JSON.stringify(state.config.value)}`);
      state.config.value = configData;
    },
    post(state: any) {
      console.log(`init.post lifecycle event: ${JSON.stringify(state.config.value)}`);
    },
  },
  ready: {
    post() {
      console.log(`ready.post lifecycle event`);
      defaultPluginEngine.invoke('ready.insidePlugin');
    },
    insidePlugin() {
      console.log(`ready.insidePlugin lifecycle event`);
    },
  },
});

export { dummyMultiLifeCyclePlugin };

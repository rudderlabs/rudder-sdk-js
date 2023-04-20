import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { ApplicationState } from '@rudderstack/analytics-js/state';

const pluginName = 'localTest3';

const localTest3 = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  localMutate: {
    test(data: any[]) {
      data.push('item from local plugin 3');
    },
  },
});

export { localTest3 };

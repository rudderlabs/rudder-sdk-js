import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { ApplicationState } from '@rudderstack/analytics-js/state';

const pluginName = 'localTest2';

const localTest2 = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  local: {
    test(data: any[]): any[] {
      const newData = [...data];
      newData.push('item from local plugin 2');

      return newData;
    },
  },
});

export { localTest2 };

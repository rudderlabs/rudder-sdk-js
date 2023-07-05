/* eslint-disable no-param-reassign */
import { ApplicationState } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';

const pluginName = 'StorageMigrator';

const StorageMigrator = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    migrate(value: any): string {
      // TODO: Add migration logic here
      return value;
    },
  },
});

export { StorageMigrator };

export default StorageMigrator;

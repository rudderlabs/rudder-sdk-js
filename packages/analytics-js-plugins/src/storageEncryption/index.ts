/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { encryption } from '../shared-chunks/common';

const pluginName: PluginName = 'StorageEncryption';

const StorageEncryption = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return encryption.encrypt(value);
    },
    decrypt(value: string): string {
      return encryption.decrypt(value);
    },
  },
});

export { StorageEncryption };

export default StorageEncryption;

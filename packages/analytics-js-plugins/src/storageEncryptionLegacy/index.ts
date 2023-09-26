/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { decrypt, encrypt } from './legacyEncryptionUtils';

const pluginName: PluginName = 'StorageEncryptionLegacy';

const StorageEncryptionLegacy = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return encrypt(value);
    },
    decrypt(value: string): string {
      return decrypt(value);
    },
  },
});

export { StorageEncryptionLegacy };

export default StorageEncryptionLegacy;

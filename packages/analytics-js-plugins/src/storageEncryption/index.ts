/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { encryptionUtils } from '../shared-chunks';

const pluginName = 'StorageEncryption';

const StorageEncryption = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return encryptionUtils.encrypt(value);
    },
    decrypt(value: string): string {
      return encryptionUtils.decrypt(value);
    },
  },
});

export { StorageEncryption };

export default StorageEncryption;

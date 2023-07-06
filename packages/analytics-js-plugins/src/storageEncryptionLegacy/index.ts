/* eslint-disable no-param-reassign */
import { ApplicationState } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { decrypt, encrypt } from './legacyEncryptionUtils';

const pluginName = 'StorageEncryptionLegacy';

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

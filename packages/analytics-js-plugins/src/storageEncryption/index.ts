/* eslint-disable no-param-reassign */
import { ApplicationState } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { decrypt, encrypt } from './encryptionUtils';

const pluginName = 'StorageEncryption';

const StorageEncryption = (): ExtensionPlugin => ({
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

export { StorageEncryption };

export default StorageEncryption;

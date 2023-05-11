/* eslint-disable no-param-reassign */
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ExtensionPlugin, PluginName, ApplicationState } from '../types/common';
import { ENCRYPTION_KEY_V1, ENCRYPTION_PREFIX_V1 } from './constants';

const pluginName = PluginName.StorageEncryptionLegacy;

// TODO: Migrate the existing encryption to new one
const StorageEncryptionLegacy = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return `${ENCRYPTION_PREFIX_V1}${AES.encrypt(value, ENCRYPTION_KEY_V1).toString()}`;
    },
    decrypt(value: string): string {
      if (value.startsWith(ENCRYPTION_PREFIX_V1)) {
        return AES.decrypt(
          value.substring(ENCRYPTION_PREFIX_V1.length),
          ENCRYPTION_KEY_V1,
        ).toString(Utf8);
      }

      return value;
    },
  },
});

export { StorageEncryptionLegacy };

export default StorageEncryptionLegacy;

/* eslint-disable no-param-reassign */
import { ApplicationState } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { fromBase64, toBase64 } from '../utilities/common';
import { ENCRYPTION_PREFIX_V3 } from './constants';

const pluginName = 'StorageEncryption';

const StorageEncryption = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;
    },
    decrypt(value: string): string {
      if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
        return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
      }

      return value;
    },
  },
});

export { StorageEncryption };

export default StorageEncryption;

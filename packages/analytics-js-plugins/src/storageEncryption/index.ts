/* eslint-disable no-param-reassign */
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ApplicationState } from '@rudderstack/common/types/common';
import { ExtensionPlugin } from '../types/plugins';
import { ENCRYPTION_KEY_V3, ENCRYPTION_PREFIX_V3 } from './constants';

const pluginName = 'StorageEncryption';

// TODO: create the encryption with new npm package
const StorageEncryption = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value: any): string {
      return `${ENCRYPTION_PREFIX_V3}${AES.encrypt(value, ENCRYPTION_KEY_V3).toString()}`;
    },
    decrypt(value: string): string {
      if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
        return AES.decrypt(
          value.substring(ENCRYPTION_PREFIX_V3.length),
          ENCRYPTION_KEY_V3,
        ).toString(Utf8);
      }

      return value;
    },
  },
});

export { StorageEncryption };

export default StorageEncryption;

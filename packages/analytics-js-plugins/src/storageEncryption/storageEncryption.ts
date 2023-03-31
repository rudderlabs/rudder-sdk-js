import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ENCRYPTION_KEY_V3, ENCRYPTION_PREFIX_V3 } from './constants';

// TODO: create the encryption with new npm package
const storageEncryption = (): ExtensionPlugin => ({
  name: 'storageEncryption',
  storage: {
    encrypt(value: any): string {
      return `${ENCRYPTION_PREFIX_V3}${AES.encrypt(value, ENCRYPTION_KEY_V3).toString()}`;
    },
    decrypt(value: string): string {
      if (value.substring(0, ENCRYPTION_PREFIX_V3.length) === ENCRYPTION_PREFIX_V3) {
        return AES.decrypt(
          value.substring(ENCRYPTION_PREFIX_V3.length),
          ENCRYPTION_KEY_V3,
        ).toString(Utf8);
      }

      return value;
    },
  },
});

export { storageEncryption };

export default storageEncryption;

import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ExtensionPlugin } from '@rudderstack/analytics-js-plugins/types/common';
import { ENCRYPTION_KEY_V1, ENCRYPTION_PREFIX_V1 } from './constants';

// TODO: Migrate the existing encryption to new one
const storageEncryptionV1 = (): ExtensionPlugin => ({
  name: 'storageEncryptionV1',
  storage: {
    encrypt(value: any): string {
      return `${ENCRYPTION_PREFIX_V1}${AES.encrypt(value, ENCRYPTION_KEY_V1).toString()}`;
    },
    decrypt(value: string): string {
      if (value.substring(0, ENCRYPTION_PREFIX_V1.length) === ENCRYPTION_PREFIX_V1) {
        return AES.decrypt(
          value.substring(ENCRYPTION_PREFIX_V1.length),
          ENCRYPTION_KEY_V1,
        ).toString(Utf8);
      }

      if (value.substring(0, ENCRYPTION_PREFIX_V1.length) === ENCRYPTION_PREFIX_V1) {
        return AES.decrypt(
          value.substring(ENCRYPTION_PREFIX_V1.length),
          ENCRYPTION_KEY_V1,
        ).toString(Utf8);
      }

      return value;
    },
  },
});

export { storageEncryptionV1 };

export default storageEncryptionV1;

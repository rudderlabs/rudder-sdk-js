import { AES } from 'crypto-es/lib/aes';
import { Utf8 } from 'crypto-es/lib/core';
import { ENCRYPTION_PREFIX_V1, ENCRYPTION_KEY_V1 } from './constants';

const encrypt = (value: string): string =>
  `${ENCRYPTION_PREFIX_V1}${AES.encrypt(value, ENCRYPTION_KEY_V1).toString()}`;

const decrypt = (value: string): string => {
  if (value.startsWith(ENCRYPTION_PREFIX_V1)) {
    return AES.decrypt(value.substring(ENCRYPTION_PREFIX_V1.length), ENCRYPTION_KEY_V1).toString(
      Utf8,
    );
  }

  return value;
};

export { encrypt, decrypt };

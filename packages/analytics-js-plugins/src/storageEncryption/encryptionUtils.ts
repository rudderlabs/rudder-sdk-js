import { ENCRYPTION_PREFIX_V3 } from './constants';
import { toBase64, fromBase64 } from '../utilities/common';

const encrypt = (value: string): string => `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;

const decrypt = (value: string): string => {
  if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
    return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }

  return value;
};

export { encrypt, decrypt };

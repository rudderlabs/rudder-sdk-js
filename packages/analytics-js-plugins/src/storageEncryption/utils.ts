import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { ENCRYPTION_KEY_V1, ENCRYPTION_PREFIX_V1 } from './constants';

const legacyDecrypt = (value: string): string =>
  AES.decrypt(value.substring(ENCRYPTION_PREFIX_V1.length), ENCRYPTION_KEY_V1).toString(Utf8);

export { legacyDecrypt };

import { string } from '../shared-chunks/eventsDelivery';
import { ENCRYPTION_PREFIX_V3 } from './constants';

const encrypt = (value: string): string => `${ENCRYPTION_PREFIX_V3}${string.toBase64(value)}`;

const decrypt = (value: string): string => {
  if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
    return string.fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }

  return value;
};

export { encrypt, decrypt };

import { fromBase64, toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { ENCRYPTION_PREFIX_V3 } from './constants';
const encrypt = value => `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;
const decrypt = value => {
  if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
    return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }
  return value;
};
export { encrypt, decrypt };

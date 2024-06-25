import { fromBase64, toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { COOKIE_KEYS, ENCRYPTION_PREFIX_V3 } from './constants/cookies';
import { cookie } from './component-cookie';

const encrypt = (value: string): string => `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;

const decrypt = (value: string): string => {
  if (value.startsWith(ENCRYPTION_PREFIX_V3)) {
    return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }

  return value;
};

const getDecryptedCookie = (cookieKey: string): Nullable<string | ApiObject> => {
  const fallbackValue = null;
  try {
    if (Object.values(COOKIE_KEYS).includes(cookieKey)) {
      const decryptedVal = decrypt(cookie(cookieKey));

      if (isNullOrUndefined(decryptedVal)) {
        return fallbackValue;
      }

      return JSON.parse(decryptedVal as string);
    }
    return fallbackValue;
  } catch (err) {
    return fallbackValue;
  }
};

export { getDecryptedCookie, encrypt, decrypt };

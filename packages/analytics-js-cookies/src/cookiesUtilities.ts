import { fromBase64, toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { COOKIE_KEYS, ENCRYPTION_PREFIX_V3 } from './constants/cookies';
import { cookie } from './component-cookie';

const encryptBrowser = (value: string): string => `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;

const decryptBrowser = (value: string | undefined): string | undefined => {
  if (value?.startsWith(ENCRYPTION_PREFIX_V3)) {
    return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }

  return value;
};

const encrypt = (value: string): string =>
  `${ENCRYPTION_PREFIX_V3}${Buffer.from(value, 'utf-8').toString('base64')}`;

const decrypt = (value: string | undefined): string | undefined => {
  if (value?.startsWith(ENCRYPTION_PREFIX_V3)) {
    return Buffer.from(value.substring(ENCRYPTION_PREFIX_V3.length), 'base64').toString('utf-8');
  }

  return value;
};

const getDecryptedValueBrowser = (value: string): Nullable<string | ApiObject> => {
  const fallbackValue = null;
  try {
    const decryptedVal = decryptBrowser(value);

    if (isNullOrUndefined(decryptedVal)) {
      return fallbackValue;
    }

    return JSON.parse(decryptedVal as string);
  } catch (err) {
    return fallbackValue;
  }
};

const getDecryptedValue = (value: string): Nullable<string | ApiObject> => {
  const fallbackValue = null;
  try {
    const decryptedVal = decrypt(value);

    if (isNullOrUndefined(decryptedVal)) {
      return fallbackValue;
    }

    return JSON.parse(decryptedVal as string);
  } catch (err) {
    return fallbackValue;
  }
};

const getDecryptedCookie = (cookieKey: string): Nullable<string | ApiObject> => {
  if (Object.values(COOKIE_KEYS).includes(cookieKey)) {
    return getDecryptedValue(cookie(cookieKey));
  }
  return null;
};

export {
  getDecryptedCookie,
  encryptBrowser,
  decryptBrowser,
  getDecryptedValue,
  getDecryptedValueBrowser,
};

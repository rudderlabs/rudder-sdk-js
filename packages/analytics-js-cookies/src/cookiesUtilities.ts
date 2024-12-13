import { fromBase64, toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { isNull, isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { cookie } from '@rudderstack/analytics-js-common/src/component-cookie';
import { COOKIE_KEYS, ENCRYPTION_PREFIX_V3 } from './constants/cookies';

const getEncryptedValueInternal = (
  value: string | ApiObject,
  encryptFn: (value: string) => string,
  debug: boolean,
): Nullable<string> => {
  const fallbackValue = null;
  try {
    const strValue = stringifyWithoutCircular(value, false);
    if (isNull(strValue)) {
      return null;
    }
    return encryptFn(strValue);
  } catch (err) {
    if (debug) {
      console.error('Error occurred during encryption: ', err);
    }
    return fallbackValue;
  }
};

const getDecryptedValueInternal = (
  value: string,
  decryptFn: (value: string | undefined) => string | undefined,
  debug: boolean,
): Nullable<string | ApiObject> => {
  const fallbackValue = null;
  try {
    const decryptedVal = decryptFn(value);

    if (isNullOrUndefined(decryptedVal)) {
      return fallbackValue;
    }

    return JSON.parse(decryptedVal as string);
  } catch (err) {
    if (debug) {
      console.error('Error occurred during decryption: ', err);
    }
    return fallbackValue;
  }
};

const encryptBrowser = (value: string): string => `${ENCRYPTION_PREFIX_V3}${toBase64(value)}`;

const decryptBrowser = (value: string | undefined): string | undefined => {
  if (value?.startsWith(ENCRYPTION_PREFIX_V3)) {
    return fromBase64(value.substring(ENCRYPTION_PREFIX_V3.length));
  }

  return value;
};

const getEncryptedValueBrowser = (
  value: string | ApiObject,
  debug: boolean = false,
): Nullable<string> => getEncryptedValueInternal(value, encryptBrowser, debug);

const getDecryptedValueBrowser = (
  value: string,
  debug: boolean = false,
): Nullable<string | ApiObject> => getDecryptedValueInternal(value, decryptBrowser, debug);

const getDecryptedCookieBrowser = (
  cookieKey: string,
  debug: boolean = false,
): Nullable<string | ApiObject> => {
  if (Object.values(COOKIE_KEYS).includes(cookieKey)) {
    return getDecryptedValueBrowser(cookie(cookieKey), debug);
  }
  return null;
};

const encrypt = (value: string): string =>
  `${ENCRYPTION_PREFIX_V3}${Buffer.from(value, 'utf-8').toString('base64')}`;

const decrypt = (value: string | undefined): string | undefined => {
  if (value?.startsWith(ENCRYPTION_PREFIX_V3)) {
    return Buffer.from(value.substring(ENCRYPTION_PREFIX_V3.length), 'base64').toString('utf-8');
  }

  return value;
};

const getDecryptedValue = (value: string, debug: boolean = false): Nullable<string | ApiObject> =>
  getDecryptedValueInternal(value, decrypt, debug);

const getEncryptedValue = (value: string | ApiObject, debug: boolean = false): Nullable<string> =>
  getEncryptedValueInternal(value, encrypt, debug);

export {
  encryptBrowser,
  decryptBrowser,
  getDecryptedValueBrowser,
  getDecryptedCookieBrowser,
  getEncryptedValueBrowser,
  getDecryptedValue,
  getEncryptedValue,
};

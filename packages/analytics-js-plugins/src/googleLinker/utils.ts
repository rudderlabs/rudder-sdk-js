import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { crc32 } from '@rudderstack/analytics-js-plugins/googleLinker/crc32';
import { USER_INTERFACE } from '@rudderstack/analytics-js-plugins/googleLinker/userLib';
import { decode } from '@rudderstack/analytics-js-plugins/googleLinker/base64Decoder';

const KEY_VALIDATOR = /^[\w.-]+$/;
const CHECKSUM_OFFSET_MAX_MIN = 1;
const VALID_VERSION = 1;
const DELIMITER = '*';

/**
 * Parse the linker param value to version checksum and serializedParams
 *
 * @param {string} value
 *
 * @return {?Object}
 */
const parseLinkerParamValue = (value: string): Nullable<Record<string, string>> => {
  const parts = value.split(DELIMITER);
  const isEven = parts.length % 2 === 0;

  if (parts.length < 4 || !isEven) {
    // Format <version>*<checksum>*<key1>*<value1>
    // Note: linker makes sure there's at least one pair of non empty key value
    // Make sure there is at least three delimiters.
    return null;
  }

  const version = Number(parts.shift());
  if (version !== VALID_VERSION) {
    return null;
  }

  const checksum = parts.shift();
  const serializedIds = parts.join(DELIMITER);

  return {
    checksum: checksum ?? '',
    serializedIds,
  };
};

/**
 * Deserialize the serializedIds and return keyValue pairs.
 *
 * @param {string} serializedIds
 *
 * @return {!Object<string, string>}
 */
const deserialize = (serializedIds: string): Record<string, string> => {
  const keyValuePairs: Record<string, string> = {};
  const params = serializedIds.split(DELIMITER);
  for (let i = 0; i < params.length; i += 2) {
    const key = params[i];
    const valid = KEY_VALIDATOR.test(key);
    if (valid) {
      keyValuePairs[key] = decode(params[i + 1]);
    }
  }
  return keyValuePairs;
};

/**
 * Generates a semi-unique value for page visitor.
 *
 * @return {string}
 */
const getFingerprint = (userAgent: string, language: string): string => {
  const date = new Date();
  const timezone = date.getTimezoneOffset();
  return [userAgent, timezone, language].join(DELIMITER);
};

/**
 * Rounded time used to check if t2 - t1 is within our time tolerance.
 * Timestamp in minutes, floored.
 *
 * @return {number}
 */
const getMinSinceEpoch = (): number => Math.floor(Date.now() / 60000);

/**
 * Create a unique checksum hashing the fingerprint and a few other values.
 *
 * @param {string} serializedIds
 * @param {number=} optOffsetMin
 * @param {string} userAgent
 * @param {string} language
 *
 * @return {string}
 */
const getCheckSum = (
  serializedIds: string,
  optOffsetMin: number,
  userAgent: string,
  language: string,
): string => {
  const fingerprint = getFingerprint(userAgent, language);
  const offset = optOffsetMin || 0;
  const timestamp = getMinSinceEpoch() - offset;
  const crc = crc32([fingerprint, timestamp, serializedIds].join(DELIMITER));

  // Encoded to base36 for fewer bytes.
  return crc.toString(36);
};

/**
 * Check if the checksum is valid with time offset tolerance.
 *
 * @param {string} serializedIds
 * @param {string} checksum
 *
 * @return {boolean}
 */
const isCheckSumValid = (serializedIds: string, checksum: string): boolean => {
  const userAgent = USER_INTERFACE.getUserAgent();
  const language = USER_INTERFACE.getUserLanguage();

  for (let i = 0; i <= CHECKSUM_OFFSET_MAX_MIN; i += 1) {
    const calculateCheckSum = getCheckSum(serializedIds, i, userAgent, language);
    if (calculateCheckSum === checksum) {
      return true;
    }
  }

  return false;
};

/**
 * AMP Linker Parser (works for Rudder, GA or any other linker created by following Google's linker standard.)
 *
 * @param {string} value
 *
 * @return {?Object<string, string>}
 */
const parseLinker = (value: string): Nullable<Record<string, string>> => {
  const linkerObj = parseLinkerParamValue(value);

  if (!linkerObj) {
    return null;
  }

  const { checksum, serializedIds } = linkerObj;

  if (!isCheckSumValid(serializedIds, checksum)) {
    return null;
  }

  return deserialize(serializedIds);
};

export { parseLinker };

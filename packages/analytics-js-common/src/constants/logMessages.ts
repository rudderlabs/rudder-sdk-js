import { isString } from '../utilities/checks';

const LOG_CONTEXT_SEPARATOR = ':: ';

const SCRIPT_ALREADY_EXISTS_ERROR = (id: string): string =>
  `A script with the id "${id}" is already loaded. Skipping the loading of this script to prevent conflicts`;

const SCRIPT_LOAD_ERROR = (id: string, url: string, ev: Event | string): string =>
  `Unable to load (${isString(ev) ? ev : ev.type}) the script with the id "${id}" from URL "${url}"`;

const SCRIPT_LOAD_TIMEOUT_ERROR = (id: string, url: string, timeout: number): string =>
  `A timeout of ${timeout} ms occurred while trying to load the script with id "${id}" from URL "${url}"`;

const CIRCULAR_REFERENCE_WARNING = (context: string, key: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}A circular reference has been detected in the object and the property "${key}" has been dropped from the output.`;

const JSON_STRINGIFY_WARNING = `Failed to convert the value to a JSON string.`;

const BAD_DATA_WARNING = (context: string, key: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}A bad data (like circular reference, BigInt) has been detected in the object and the property "${key}" has been dropped from the output.`;

const COOKIE_DATA_ENCODING_ERROR = `Failed to encode the cookie data.`;

export {
  LOG_CONTEXT_SEPARATOR,
  SCRIPT_ALREADY_EXISTS_ERROR,
  SCRIPT_LOAD_ERROR,
  SCRIPT_LOAD_TIMEOUT_ERROR,
  CIRCULAR_REFERENCE_WARNING,
  JSON_STRINGIFY_WARNING,
  BAD_DATA_WARNING,
  COOKIE_DATA_ENCODING_ERROR,
};

const LOG_CONTEXT_SEPARATOR = ':: ';

const SCRIPT_ALREADY_EXISTS_ERROR = (id: string, url: string): string =>
  `A script with the id "${id}" is already loaded. Skipping the loading of this script from URL "${url}" to prevent conflicts`;

const SCRIPT_LOAD_ERROR = (id: string, url: string): string =>
  `Failed to load the script with the id "${id}" from URL "${url}"`;

const SCRIPT_LOAD_TIMEOUT_ERROR = (id: string, url: string, timeout: number): string =>
  `A timeout of ${timeout} ms occurred while trying to load the script with id "${id}" from URL "${url}"`;

const CIRCULAR_REFERENCE_WARNING = (context: string, key: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}A circular reference has been detected in the object and the property "${key}" has been dropped from the output.`;

const JSON_STRINGIFY_WARNING = `Failed to convert the value to a JSON string.`;

export {
  LOG_CONTEXT_SEPARATOR,
  SCRIPT_ALREADY_EXISTS_ERROR,
  SCRIPT_LOAD_ERROR,
  SCRIPT_LOAD_TIMEOUT_ERROR,
  CIRCULAR_REFERENCE_WARNING,
  JSON_STRINGIFY_WARNING,
};

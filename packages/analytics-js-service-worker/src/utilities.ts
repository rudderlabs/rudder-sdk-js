const BATCH_ENDPOINT = 'v1/batch';

/**
 * Checks if provided url is valid or not
 * @param url
 * @returns true if `url` is valid and false otherwise
 */
const isValidUrl = (url: string): boolean => {
  try {
    const validUrl = new URL(url);
    return Boolean(validUrl);
  } catch (err) {
    return false;
  }
};

const removeTrailingSlashes = (inURL: string): string =>
  inURL && inURL.endsWith('/') ? inURL.replace(/\/+$/, '') : inURL;

const isFunction = (value: any): boolean =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

const setImmediate = (callback: () => void) => Promise.resolve().then(callback);

const noop = () => {};

const getDataPlaneUrl = (dataPlaneUrl: string) => {
  // Remove trailing slashes from dataPlaneUrl
  const cleanedDataPlaneUrl = removeTrailingSlashes(dataPlaneUrl);

  // check if the URL ends with /v1/batch endpoint
  // if it's not present, append it to the URL and return the string
  if (cleanedDataPlaneUrl.endsWith(BATCH_ENDPOINT)) {
    return cleanedDataPlaneUrl;
  }

  return `${cleanedDataPlaneUrl}/${BATCH_ENDPOINT}`;
};

export { isValidUrl, isFunction, setImmediate, noop, getDataPlaneUrl };

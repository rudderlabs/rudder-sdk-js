const BATCH_ENDPOINT = 'v1/batch';

const removeTrailingSlashes = (inURL: string): string =>
  // Disabling the rule because the optimized regex may cause
  // super-linear runtime issue due to backtracking
  // eslint-disable-next-line unicorn/better-regex
  inURL && inURL.endsWith('/') ? inURL.replace(/(?:\/+)$/, '') : inURL;

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

export { isFunction, setImmediate, noop, getDataPlaneUrl };

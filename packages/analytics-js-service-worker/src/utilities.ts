import { removeTrailingSlashes } from '@rudderstack/analytics-js-common/utilities/url';

const BATCH_ENDPOINT = 'v1/batch';

const isFunction = (value: any): boolean =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

const setImmediate = (callback: () => void) => Promise.resolve().then(callback);

const noop = () => {};

const getDataPlaneUrl = (dataPlaneUrl: string) => {
  // Remove trailing slashes from dataPlaneUrl
  const cleanedDataPlaneUrl = removeTrailingSlashes(dataPlaneUrl) as string;

  // check if the URL ends with /v1/batch endpoint
  // if it's not present, append it to the URL and return the string
  if (cleanedDataPlaneUrl.endsWith(BATCH_ENDPOINT)) {
    return cleanedDataPlaneUrl;
  }

  return `${cleanedDataPlaneUrl}/${BATCH_ENDPOINT}`;
};

export { isFunction, setImmediate, noop, getDataPlaneUrl };

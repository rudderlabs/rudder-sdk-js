import { Nullable } from '@rudderstack/analytics-js/types';

/**
 * Removes trailing slash from url
 * @param url
 * @returns url
 */
const removeTrailingSlashes = (url: string | null): Nullable<string> =>
  url && url.endsWith('/') ? url.replace(/\/+$/, '') : url;

export { removeTrailingSlashes };

import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { UTMParameters } from '@rudderstack/analytics-js-common/types/EventContext';
/**
 * Removes trailing slash from url
 * @param url
 * @returns url
 */
declare const removeTrailingSlashes: (url: string | null) => Nullable<string>;
/**
 * Checks if provided url is valid or not
 * @param url
 * @returns true if `url` is valid and false otherwise
 */
declare const isValidUrl: (url: string) => boolean;
/**
 * Get the referring domain from the referrer URL
 * @param referrer Page referrer
 * @returns Page referring domain
 */
declare const getReferringDomain: (referrer: string) => string;
/**
 * Extracts UTM parameters from the URL
 * @param url Page URL
 * @returns UTM parameters
 */
declare const extractUTMParameters: (url: string) => UTMParameters;
/**
 * To get the URL until the hash
 * @param url The input URL
 * @returns URL until the hash
 */
declare const getUrlWithoutHash: (url: string) => string;
export {
  removeTrailingSlashes,
  isValidUrl,
  getReferringDomain,
  extractUTMParameters,
  getUrlWithoutHash,
};

import type { UTMParameters } from '@rudderstack/analytics-js-common/types/EventContext';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

/**
 * Removes trailing slash from url
 * @param url
 * @returns url
 */
const removeTrailingSlashes = (url: Nullable<string> | undefined): Nullable<string> | undefined =>
  url?.endsWith('/') ? removeTrailingSlashes(url.substring(0, url.length - 1)) : url;

const getDomain = (url: string): Nullable<string> => {
  try {
    const urlObj = new URL(url);
    return urlObj.host;
  } catch (error) {
    return null;
  }
};

/**
 * Get the referring domain from the referrer URL
 * @param referrer Page referrer
 * @returns Page referring domain
 */
const getReferringDomain = (referrer: string): string => getDomain(referrer) ?? '';

/**
 * Extracts UTM parameters from the URL
 * @param url Page URL
 * @returns UTM parameters
 */
const extractUTMParameters = (url: string): UTMParameters => {
  const result: UTMParameters = {};
  try {
    const urlObj = new URL(url);
    const UTM_PREFIX = 'utm_';
    urlObj.searchParams.forEach((value, sParam) => {
      if (sParam.startsWith(UTM_PREFIX)) {
        let utmParam = sParam.substring(UTM_PREFIX.length);
        // Not sure why we're doing this
        if (utmParam === 'campaign') {
          utmParam = 'name';
        }
        result[utmParam] = value;
      }
    });
  } catch (error) {
    // Do nothing
  }
  return result;
};

/**
 * To get the URL until the hash
 * @param url The input URL
 * @returns URL until the hash
 */
const getUrlWithoutHash = (url: string): string => {
  let urlWithoutHash = url;
  try {
    const urlObj = new URL(url);
    urlWithoutHash = urlObj.origin + urlObj.pathname + urlObj.search;
  } catch (error) {
    // Do nothing
  }
  return urlWithoutHash;
};

export {
  removeTrailingSlashes,
  getReferringDomain,
  extractUTMParameters,
  getUrlWithoutHash,
  getDomain,
};

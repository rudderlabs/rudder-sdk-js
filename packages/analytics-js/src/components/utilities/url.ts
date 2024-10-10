import type { UTMParameters } from '@rudderstack/analytics-js-common/types/EventContext';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

const getDomain = (url: string): Nullable<string> => {
  try {
    const urlObj = new URL(url);
    return urlObj.host;
  } catch {
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
  } catch {
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
  } catch {
    // Do nothing
  }
  return urlWithoutHash;
};

export { getReferringDomain, extractUTMParameters, getUrlWithoutHash, getDomain };

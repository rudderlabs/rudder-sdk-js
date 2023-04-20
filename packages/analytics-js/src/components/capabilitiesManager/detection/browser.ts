import { Nullable } from '@rudderstack/analytics-js/types';
import { UTMParameters } from '@rudderstack/analytics-js/state/types';

export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const isNode = (): boolean =>
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

export const hasCrypto = (): boolean =>
  Boolean(window.crypto && typeof window.crypto.getRandomValues === 'function');

// eslint-disable-next-line compat/compat
export const hasUAClientHints = (): boolean => Boolean(window.navigator.userAgentData);

// eslint-disable-next-line compat/compat
export const hasBeacon = (): boolean => Boolean(window.navigator.sendBeacon);

export const getUserAgent = (): Nullable<string> => {
  if (typeof window.navigator === 'undefined') {
    return null;
  }

  let { userAgent } = window.navigator;
  const { brave } = window.navigator as any;

  // For supporting Brave browser detection,
  // add "Brave/<version>" to the user agent with the version value from the Chrome component
  if (brave && Object.getPrototypeOf(brave).isBrave) {
    // Example:
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
    const matchedArr = userAgent.match(/(chrome)\/([\w.]+)/i);

    if (matchedArr) {
      userAgent = `${userAgent} Brave/${matchedArr[2]}`;
    }
  }

  return userAgent;
};

export const getLanguage = (): Nullable<string> => {
  if (typeof window.navigator === 'undefined') {
    return null;
  }

  return window.navigator.language || (window.navigator as any).browserLanguage;
};

/**
 * To get the canonical URL of the page
 * @returns canonical URL
 */
export const getCanonicalUrl = (): string => {
  const tags = [...document.getElementsByTagName('link')];
  let canonicalUrl: Nullable<string> = '';
  tags.some(tag => {
    if (tag.getAttribute('rel') === 'canonical') {
      canonicalUrl = tag.getAttribute('href');
      return true;
    }
    return false;
  });
  return canonicalUrl;
};

/**
 * To get the URL until the hash
 * @param url The input URL
 * @returns URL until the hash
 */
export const getUrlWithoutHash = (url: string): string => {
  let urlWithoutHash = url;
  try {
    const urlObj = new URL(url);
    urlWithoutHash = urlObj.origin + urlObj.pathname + urlObj.search;
  } catch (error) {
    // Do nothing
  }
  return urlWithoutHash;
}

/**
 * Get the referrer URL
 * @returns The referrer URL
 */
export const getReferrer = (): string => document.referrer || '$direct'

/**
 * Get the referring domain from the referrer URL
 * @param referrer Page referrer
 * @returns Page referring domain
 */
export const getReferringDomain = (referrer: string) => {
  let referringDomain = '';
  try {
    const url = new URL(referrer);
    referringDomain = url.host;
  } catch (error) {
    // Do nothing
  }
  return referringDomain;
};

/**
 * Extracts UTM parameters from the URL
 * @param url Page URL
 * @returns UTM parameters
 */
export const extractUTMParameters = (url: string): UTMParameters => {
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
}

/**
 * Default page properties
 * @returns Default page properties
 */
export const getDefaultPageProperties = () => {
  const canonicalUrl = getCanonicalUrl();
  let path = window.location.pathname;
  const { href: tabUrl } = window.location;
  let pageUrl = tabUrl;
  const { search } = window.location;
  if (canonicalUrl) {
    try {
      // The logic in v1.1 was to use parse from component-url
      const urlObj = new URL(canonicalUrl);
      if (urlObj.search === '') pageUrl = canonicalUrl + search;

      path = urlObj.pathname;
    } catch (err) {
      // Do nothing
    }
  }

  const url = getUrlWithoutHash(pageUrl);
  const { title } = document;
  const referrer = getReferrer();
  return {
    path,
    referrer,
    referring_domain: getReferringDomain(referrer),
    search,
    title,
    url,
    tab_url: tabUrl,
  };
};

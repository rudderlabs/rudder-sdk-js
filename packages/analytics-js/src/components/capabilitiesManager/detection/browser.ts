import { Nullable } from '@rudderstack/analytics-js/types';
import { UTMParameters } from '@rudderstack/analytics-js/state/types';

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const isNode = (): boolean =>
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const hasCrypto = (): boolean =>
  Boolean(window.crypto && typeof window.crypto.getRandomValues === 'function');

// eslint-disable-next-line compat/compat
const hasUAClientHints = (): boolean => Boolean(window.navigator.userAgentData);

// eslint-disable-next-line compat/compat
const hasBeacon = (): boolean => Boolean(window.navigator.sendBeacon);

const getUserAgent = (): Nullable<string> => {
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

const getLanguage = (): Nullable<string> => {
  if (typeof window.navigator === 'undefined') {
    return null;
  }

  return window.navigator.language || (window.navigator as any).browserLanguage;
};

/**
 * To get the canonical URL of the page
 * @returns canonical URL
 */
function getCanonicalUrl() {
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
}

/**
 * To get the URL until the hash
 * @param url The input URL
 * @returns URL until the hash
 */
function getUrlWithoutHash(url: string) {
  const hashIndex = url.indexOf('#');
  return hashIndex > -1 ? url.slice(0, hashIndex) : url;
}

function getReferrer() {
  return document.referrer || '$direct';
}

function getReferringDomain(referrer: string) {
  const split = referrer.split('/');
  if (split.length >= 3) {
    return split[2];
  }
  return '';
}

function extractUTMParameters(url: string): UTMParameters {
  const urlObj = new URL(url);
  const result: UTMParameters = {};
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

  return result;
}

function getDefaultPageProperties() {
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
}

export {
  isBrowser,
  isNode,
  hasCrypto,
  hasUAClientHints,
  hasBeacon,
  getUserAgent,
  getLanguage,
  getDefaultPageProperties,
  extractUTMParameters,
};

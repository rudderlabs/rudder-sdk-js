import { Nullable } from '@rudderstack/analytics-js/types';
import { isUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { getReferringDomain, getUrlWithoutHash } from './url';

/**
 * Get the referrer URL
 * @returns The referrer URL
 */
const getReferrer = (): string => document.referrer || '$direct';

/**
 * To get the canonical URL of the page
 * @returns canonical URL
 */
const getCanonicalUrl = (): string => {
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

const getUserAgent = (): Nullable<string> => {
  if (isUndefined(window.navigator)) {
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
  if (isUndefined(window.navigator)) {
    return null;
  }

  return window.navigator.language ?? (window.navigator as any).browserLanguage;
};

/**
 * Default page properties
 * @returns Default page properties
 */
const getDefaultPageProperties = (): Record<string, any> => {
  const canonicalUrl = getCanonicalUrl();
  let path = window.location.pathname;
  const { href: tabUrl } = window.location;
  let pageUrl = tabUrl;
  const { search } = window.location;
  if (canonicalUrl) {
    try {
      const urlObj = new URL(canonicalUrl);
      if (urlObj.search === '') {
        pageUrl = canonicalUrl + search;
      }

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

export { getCanonicalUrl, getReferrer, getUserAgent, getLanguage, getDefaultPageProperties };

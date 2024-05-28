import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { getReferringDomain, getUrlWithoutHash } from './url';

/**
 * Get the referrer URL
 * @returns The referrer URL
 */
const getReferrer = (): string => document?.referrer || '$direct';

/**
 * To get the canonical URL of the page
 * @returns canonical URL
 */
const getCanonicalUrl = (): string => {
  const tags = document.getElementsByTagName('link');
  let canonicalUrl = '';

  for (let i = 0; tags[i]; i += 1) {
    const tag = tags[i] as HTMLLinkElement;
    if (tag.getAttribute('rel') === 'canonical' && !canonicalUrl) {
      canonicalUrl = tag.getAttribute('href') ?? '';
      break;
    }
  }

  return canonicalUrl;
};

const getUserAgent = (): Nullable<string> => {
  if (isUndefined(globalThis.navigator)) {
    return null;
  }

  let { userAgent } = globalThis.navigator;
  const { brave } = globalThis.navigator as any;

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
  if (isUndefined(globalThis.navigator)) {
    return null;
  }

  return globalThis.navigator.language ?? (globalThis.navigator as any).browserLanguage;
};

/**
 * Default page properties
 * @returns Default page properties
 */
const getDefaultPageProperties = (): Record<string, any> => {
  const canonicalUrl = getCanonicalUrl();
  let path = globalThis.location.pathname;
  const { href: tabUrl } = globalThis.location;
  let pageUrl = tabUrl;
  const { search } = globalThis.location;

  // If valid canonical URL is provided use this as page URL.
  if (canonicalUrl) {
    try {
      const urlObj = new URL(canonicalUrl);
      // If existing, query params of canonical URL will be used instead of the location.search ones
      if (urlObj.search === '') {
        pageUrl = canonicalUrl + search;
      } else {
        pageUrl = canonicalUrl;
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
